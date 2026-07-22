<template>
  <div class="air-hockey-game">
    <canvas ref="canvas"></canvas>
    <div class="hud">
      <div class="score">
        <span class="chip p1"></span>
        {{ scores.p1 }} : {{ scores.p2 }}
        <span class="chip p2"></span>
      </div>
      <div class="stat" v-if="state !== 'ready' && mode === 1 && bestStreak">
        {{ $t('games.winStreak') }}: {{ streak }} · {{ $t('games.best') }}: {{ bestStreak }}
      </div>
    </div>
    <div v-if="feedbackKey" class="feedback-banner" :class="{good: feedbackGood}">
      {{ $t(feedbackKey) }}
    </div>
    <div v-if="state === 'ready'" class="panel">
      <h3>{{ $t('games.choosePlayers') }}</h3>
      <p>{{ $t('games.airHockeyHint') }}</p>
      <div class="buttons">
        <button @click="start(1)">{{ $t('games.onePlayer') }}</button>
        <button @click="start(2)">{{ $t('games.twoPlayers') }}</button>
      </div>
    </div>
    <div v-else-if="state === 'done'" class="panel">
      <h3>{{ resultTitle }}</h3>
      <p>{{ $t('games.score') }}: {{ scores.p1 }} : {{ scores.p2 }}</p>
      <p v-if="mode === 1">
        {{ $t('games.winStreak') }}: {{ streak }}<span v-if="bestStreak"> · {{ $t('games.best') }}: {{ bestStreak }}</span>
      </p>
      <div class="buttons">
        <button @click="start(mode)">{{ $t('games.rematch') }}</button>
        <button class="secondary" @click="state = 'ready'">{{ $t('games.choosePlayers') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import GameLoop from "@/utils/game/GameLoop";
import Input from "@/utils/game/Input";
import {getHighScore, setScore, submitHighScore} from "@/utils/game/HighScores";

const WIN_SCORE = 5;
const SUBSTEPS = 4;             // 120Hz loop x 4 = 480 physics steps/s, no tunneling
const BALL_RADIUS = 10;
const STRIKER_RADIUS = 26;
const WALL_SIDE = 8;            // side wall inset
const WALL_END = 34;            // end wall inset, leaves room for the goal net pocket
const POINTER_SPEED = 1900;     // px/s cap when a striker chases a finger/mouse
const KEY_SPEED = 520;          // px/s for keyboard strikers
const AI_BASE_SPEED = 250;
const AI_RAMP = 50;             // extra px/s per goal the player scored this match
const AI_DEFENSE_FACTOR = 0.6;  // defending is slower than attacking, so corners + hard shots can score
const AI_REACTION = 0.12;       // seconds between AI decisions (human-ish lag)
// The AI also grows with the player's win streak (caps at 8 wins): faster,
// quicker to react and covering more of the goal. A first match stays friendly.
const AI_STREAK_CAP = 8;
const AI_STREAK_SPEED = 30;     // extra px/s per win in the streak
const AI_STREAK_REACTION = 0.005;
const AI_STREAK_DEFENSE = 0.015;
const MAX_BALL_SPEED = 1500;
const BALL_DAMPING = 0.35;      // fraction of speed kept per second (grass, not ice)
const WALL_RESTITUTION = 0.88;
const HIT_RESTITUTION = 0.85;
const FEEDBACK_SECONDS = 1.1;

// Top-down pixel footballer: shirt shoulders around a head of hair, hands out.
// 'C' is replaced by the kit color per player.
const PLAYER_TOPDOWN = [
    '...CCCCC...',
    '..CCCCCCC..',
    '.CCCHHHCCC.',
    '.CCHHHHHCC.',
    'KCCHHHHHCCK',
    'KCCHHHHHCCK',
    '.CCHHHHHCC.',
    '.CCCHHHCCC.',
    '..CCCCCCC..',
    '...CCCCC...',
];
const BALL_SPRITE = [
    '.WWW.',
    'WWBWW',
    'WBBBW',
    'WWBWW',
    '.WWW.',
];
const SPRITE_SCALE = 4;
const KITS = {
    p1: {main: '#FF6B6B', glow: 'rgba(255, 107, 107, 0.3)'},
    p2: {main: '#1889E6', glow: 'rgba(24, 137, 230, 0.3)'},
};
const HAIR = '#40291a';
const SKIN = '#e8b98f';

export default {
  name: "AirHockeyGame",
  data() {
    return {
      state: 'ready', // ready | playing | done
      mode: 1,        // 1 = vs AI, 2 = local 2P
      scores: {p1: 0, p2: 0},
      feedbackKey: null,
      feedbackGood: false,
      streak: getHighScore('airhockey.streak'),
      bestStreak: getHighScore('airhockey.bestStreak'),
    }
  },
  computed: {
    resultTitle() {
      if (this.mode === 1) {
        return this.scores.p1 > this.scores.p2 ? this.$t('games.youWin') : this.$t('games.youLose');
      }
      return this.scores.p1 > this.scores.p2 ? this.$t('games.player1Wins') : this.$t('games.player2Wins');
    }
  },
  created() {
    this.ctx = null;
    this.width = 0;   // canvas CSS size
    this.height = 0;
    // The simulation runs in "logical" space: x runs goal-to-goal (P1 defends
    // x=0), y across the pitch. On a wide canvas that maps 1:1; on a tall
    // (mobile) canvas it is rotated so P1 plays the bottom goal.
    this.vertical = false;
    this.L = 0;       // logical pitch length (goal to goal)
    this.W = 0;       // logical pitch width
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

    this.initWorld();
    this.loop = new GameLoop({
      update: dt => this.update(dt),
      render: () => this.render(),
    });
    this.loop.start();

    this.onResizeBound = () => this.onResize();
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
      this.vertical = rect.height > rect.width;
      this.L = this.vertical ? rect.height : rect.width;
      this.W = this.vertical ? rect.width : rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
    },
    onResize() {
      const oldL = this.L;
      const oldW = this.W;
      this.resizeCanvas();
      if (!this.world || !oldL || !oldW) {
        return;
      }
      // Keep everything at the same relative spot on the new pitch.
      const fx = this.L / oldL;
      const fy = this.W / oldW;
      const {ball, strikers} = this.world;
      ball.x *= fx;
      ball.y *= fy;
      for (const key of ['p1', 'p2']) {
        const striker = strikers[key];
        const scaled = this.clampStriker(key, striker.x * fx, striker.y * fy);
        striker.x = scaled.x;
        striker.y = scaled.y;
        striker.target = null; // stale coordinates
      }
    },
    goalWidth() {
      return Math.min(this.W * 0.4, 240);
    },
    // Canvas CSS px -> logical px.
    toLogical(point) {
      if (this.vertical) {
        return {x: this.height - point.y, y: point.x};
      }
      return {x: point.x, y: point.y};
    },
    initWorld() {
      this.world = {
        ball: {x: 0, y: 0, vx: 0, vy: 0},
        strikers: {
          p1: {x: 0, y: 0, vx: 0, vy: 0, smoothVx: 0, smoothVy: 0, target: null, pointerId: null, maxSpeed: POINTER_SPEED},
          p2: {x: 0, y: 0, vx: 0, vy: 0, smoothVx: 0, smoothVy: 0, target: null, pointerId: null, maxSpeed: POINTER_SPEED},
        },
        feedbackTimer: 0,
        conceder: null,
        aiTimer: 0,
      };
      this.resetRound(null);
    },
    // Serve: after a goal the ball goes to the player that conceded.
    resetRound(conceder) {
      const {ball, strikers} = this.world;
      ball.x = conceder === 'p1' ? this.L * 0.3 : conceder === 'p2' ? this.L * 0.7 : this.L / 2;
      ball.y = this.W / 2;
      ball.vx = 0;
      ball.vy = 0;
      strikers.p1.x = this.L * 0.14;
      strikers.p1.y = this.W / 2;
      strikers.p2.x = this.L * 0.86;
      strikers.p2.y = this.W / 2;
      for (const striker of [strikers.p1, strikers.p2]) {
        striker.vx = 0;
        striker.vy = 0;
      }
    },
    start(mode) {
      this.mode = mode;
      this.scores = {p1: 0, p2: 0};
      this.feedbackKey = null;
      this.state = 'playing';
      this.initWorld();
    },
    clampStriker(key, x, y) {
      const minX = key === 'p1' ? WALL_END + STRIKER_RADIUS : this.L / 2 + STRIKER_RADIUS;
      const maxX = key === 'p1' ? this.L / 2 - STRIKER_RADIUS : this.L - WALL_END - STRIKER_RADIUS;
      return {
        x: Math.min(Math.max(x, minX), maxX),
        y: Math.min(Math.max(y, WALL_SIDE + STRIKER_RADIUS), this.W - WALL_SIDE - STRIKER_RADIUS),
      };
    },
    onPointerDown(pointer) {
      if (this.state !== 'playing') {
        return;
      }
      const point = this.toLogical(pointer);
      // A pointer starting in a human half grabs that half's striker. In 1P
      // any touch controls the player (target just clamps to their half).
      const key = this.mode === 2 && point.x > this.L / 2 ? 'p2' : 'p1';
      const striker = this.world.strikers[key];
      if (striker.pointerId !== null) {
        return; // already driven by an earlier finger
      }
      striker.pointerId = pointer.id;
      striker.maxSpeed = POINTER_SPEED;
      striker.target = this.clampStriker(key, point.x, point.y);
    },
    onPointerMove(pointer) {
      for (const key of ['p1', 'p2']) {
        const striker = this.world.strikers[key];
        if (striker.pointerId === pointer.id) {
          const point = this.toLogical(pointer);
          striker.target = this.clampStriker(key, point.x, point.y);
        }
      }
    },
    onPointerUp(pointer) {
      for (const key of ['p1', 'p2']) {
        const striker = this.world.strikers[key];
        if (striker.pointerId === pointer.id) {
          striker.pointerId = null;
          striker.target = null;
        }
      }
    },
    // Keyboard direction for a striker, in logical space. P1 has the arrow
    // keys (plus WASD when the other side is the AI); P2 has WASD in 2P.
    keyVector(key) {
      const input = this.input;
      let screenX = 0;
      let screenY = 0;
      const wasdX = (input.pressed('KeyD') ? 1 : 0) - (input.pressed('KeyA') ? 1 : 0);
      const wasdY = (input.pressed('KeyS') ? 1 : 0) - (input.pressed('KeyW') ? 1 : 0);
      if (key === 'p1') {
        screenX = (input.pressed('ArrowRight') ? 1 : 0) - (input.pressed('ArrowLeft') ? 1 : 0);
        screenY = (input.pressed('ArrowDown') ? 1 : 0) - (input.pressed('ArrowUp') ? 1 : 0);
        if (this.mode === 1) {
          screenX += wasdX;
          screenY += wasdY;
        }
      } else if (this.mode === 2) {
        screenX = wasdX;
        screenY = wasdY;
      }
      if (!screenX && !screenY) {
        return null;
      }
      const x = this.vertical ? -screenY : screenX;
      const y = this.vertical ? screenX : screenY;
      const length = Math.hypot(x, y);
      return {x: x / length, y: y / length};
    },
    moveStriker(key, striker, dt) {
      let nextX = striker.x;
      let nextY = striker.y;
      if (striker.target) {
        const dx = striker.target.x - striker.x;
        const dy = striker.target.y - striker.y;
        const distance = Math.hypot(dx, dy);
        const maxStep = striker.maxSpeed * dt;
        if (distance <= maxStep) {
          nextX = striker.target.x;
          nextY = striker.target.y;
        } else {
          nextX = striker.x + dx / distance * maxStep;
          nextY = striker.y + dy / distance * maxStep;
        }
      } else if (!(this.mode === 1 && key === 'p2')) {
        const direction = this.keyVector(key);
        if (direction) {
          nextX = striker.x + direction.x * KEY_SPEED * dt;
          nextY = striker.y + direction.y * KEY_SPEED * dt;
        }
      }
      const clamped = this.clampStriker(key, nextX, nextY);
      striker.vx = (clamped.x - striker.x) / dt;
      striker.vy = (clamped.y - striker.y) / dt;
      striker.x = clamped.x;
      striker.y = clamped.y;
      // Ball impulses use a ~50ms smoothed velocity: a pointer-chasing striker
      // reaches each 60Hz pointer target mid-frame and then idles, so its raw
      // substep velocity flips between full speed and zero. Without smoothing,
      // hit strength would depend on which substep the contact lands on.
      const blend = Math.min(1, dt / 0.05);
      striker.smoothVx += (striker.vx - striker.smoothVx) * blend;
      striker.smoothVy += (striker.vy - striker.smoothVy) * blend;
    },
    // The AI plays P2: defend the goal line, strike when the ball is in its
    // half, and swing around the ball when it sits between AI and own goal.
    // It speeds up with every goal the player scores.
    computeAiTarget() {
      const ai = this.world.strikers.p2;
      const ball = this.world.ball;
      const boost = Math.min(this.streak, AI_STREAK_CAP);
      const speed = AI_BASE_SPEED + boost * AI_STREAK_SPEED + this.scores.p1 * AI_RAMP;
      ai.maxSpeed = speed;
      let target;
      // Only attack a slow ball. Rushing a fast incoming shot would make the
      // AI a second defender that snuffs out every well-aimed goal attempt.
      if (ball.x > this.L / 2 && ball.vx < 400) {
        if (ball.x > ai.x + 6) {
          const detour = STRIKER_RADIUS + BALL_RADIUS + 26;
          target = {
            x: Math.min(ball.x + 60, this.L - WALL_END - STRIKER_RADIUS),
            y: ball.y > this.W / 2 ? ball.y - detour : ball.y + detour,
          };
        } else {
          // Line up just behind the ball, seen from the player's goal, so a
          // push sends the ball goalwards.
          const dx = ball.x - WALL_END;
          const dy = ball.y - this.W / 2;
          const length = Math.hypot(dx, dy) || 1;
          target = {x: ball.x + dx / length * 10, y: ball.y + dy / length * 10};
        }
      } else {
        // Defending is deliberately imperfect: slower than attacking and not
        // tracking all the way to the posts, so corner shots can go in.
        ai.maxSpeed = speed * Math.min(0.75, AI_DEFENSE_FACTOR + boost * AI_STREAK_DEFENSE);
        const track = Math.max(-1, Math.min(1, (ball.y - this.W / 2) / (this.W / 2)));
        target = {
          x: this.L - WALL_END - 90,
          y: this.W / 2 + track * this.goalWidth() * 0.32,
        };
      }
      ai.target = this.clampStriker('p2', target.x, target.y);
    },
    update(dt) {
      if (this.feedbackKey) {
        this.world.feedbackTimer -= dt;
        if (this.world.feedbackTimer <= 0) {
          this.feedbackKey = null;
          if (Math.max(this.scores.p1, this.scores.p2) >= WIN_SCORE) {
            this.finish();
          } else {
            this.resetRound(this.world.conceder);
          }
        }
        return;
      }
      if (this.state !== 'playing') {
        return;
      }
      if (this.mode === 1) {
        this.world.aiTimer -= dt;
        if (this.world.aiTimer <= 0) {
          this.world.aiTimer = AI_REACTION - Math.min(this.streak, AI_STREAK_CAP) * AI_STREAK_REACTION;
          this.computeAiTarget();
        }
      }
      const step = dt / SUBSTEPS;
      for (let index = 0; index < SUBSTEPS; index++) {
        if (this.step(step)) {
          break; // goal scored, round over
        }
      }
    },
    step(dt) {
      const {ball, strikers} = this.world;
      this.moveStriker('p1', strikers.p1, dt);
      this.moveStriker('p2', strikers.p2, dt);

      const damping = Math.pow(BALL_DAMPING, dt);
      ball.vx *= damping;
      ball.vy *= damping;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      // Side walls.
      if (ball.y - BALL_RADIUS < WALL_SIDE) {
        ball.y = WALL_SIDE + BALL_RADIUS;
        ball.vy = Math.abs(ball.vy) * WALL_RESTITUTION;
      } else if (ball.y + BALL_RADIUS > this.W - WALL_SIDE) {
        ball.y = this.W - WALL_SIDE - BALL_RADIUS;
        ball.vy = -Math.abs(ball.vy) * WALL_RESTITUTION;
      }

      // End walls with a goal mouth cut into them.
      const inMouth = Math.abs(ball.y - this.W / 2) < this.goalWidth() / 2 - 2;
      if (ball.x - BALL_RADIUS < WALL_END) {
        if (inMouth) {
          if (ball.x < WALL_END - BALL_RADIUS) {
            return this.onGoal('p2');
          }
        } else {
          ball.x = WALL_END + BALL_RADIUS;
          ball.vx = Math.abs(ball.vx) * WALL_RESTITUTION;
        }
      } else if (ball.x + BALL_RADIUS > this.L - WALL_END) {
        if (inMouth) {
          if (ball.x > this.L - WALL_END + BALL_RADIUS) {
            return this.onGoal('p1');
          }
        } else {
          ball.x = this.L - WALL_END - BALL_RADIUS;
          ball.vx = -Math.abs(ball.vx) * WALL_RESTITUTION;
        }
      }

      this.collideStriker(strikers.p1);
      this.collideStriker(strikers.p2);
      return false;
    },
    collideStriker(striker) {
      const ball = this.world.ball;
      const dx = ball.x - striker.x;
      const dy = ball.y - striker.y;
      const distance = Math.hypot(dx, dy);
      const minDistance = BALL_RADIUS + STRIKER_RADIUS;
      if (distance >= minDistance) {
        return;
      }
      const nx = distance > 0 ? dx / distance : 1;
      const ny = distance > 0 ? dy / distance : 0;
      // Push the ball out of the striker, then bounce the relative velocity.
      ball.x = striker.x + nx * minDistance;
      ball.y = striker.y + ny * minDistance;
      const relative = (ball.vx - striker.smoothVx) * nx + (ball.vy - striker.smoothVy) * ny;
      if (relative < 0) {
        const impulse = -(1 + HIT_RESTITUTION) * relative;
        ball.vx += impulse * nx;
        ball.vy += impulse * ny;
      }
      const speed = Math.hypot(ball.vx, ball.vy);
      if (speed > MAX_BALL_SPEED) {
        ball.vx = ball.vx / speed * MAX_BALL_SPEED;
        ball.vy = ball.vy / speed * MAX_BALL_SPEED;
      }
      // Keep the push-out from burying the ball in a side wall.
      ball.y = Math.min(Math.max(ball.y, WALL_SIDE + BALL_RADIUS), this.W - WALL_SIDE - BALL_RADIUS);
    },
    onGoal(scorer) {
      this.scores[scorer]++;
      this.feedbackKey = 'games.goal';
      this.feedbackGood = this.mode === 2 || scorer === 'p1';
      this.world.feedbackTimer = FEEDBACK_SECONDS;
      this.world.conceder = scorer === 'p1' ? 'p2' : 'p1';
      this.world.ball.vx = 0;
      this.world.ball.vy = 0;
      return true;
    },
    finish() {
      this.state = 'done';
      if (this.mode === 1) {
        this.streak = this.scores.p1 > this.scores.p2 ? this.streak + 1 : 0;
        setScore('airhockey.streak', this.streak);
        submitHighScore('airhockey.bestStreak', this.streak);
        this.bestStreak = getHighScore('airhockey.bestStreak');
      }
    },
    render() {
      const ctx = this.ctx;
      if (!ctx) {
        return;
      }
      const dpr = window.devicePixelRatio || 1;
      // One transform maps logical space onto the canvas: identity on a wide
      // canvas, rotated a quarter turn on a tall one (P1 defends the bottom).
      if (this.vertical) {
        ctx.setTransform(0, -dpr, dpr, 0, 0, this.height * dpr);
      } else {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      const L = this.L;
      const W = this.W;
      const {ball, strikers} = this.world;

      // Surround (goal pockets live here) + pitch with mow stripes.
      ctx.fillStyle = '#39702f';
      ctx.fillRect(0, 0, L, W);
      ctx.fillStyle = '#539A46';
      ctx.fillRect(WALL_END, WALL_SIDE, L - 2 * WALL_END, W - 2 * WALL_SIDE);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let x = WALL_END, stripe = 0; x < L - WALL_END; x += 64, stripe++) {
        if (stripe % 2 === 0) {
          ctx.fillRect(x, WALL_SIDE, Math.min(64, L - WALL_END - x), W - 2 * WALL_SIDE);
        }
      }

      // Pitch lines.
      const goalW = this.goalWidth();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.strokeRect(WALL_END, WALL_SIDE, L - 2 * WALL_END, W - 2 * WALL_SIDE);
      ctx.beginPath();
      ctx.moveTo(L / 2, WALL_SIDE);
      ctx.lineTo(L / 2, W - WALL_SIDE);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(L / 2, W / 2, 52, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(L / 2 - 4, W / 2 - 4, 8, 8);
      ctx.lineWidth = 3;
      ctx.strokeRect(WALL_END, W / 2 - goalW / 2 - 50, 70, goalW + 100);
      ctx.strokeRect(L - WALL_END - 70, W / 2 - goalW / 2 - 50, 70, goalW + 100);

      this.renderGoal('left');
      this.renderGoal('right');

      this.renderStriker(strikers.p1, KITS.p1);
      this.renderStriker(strikers.p2, KITS.p2);

      this.renderSprite(BALL_SPRITE, ball.x, ball.y, {W: '#f4f4f4', B: '#222222'});
    },
    renderGoal(side) {
      const ctx = this.ctx;
      const goalW = this.goalWidth();
      const top = this.W / 2 - goalW / 2;
      const lineX = side === 'left' ? WALL_END : this.L - WALL_END;
      // Open the mouth: paint the border line away where the goal is.
      ctx.fillStyle = '#39702f';
      ctx.fillRect(lineX - 3, top, 6, goalW);
      // Net pocket behind the line.
      const netX = side === 'left' ? 8 : lineX + 3;
      const netW = WALL_END - 11;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(netX, top, netW, goalW);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;
      for (let x = netX; x <= netX + netW; x += 8) {
        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, top + goalW);
        ctx.stroke();
      }
      for (let y = top; y <= top + goalW; y += 8) {
        ctx.beginPath();
        ctx.moveTo(netX, y);
        ctx.lineTo(netX + netW, y);
        ctx.stroke();
      }
      // Posts.
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(lineX - 4, top - 8, 8, 8);
      ctx.fillRect(lineX - 4, top + goalW, 8, 8);
    },
    renderStriker(striker, kit) {
      const ctx = this.ctx;
      // Mallet base marks the real hitbox.
      ctx.beginPath();
      ctx.arc(striker.x, striker.y, STRIKER_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = kit.glow;
      ctx.fill();
      ctx.strokeStyle = kit.main;
      ctx.lineWidth = 3;
      ctx.stroke();
      this.renderSprite(PLAYER_TOPDOWN, striker.x, striker.y, {C: kit.main, H: HAIR, K: SKIN});
    },
    renderSprite(rows, centerX, centerY, palette) {
      const ctx = this.ctx;
      const width = rows[0].length * SPRITE_SCALE;
      const height = rows.length * SPRITE_SCALE;
      for (let row = 0; row < rows.length; row++) {
        for (let col = 0; col < rows[row].length; col++) {
          const char = rows[row][col];
          if (char === '.') {
            continue;
          }
          ctx.fillStyle = palette[char];
          ctx.fillRect(
              centerX - width / 2 + col * SPRITE_SCALE,
              centerY - height / 2 + row * SPRITE_SCALE,
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
.air-hockey-game {
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
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-flow: column;
    align-items: center;
    gap: 6px;
    pointer-events: none;

    .score {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(0, 0, 0, 0.75);
      color: $white;
      font-weight: bold;
      font-size: 22px;
      padding: 2px 14px;
      border-radius: 6px;

      .chip {
        width: 12px;
        height: 12px;
        border-radius: 50%;

        &.p1 {
          background: #FF6B6B;
        }

        &.p2 {
          background: #1889E6;
        }
      }
    }

    .stat {
      background: rgba(0, 0, 0, 0.75);
      color: $white;
      font-size: 14px;
      font-weight: bold;
      padding: 2px 10px;
      border-radius: 6px;
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
    pointer-events: none;

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

    .buttons {
      display: flex;
      justify-content: center;
      gap: 12px;
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

      &.secondary {
        background: transparent;
        border: 2px solid rgba(255, 255, 255, 0.6);
        font-size: 16px;
        padding: 10px 18px;
      }
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

      .buttons {
        flex-flow: column;
      }
    }
  }
}
</style>
