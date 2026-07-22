<template>
  <div class="penalty-game">
    <canvas ref="canvas"></canvas>
    <div class="hud">
      <div class="stat">{{ $t('games.shot', {current: Math.min(shotIndex + 1, TOTAL_SHOTS), total: TOTAL_SHOTS}) }}</div>
      <div class="tally">
        <span v-for="(result, index) in shots" :key="index" class="dot"
              :class="{goal: result === 'goal', fail: result && result !== 'goal'}"></span>
      </div>
      <div class="stat small" v-if="best">{{ $t('games.best') }}: {{ best }}/{{ TOTAL_SHOTS }}</div>
    </div>
    <div v-if="feedbackKey" class="feedback-banner" :class="{good: feedbackKey === 'games.goal'}">
      {{ $t(feedbackKey) }}
    </div>
    <div v-if="state === 'ready'" class="panel">
      <p>{{ $t('games.penaltyHint') }}</p>
      <button @click="start">{{ $t('games.start') }}</button>
    </div>
    <div v-else-if="state === 'done'" class="panel">
      <h3>{{ score >= WIN_SCORE ? $t('games.youWin') : $t('games.youLose') }}</h3>
      <p>{{ $t('games.score') }}: {{ score }}/{{ TOTAL_SHOTS }}</p>
      <p v-if="best">{{ $t('games.best') }}: {{ best }}/{{ TOTAL_SHOTS }}</p>
      <button @click="start">{{ $t('games.retry') }}</button>
    </div>
  </div>
</template>

<script>
import GameLoop from "@/utils/game/GameLoop";
import Input from "@/utils/game/Input";
import {getHighScore, submitHighScore} from "@/utils/game/HighScores";

const TOTAL_SHOTS = 5;
const WIN_SCORE = 3;
const BALL_RADIUS = 9;
const DEFENDER_RADIUS = 17; // a bit smaller than the sprite so a curl grazing past gets through
const KEEPER_HALF_WIDTH = 30;
const MIN_SHOT_SPEED = 460;
const MAX_SHOT_SPEED = 950;
const SWIPE_SPEED_FACTOR = 0.45; // pointer speed -> ball speed
const MIN_SWIPE_LENGTH = 40;
// Curve: the ball traces the swipe. It bends by the angle between the swipe's
// start heading and its end heading (ignored below a small dead angle), spread
// over the flight so the curl looks the same at any shot power.
const MAX_CURVE_RATE = 6;     // safety cap on rad/s
const FEEDBACK_SECONDS = 1.1;

// Top-down waterpolo player: cap + spread arms in the water.
// 'C' is replaced by the cap color per player role.
const PLAYER_TOPDOWN = [
    '....CCC....',
    '...CCCCC...',
    '...CCCCC...',
    'SSSSSSSSSSS',
    'SS..SSS..SS',
    '.S...S...S.',
];
// Four defender formations (fractions of goalWidth around centre, and of
// height down the pool). A different one is used for each shot.
const FORMATIONS = [
    // 0: classic — one central + two high wings
    [{fx: 0, fy: 0.47}, {fx: -0.62, fy: 0.33}, {fx: 0.62, fy: 0.33}],
    // 1: staggered diagonal wall
    [{fx: -0.5, fy: 0.30}, {fx: 0, fy: 0.42}, {fx: 0.5, fy: 0.54}],
    // 2: two low blockers + one guarding the centre near the keeper
    [{fx: -0.45, fy: 0.52}, {fx: 0.45, fy: 0.52}, {fx: 0, fy: 0.30}],
    // 3: tight central pair + one wide low
    [{fx: -0.2, fy: 0.40}, {fx: 0.2, fy: 0.40}, {fx: 0.72, fy: 0.55}],
];
// Shooter start positions along the 5m line (fraction of width from centre).
const SHOOTER_OFFSETS = [-0.22, -0.11, 0, 0.11, 0.22];

const SPRITE_SCALE = 4;
const PLAYER_WIDTH = 11 * SPRITE_SCALE;
const PLAYER_HEIGHT = 6 * SPRITE_SCALE;
const SKIN = '#e8b98f';
const CAPS = {
    shooter: '#FFFFFF',
    defender: '#111112',
    keeper: '#FF6B6B',
};

export default {
  name: "PenaltyGame",
  data() {
    return {
      TOTAL_SHOTS,
      WIN_SCORE,
      state: 'ready', // ready | playing | done
      shotIndex: 0,
      shots: Array(TOTAL_SHOTS).fill(null),
      feedbackKey: null,
      best: getHighScore('penalty.best'),
    }
  },
  computed: {
    score() {
      return this.shots.filter(result => result === 'goal').length;
    }
  },
  created() {
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.loop = null;
    this.input = null;
    this.world = null;
    this.onResizeBound = null;
    this.onVisibilityBound = null;
  },
  mounted() {
    const canvas = this.$refs.canvas;
    this.resizeCanvas();
    this.ctx = canvas.getContext('2d');

    this.input = new Input(canvas)
        .on('down', pointer => this.onPointerDown(pointer))
        .on('move', pointer => this.onPointerMove(pointer))
        .on('up', pointer => this.onPointerUp(pointer));

    this.resetWorld();
    this.loop = new GameLoop({
      update: dt => this.update(dt),
      render: () => this.render(),
    });
    this.loop.start();

    this.onResizeBound = () => {
      this.resizeCanvas();
      this.resetBall();
    };
    this.onVisibilityBound = () => {
      if (document.hidden) {
        this.loop.pause();
      } else {
        this.loop.resume();
      }
    };
    window.addEventListener('resize', this.onResizeBound);
    document.addEventListener('visibilitychange', this.onVisibilityBound);
  },
  unmounted() {
    this.loop.stop();
    this.input.destroy();
    window.removeEventListener('resize', this.onResizeBound);
    document.removeEventListener('visibilitychange', this.onVisibilityBound);
  },
  methods: {
    resizeCanvas() {
      const canvas = this.$refs.canvas;
      if (!canvas) {
        return;
      }
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.width = rect.width;
      this.height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    },
    // Layout anchors, recomputed from the current canvas size + the current
    // shot's setup (shooter position + defender formation).
    geometry() {
      const width = this.width;
      const height = this.height;
      const centerX = width / 2;
      const goalLineY = height * 0.12;
      const goalWidth = Math.min(width * 0.36, 360);
      const variant = this.world ? this.world.variant : 0;
      const shooterOffset = this.world ? this.world.shooterOffset : 0;
      return {
        centerX,
        goalLineY,
        goalWidth,
        twoMeterY: height * 0.26,
        fiveMeterY: height * 0.62,
        keeperY: goalLineY + 22,
        ballStartX: centerX + shooterOffset * width,
        ballStartY: height * 0.72,
        defenders: FORMATIONS[variant].map(spot => ({
          x: centerX + spot.fx * goalWidth,
          y: height * spot.fy,
        })),
      };
    },
    resetWorld() {
      this.world = {
        ball: {x: 0, y: 0, vx: 0, vy: 0, omega: 0, inFlight: false},
        swipe: null, // recorded gesture samples [{x, y, t}]
        keeperPhase: Math.random() * Math.PI * 2,
        keeperSpeed: 1.6,
        flightTime: 0,
        feedbackTimer: 0,
        variant: 0,
        shooterOffset: 0,
      };
      this.nextSetup();
      this.resetBall();
    },
    // Pick a fresh defender formation + shooter position for the next shot,
    // avoiding an immediate repeat so every shot looks different.
    nextSetup() {
      const world = this.world;
      world.variant = (world.variant + 1 + Math.floor(Math.random() * (FORMATIONS.length - 1))) % FORMATIONS.length;
      let offset = world.shooterOffset;
      while (offset === world.shooterOffset) {
        offset = SHOOTER_OFFSETS[Math.floor(Math.random() * SHOOTER_OFFSETS.length)];
      }
      world.shooterOffset = offset;
    },
    resetBall() {
      const geometry = this.geometry();
      const ball = this.world.ball;
      ball.x = geometry.ballStartX;
      ball.y = geometry.ballStartY;
      ball.vx = 0;
      ball.vy = 0;
      ball.omega = 0;
      ball.inFlight = false;
      this.world.swipe = null;
    },
    start() {
      this.shots = Array(TOTAL_SHOTS).fill(null);
      this.shotIndex = 0;
      this.feedbackKey = null;
      this.state = 'playing';
      this.world.keeperSpeed = 1.6;
      this.nextSetup();
      this.resetBall();
    },
    keeperX() {
      const geometry = this.geometry();
      const range = geometry.goalWidth / 2 - KEEPER_HALF_WIDTH;
      return geometry.centerX + Math.sin(this.world.keeperPhase) * range;
    },
    onPointerDown(pointer) {
      if (this.state !== 'playing' || this.world.ball.inFlight || this.feedbackKey) {
        return;
      }
      const ball = this.world.ball;
      // The swipe must start on (or right next to) the ball.
      if (Math.hypot(pointer.x - ball.x, pointer.y - ball.y) < 80) {
        this.world.swipe = {samples: [{x: pointer.x, y: pointer.y, t: performance.now()}]};
      }
    },
    onPointerMove(pointer) {
      const swipe = this.world.swipe;
      if (swipe) {
        swipe.samples.push({x: pointer.x, y: pointer.y, t: performance.now()});
        if (swipe.samples.length > 80) {
          swipe.samples.shift();
        }
      }
    },
    onPointerUp() {
      const swipe = this.world.swipe;
      this.world.swipe = null;
      if (!swipe || swipe.samples.length < 3) {
        return;
      }
      const samples = swipe.samples;
      const first = samples[0];
      const last = samples[samples.length - 1];
      const totalX = last.x - first.x;
      const totalY = last.y - first.y;
      const totalLength = Math.hypot(totalX, totalY);
      const totalSeconds = Math.max(0.016, (last.t - first.t) / 1000);
      if (totalLength < MIN_SWIPE_LENGTH || totalY >= 0) {
        // Too short, or the swipe as a whole doesn't go towards the goal.
        return;
      }

      // Speed: the fastest 60-140ms stretch anywhere in the gesture, so a
      // finger that decelerates before lifting still gets its flick power.
      let peakSpeed = 0;
      for (let i = 0; i < samples.length - 1; i++) {
        for (let j = i + 1; j < samples.length; j++) {
          const windowMs = samples[j].t - samples[i].t;
          if (windowMs < 60) {
            continue;
          }
          if (windowMs > 140) {
            break;
          }
          const windowSpeed = Math.hypot(samples[j].x - samples[i].x, samples[j].y - samples[i].y) / (windowMs / 1000);
          peakSpeed = Math.max(peakSpeed, windowSpeed);
        }
      }
      const averageSpeed = totalLength / totalSeconds;
      const pointerSpeed = Math.max(peakSpeed, averageSpeed);
      const speed = Math.min(Math.max(pointerSpeed * SWIPE_SPEED_FACTOR, MIN_SHOT_SPEED), MAX_SHOT_SPEED);

      // Aim-assisted curl (Milo's "curve to where my finger stops"): the ball
      // LAUNCHES in the direction the swipe starts (so you can send it wide
      // around a defender) and curves exactly enough to ARRIVE where the whole
      // swipe points (its start->lift line, extended to the goal line). This
      // auto-scales the curl to the target, so it never under- or overshoots.
      const cum = [0];
      for (let i = 0; i < samples.length - 1; i++) {
        cum.push(cum[i] + Math.hypot(samples[i + 1].x - samples[i].x, samples[i + 1].y - samples[i].y));
      }
      const pathLength = cum[cum.length - 1] || 1;
      const sampleAtLength = target => {
        for (let k = 0; k < cum.length; k++) {
          if (cum[k] >= target) {
            return samples[k];
          }
        }
        return samples[samples.length - 1];
      };
      const startPoint = samples[0];
      const launchPoint = sampleAtLength(Math.min(70, pathLength * 0.3));

      // Launch heading (first stretch of the stroke).
      let dirX = launchPoint.x - startPoint.x;
      let dirY = launchPoint.y - startPoint.y;
      if (Math.hypot(dirX, dirY) < 12) {
        dirX = totalX;
        dirY = totalY;
      }
      const dirLength = Math.hypot(dirX, dirY) || 1;

      const ball = this.world.ball;
      const goalLineY = this.geometry().goalLineY;
      let omega = 0;
      let targetX = ball.x;
      // Aim: extend the overall swipe (start -> lift) to the goal line.
      if (totalY < -20) {
        targetX = ball.x + totalX * (goalLineY - ball.y) / totalY;
        targetX = Math.max(ball.x - this.width, Math.min(ball.x + this.width, targetX));
        // Constant-turn arc from the ball (heading = launch dir) through the
        // target: solve R so the circle passes through it, then omega = v / R.
        const vx = dirX / dirLength;
        const vy = dirY / dirLength;
        const nx = -vy; // left-hand normal of the launch heading
        const ny = vx;
        const dx = ball.x - targetX;
        const dy = ball.y - goalLineY;
        const denom = nx * dx + ny * dy;
        if (Math.abs(denom) > 1) {
          const radius = -(dx * dx + dy * dy) / (2 * denom);
          omega = Math.max(-MAX_CURVE_RATE, Math.min(MAX_CURVE_RATE, speed / radius));
        }
      }

      ball.vx = dirX / dirLength * speed;
      ball.vy = dirY / dirLength * speed;
      ball.omega = omega;
      ball.inFlight = true;
      this.world.flightTime = 0;
    },
    update(dt) {
      const world = this.world;
      // The keeper never stops patrolling — timing is the whole game.
      world.keeperPhase += world.keeperSpeed * dt;

      if (this.feedbackKey) {
        world.feedbackTimer -= dt;
        if (world.feedbackTimer <= 0) {
          this.feedbackKey = null;
          if (this.shotIndex >= TOTAL_SHOTS) {
            this.finish();
          } else {
            // Fresh defender formation + shooter position for every shot.
            this.nextSetup();
            this.resetBall();
          }
        }
        return;
      }

      const ball = world.ball;
      if (this.state !== 'playing' || !ball.inFlight) {
        return;
      }

      world.flightTime += dt;
      // Curve: a bent swipe puts spin on the ball, rotating its velocity.
      if (ball.omega) {
        const angle = ball.omega * dt;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const vx = ball.vx * cos - ball.vy * sin;
        ball.vy = ball.vx * sin + ball.vy * cos;
        ball.vx = vx;
      }
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      const geometry = this.geometry();
      // Defender block?
      for (const defender of geometry.defenders) {
        if (Math.hypot(ball.x - defender.x, ball.y - defender.y) < DEFENDER_RADIUS + BALL_RADIUS) {
          return this.endShot('blocked');
        }
      }
      // Keeper save?
      if (Math.abs(ball.y - geometry.keeperY) < 16 + BALL_RADIUS
          && Math.abs(ball.x - this.keeperX()) < KEEPER_HALF_WIDTH + BALL_RADIUS) {
        return this.endShot('saved');
      }
      // Goal line crossed?
      if (ball.y - BALL_RADIUS <= geometry.goalLineY) {
        const insideGoal = Math.abs(ball.x - geometry.centerX) < geometry.goalWidth / 2 - 6;
        return this.endShot(insideGoal ? 'goal' : 'missed');
      }
      // Out of bounds / too slow.
      if (ball.x < -30 || ball.x > this.width + 30 || world.flightTime > 3) {
        return this.endShot('missed');
      }
    },
    endShot(result) {
      const keys = {
        goal: 'games.goal',
        saved: 'games.saved',
        blocked: 'games.blocked',
        missed: 'games.missed',
      };
      this.shots[this.shotIndex] = result;
      this.shotIndex++;
      this.feedbackKey = keys[result];
      this.world.feedbackTimer = FEEDBACK_SECONDS;
      this.world.ball.inFlight = false;
      // The keeper gets a little faster after every conceded goal.
      if (result === 'goal') {
        this.world.keeperSpeed += 0.35;
      }
    },
    finish() {
      this.state = 'done';
      submitHighScore('penalty.best', this.score);
      this.best = getHighScore('penalty.best');
    },
    render() {
      const ctx = this.ctx;
      if (!ctx) {
        return;
      }
      const width = this.width;
      const height = this.height;
      const geometry = this.geometry();
      const world = this.world;

      // Water.
      ctx.fillStyle = '#1889E6';
      ctx.fillRect(0, 0, width, height);
      // Subtle ripple rows.
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      for (let y = 24; y < height; y += 48) {
        ctx.fillRect(0, y, width, 6);
      }

      // Pool lines, in the style of the CSS pool: white border, red 2m, yellow 5m.
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 5;
      ctx.strokeRect(8, 8, width - 16, height - 16);
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(8, geometry.twoMeterY, width - 16, 4);
      ctx.fillStyle = '#FFD93D';
      ctx.fillRect(8, geometry.fiveMeterY, width - 16, 4);

      // Goal: net band above the goal line + posts.
      const goalLeft = geometry.centerX - geometry.goalWidth / 2;
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(goalLeft, geometry.goalLineY - 34, geometry.goalWidth, 34);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1;
      for (let x = goalLeft; x <= goalLeft + geometry.goalWidth; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, geometry.goalLineY - 34);
        ctx.lineTo(x, geometry.goalLineY);
        ctx.stroke();
      }
      for (let y = geometry.goalLineY - 34; y <= geometry.goalLineY; y += 8) {
        ctx.beginPath();
        ctx.moveTo(goalLeft, y);
        ctx.lineTo(goalLeft + geometry.goalWidth, y);
        ctx.stroke();
      }
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(goalLeft - 6, geometry.goalLineY - 40, 6, 46);
      ctx.fillRect(goalLeft + geometry.goalWidth, geometry.goalLineY - 40, 6, 46);
      ctx.fillRect(goalLeft - 6, geometry.goalLineY, geometry.goalWidth + 12, 5);

      // Players.
      for (const defender of geometry.defenders) {
        this.renderPlayer(defender.x, defender.y, CAPS.defender);
      }
      this.renderPlayer(this.keeperX(), geometry.keeperY, CAPS.keeper);
      this.renderPlayer(geometry.ballStartX, geometry.ballStartY + 34, CAPS.shooter);

      // Swipe trail while the gesture is being drawn.
      const ball = world.ball;
      if (world.swipe && world.swipe.samples.length > 1) {
        const samples = world.swipe.samples;
        for (let index = 0; index < samples.length; index++) {
          const alpha = 0.15 + (index / samples.length) * 0.75;
          const size = 4 + (index / samples.length) * 6;
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.fillRect(samples[index].x - size / 2, samples[index].y - size / 2, size, size);
        }
      }

      // Ball: pixel waterpolo ball.
      ctx.fillStyle = '#FFD93D';
      ctx.fillRect(ball.x - 8, ball.y - 4, 16, 8);
      ctx.fillRect(ball.x - 4, ball.y - 8, 8, 16);
      ctx.fillStyle = '#e8a33d';
      ctx.fillRect(ball.x - 4, ball.y - 2, 8, 4);
    },
    renderPlayer(x, y, capColor) {
      const ctx = this.ctx;
      // Water ripple ring under the player.
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(x - PLAYER_WIDTH / 2 - 4, y + PLAYER_HEIGHT / 2 - 4, PLAYER_WIDTH + 8, 4);
      for (let row = 0; row < PLAYER_TOPDOWN.length; row++) {
        const line = PLAYER_TOPDOWN[row];
        for (let col = 0; col < line.length; col++) {
          const char = line[col];
          if (char === '.') {
            continue;
          }
          ctx.fillStyle = char === 'C' ? capColor : SKIN;
          ctx.fillRect(
              x - PLAYER_WIDTH / 2 + col * SPRITE_SCALE,
              y - PLAYER_HEIGHT / 2 + row * SPRITE_SCALE,
              SPRITE_SCALE,
              SPRITE_SCALE
          );
        }
      }
    },
  }
}
</script>

<style scoped lang="scss">
.penalty-game {
  position: absolute;
  inset: 0;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    touch-action: none;
  }

  .hud {
    position: absolute;
    top: calc(0.75em + env(safe-area-inset-top, 0px));
    left: 0.75em;
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    gap: 6px;
    text-align: left;

    .stat {
      background: rgba(0, 0, 0, 0.75);
      color: $white;
      font-weight: bold;
      font-size: 18px;
      padding: 2px 10px;
      border-radius: 6px;

      &.small {
        font-size: 14px;
      }
    }

    .tally {
      display: flex;
      gap: 6px;
      background: rgba(0, 0, 0, 0.75);
      padding: 6px 10px;
      border-radius: 6px;

      .dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.35);

        &.goal {
          background: $green;
        }

        &.fail {
          background: $red;
        }
      }
    }
  }

  .feedback-banner {
    position: absolute;
    top: 34%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: $red;
    font-size: 30px;
    font-weight: bold;
    padding: 10px 26px;
    border-radius: 10px;
    white-space: nowrap;

    &.good {
      color: $green;
    }
  }

  .panel {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.85);
    color: $white;
    padding: 1.5em 2em;
    border-radius: 14px;
    text-align: center;
    max-width: 85%;

    h3 {
      color: $white;
      font-size: 28px;
      margin-bottom: 0.5em;
    }

    p {
      color: $white;
      font-size: 18px;
      margin-bottom: 0.75em;
    }

    button {
      border: none;
      border-radius: 8px;
      background: $blue;
      color: $white;
      font-family: inherit;
      font-size: 20px;
      font-weight: bold;
      padding: 10px 28px;
      cursor: pointer;
    }
  }

  @include mobile {
    .panel {
      width: calc(100% - 1.5em);
      max-width: none;
      padding: 1.25em 1em;

      p {
        font-size: 16px;
      }
    }
  }
}
</style>
