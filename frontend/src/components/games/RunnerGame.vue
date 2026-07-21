<template>
  <div class="runner-game">
    <canvas ref="canvas"></canvas>
    <div class="hud">
      <div class="stat">{{ km.toFixed(2) }} {{ $t('games.km') }}</div>
      <div class="stat">{{ formatTime(timeSeconds) }}</div>
      <div class="energy">
        <div class="energy-inner" :class="{low: energy < 25, boost: boosting}" :style="{width: Math.max(0, energy) + '%'}"></div>
      </div>
      <div class="stat small" v-if="bestTime">{{ $t('games.bestTime') }}: {{ formatTime(bestTime) }}</div>
      <div class="stat small" v-else-if="bestDistance">{{ $t('games.best') }}: {{ bestDistance.toFixed(2) }} {{ $t('games.km') }}</div>
    </div>
    <div v-if="wallBanner" class="wall-banner">{{ $t('games.theWall') }}</div>
    <div v-if="state === 'ready'" class="panel">
      <p>{{ $t('games.runnerHint') }}</p>
      <button @click="start">{{ $t('games.start') }}</button>
    </div>
    <div v-else-if="state === 'over'" class="panel">
      <h3>{{ $t('games.gameOver') }}</h3>
      <p>{{ km.toFixed(2) }} {{ $t('games.km') }}</p>
      <button @click="start">{{ $t('games.retry') }}</button>
    </div>
    <div v-else-if="state === 'finished'" class="panel">
      <h3>{{ $t('games.finished') }}</h3>
      <p>{{ $t('games.time') }}: {{ formatTime(timeSeconds) }}</p>
      <p v-if="bestTime">{{ $t('games.bestTime') }}: {{ formatTime(bestTime) }}</p>
      <button @click="start">{{ $t('games.retry') }}</button>
    </div>
  </div>
</template>

<script>
import GameLoop from "@/utils/game/GameLoop";
import Input from "@/utils/game/Input";
import {getHighScore, setScore, submitHighScore} from "@/utils/game/HighScores";

const MARATHON_KM = 42.195;
const PX_PER_KM = 1200;
const GRAVITY = 2800;
const JUMP_VELOCITY = -1000;
const JUMP_CUT_VELOCITY = -350;
const BASE_SPEED = 300;
const ENERGY_DRAIN = 2.0;
const WALL_KM = 30;
const WALL_DRAIN_FACTOR = 2;
const STUMBLE_ENERGY = 15;
const STATION_ENERGY = 40;
const STATION_KMS = [4, 8.5, 13, 17.5, 22, 26.5, 31, 35.5, 39.5];
const SIGN_KMS = [5, 10, 15, 21.1, 25, 30, 35, 40];
// Friends along the route hand out beer: a short sprint boost that burns
// energy considerably faster. Risk/reward — especially near The Wall.
const BEER_KMS = [6, 11.5, 16, 20.5, 25, 29.5, 34, 38.5];
const BOOST_DURATION = 4;
const BOOST_SPEED_FACTOR = 1.6;
const BOOST_DRAIN_FACTOR = 2.5;

// Scenery changes with the distance: Milo runs long distance through
// cities, farmer fields, forests and mountains.
const ENVIRONMENTS = [
    {from: 0, skyTop: '#a5d8ef', skyBottom: '#e8f7fd', far: '#8d9ab3', near: '#5c6880', road: '#6a6a72', side: '#9aa1a8', detail: 'city'},
    {from: 8, skyTop: '#ffe9a8', skyBottom: '#fdf7e2', far: '#c3d47f', near: '#8fae54', road: '#8a7a5e', side: '#b5cb70', detail: 'fields'},
    {from: 18, skyTop: '#cde9d2', skyBottom: '#eef9ef', far: '#54805c', near: '#35603f', road: '#6f6a58', side: '#4e7a51', detail: 'forest'},
    {from: WALL_KM, skyTop: '#d7e3f0', skyBottom: '#f2f6fb', far: '#93a7c0', near: '#67809f', road: '#75757d', side: '#8fa0b5', detail: 'mountains'},
];

// Pixel-art runner (12x16, drawn at 3x): 2 run frames + 1 jump frame.
const SPRITE_COLORS = {
    K: '#111112', // hair / outline
    S: '#e8b98f', // skin
    B: '#1889E6', // shirt
    D: '#0F68B0', // shorts
    W: '#FFFFFF', // shoes
    R: '#FF6B6B', // friend's shirt
    G: '#f2b400', // beer mug
    F: '#FFFFFF', // beer foam (distinct from shoes so it can be hidden when taken)
};

// Cheering friend at the roadside, golden beer mug (foam on top, handle on
// the side) raised in one hand.
const FRIEND_FRAME = [
    '....KKKK.FF.',
    '...KKKKKKGGG',
    '...KSSSSKGG.',
    '....SSSS..S.',
    '.....SS...S.',
    '...RRRRRRS..',
    '..SRRRRRR...',
    '..S.RRRR....',
    '....RRRR....',
    '....KKKK....',
    '...KKKKKK...',
    '...KK..KK...',
    '...KK..KK...',
    '...KK..KK...',
    '..WW....WW..',
    '............',
];
const MUG_CHARS = new Set(['G', 'F']);
const RUNNER_FRAMES = {
    run1: [
        '....KKKK....',
        '...KKKKKK...',
        '...KSSSSK...',
        '....SSSS....',
        '.....SS.....',
        '...BBBBB....',
        '..SBBBBBS...',
        '..S.BBBB.S..',
        '....BBBB....',
        '....DDDD....',
        '...DDDDDD...',
        '...SS..SS...',
        '..SS....SS..',
        '.SS......SS.',
        '.WW.......WW',
        '............',
    ],
    run2: [
        '....KKKK....',
        '...KKKKKK...',
        '...KSSSSK...',
        '....SSSS....',
        '.....SS.....',
        '...BBBBB....',
        '...BBBBBS...',
        '..SBBBBB....',
        '..S.BBBB....',
        '....DDDD....',
        '...DDDDDD...',
        '....SSSS....',
        '....SSSS....',
        '....SS.SS...',
        '...WW..WW...',
        '............',
    ],
    jump: [
        '....KKKK....',
        '...KKKKKK...',
        '...KSSSSK...',
        '....SSSS....',
        '.....SS.....',
        '..SBBBBBS...',
        '.S.BBBBB.S..',
        '....BBBB....',
        '....BBBB....',
        '....DDDD....',
        '...DDDDDD...',
        '...SS..SS...',
        '..SS....SS..',
        '..WW....WW..',
        '............',
        '............',
    ],
};
const SPRITE_SCALE = 3;
const RUNNER_WIDTH = 12 * SPRITE_SCALE;
const RUNNER_HEIGHT = 16 * SPRITE_SCALE;

export default {
  name: "RunnerGame",
  data() {
    return {
      state: 'ready', // ready | running | over | finished
      km: 0,
      energy: 100,
      timeSeconds: 0,
      boosting: false,
      wallBanner: false,
      bestDistance: getHighScore('runner.bestDistance'),
      bestTime: getHighScore('runner.bestTime'),
    }
  },
  created() {
    // Non-reactive game state.
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

    const JUMP_KEYS = ['Space', 'KeyW', 'ArrowUp'];
    this.input = new Input(canvas)
        .on('down', () => this.jump())
        .on('up', () => this.cutJump())
        .on('keydown', code => {
          if (JUMP_KEYS.includes(code)) {
            this.jump();
          }
        })
        .on('keyup', code => {
          if (JUMP_KEYS.includes(code)) {
            this.cutJump();
          }
        });

    this.resetWorld();
    this.loop = new GameLoop({
      update: dt => this.update(dt),
      render: () => this.render(),
    });
    this.loop.start();

    this.onResizeBound = () => this.resizeCanvas();
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
    resetWorld() {
      // window.__RUNNER_START_KM is a debug/tuning hook to start deeper into the run.
      const startKm = Number(window.__RUNNER_START_KM) || 0;
      this.world = {
        scrolled: startKm * PX_PER_KM,
        runnerY: 0,
        runnerVy: 0,
        onGround: true,
        runPhase: 0,
        obstacles: [],
        stations: [],
        beers: [],
        nextStation: STATION_KMS.findIndex(km => km > startKm) === -1 ? STATION_KMS.length : STATION_KMS.findIndex(km => km > startKm),
        nextBeer: BEER_KMS.findIndex(km => km > startKm) === -1 ? BEER_KMS.length : BEER_KMS.findIndex(km => km > startKm),
        nextSign: SIGN_KMS.findIndex(km => km > startKm) === -1 ? SIGN_KMS.length : SIGN_KMS.findIndex(km => km > startKm),
        signs: [],
        nextObstacleIn: 1.2,
        stumbleTimer: 0,
        boostTimer: 0,
        wallBannerShown: false,
        confetti: null,
      };
      this.km = startKm;
      this.energy = 100;
      this.timeSeconds = 0;
      this.wallBanner = false;
    },
    start() {
      this.resetWorld();
      this.state = 'running';
    },
    jump() {
      if (this.state !== 'running') {
        return;
      }
      const world = this.world;
      if (world.onGround) {
        world.runnerVy = JUMP_VELOCITY;
        world.onGround = false;
      }
    },
    cutJump() {
      const world = this.world;
      if (world && !world.onGround && world.runnerVy < JUMP_CUT_VELOCITY) {
        world.runnerVy = JUMP_CUT_VELOCITY;
      }
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${String(secs).padStart(2, '0')}`;
    },
    currentSpeed() {
      const ramp = Math.min(2.2, 1 + this.km * 0.04);
      const stumble = this.world.stumbleTimer > 0 ? 0.5 : 1;
      const boost = this.world.boostTimer > 0 ? BOOST_SPEED_FACTOR : 1;
      return BASE_SPEED * ramp * stumble * boost;
    },
    environmentAt(km) {
      let env = ENVIRONMENTS[0];
      for (const candidate of ENVIRONMENTS) {
        if (km >= candidate.from) {
          env = candidate;
        }
      }
      return env;
    },
    // All pickups sit at scheduled positions, so an obstacle spawn can check
    // clearance against the full schedule (spawned or not).
    nearPickup(x) {
      const clearance = 300;
      return STATION_KMS.some(km => Math.abs(km * PX_PER_KM - x) < clearance + 70)
          || BEER_KMS.some(km => Math.abs(km * PX_PER_KM - x) < clearance + RUNNER_WIDTH);
    },
    update(dt) {
      if (this.state === 'finished' && this.world.confetti) {
        this.updateConfetti(dt);
        return;
      }
      if (this.state !== 'running') {
        return;
      }
      const world = this.world;
      const speed = this.currentSpeed();

      this.timeSeconds += dt;
      world.scrolled += speed * dt;
      this.km = world.scrolled / PX_PER_KM;
      world.runPhase += speed * dt * 0.05;
      if (world.stumbleTimer > 0) {
        world.stumbleTimer -= dt;
      }
      if (world.boostTimer > 0) {
        world.boostTimer -= dt;
      }
      this.boosting = world.boostTimer > 0;

      // Energy: the long-distance mechanic. Doubles inside The Wall zone,
      // and a beer sprint burns considerably more on top.
      const inWall = this.km >= WALL_KM && this.km < WALL_KM + 4;
      const drainFactor = (inWall ? WALL_DRAIN_FACTOR : 1) * (this.boosting ? BOOST_DRAIN_FACTOR : 1);
      this.energy -= ENERGY_DRAIN * drainFactor * dt;
      if (inWall && !world.wallBannerShown) {
        world.wallBannerShown = true;
        this.wallBanner = true;
        setTimeout(() => this.wallBanner = false, 2500);
      }
      if (this.energy <= 0) {
        this.finishRun(false);
        return;
      }

      // Runner physics.
      if (!world.onGround) {
        world.runnerVy += GRAVITY * dt;
        world.runnerY += world.runnerVy * dt;
        if (world.runnerY >= 0) {
          world.runnerY = 0;
          world.runnerVy = 0;
          world.onGround = true;
        }
      }

      // Spawning: obstacles in time units (fair reaction windows at any speed).
      // Each environment has its own obstacle with its own size profile:
      // dixi (city), sheep (fields), chopped tree (forest), ye cover (mountains).
      world.nextObstacleIn -= dt;
      if (world.nextObstacleIn <= 0 && this.km < MARATHON_KM - 0.15) {
        const spawnX = world.scrolled + this.width;
        if (this.nearPickup(spawnX)) {
          // Never drop an obstacle onto (or right next to) a water station or
          // beer friend — retry shortly, which places it past the pickup.
          world.nextObstacleIn = 0.25;
        } else {
          world.nextObstacleIn = 1.2 + Math.random() * 0.9;
          const detail = this.environmentAt(this.km).detail;
          const sizes = {
            city: {width: 34, height: 54},
            fields: {width: 46, height: 30},
            forest: {width: 38, height: 30},
            mountains: {width: 44, height: 44},
          }[detail];
          world.obstacles.push({
            x: spawnX,
            width: sizes.width,
            height: sizes.height + Math.random() * 6,
            detail,
            hit: false,
          });
        }
      }
      // Water stations by scheduled km.
      if (world.nextStation < STATION_KMS.length && STATION_KMS[world.nextStation] * PX_PER_KM < world.scrolled + this.width * 1.2) {
        world.stations.push({x: STATION_KMS[world.nextStation] * PX_PER_KM, taken: false});
        world.nextStation++;
      }
      // Friends with beer by scheduled km.
      if (world.nextBeer < BEER_KMS.length && BEER_KMS[world.nextBeer] * PX_PER_KM < world.scrolled + this.width * 1.2) {
        world.beers.push({x: BEER_KMS[world.nextBeer] * PX_PER_KM, taken: false});
        world.nextBeer++;
      }
      // Km signs.
      if (world.nextSign < SIGN_KMS.length && SIGN_KMS[world.nextSign] * PX_PER_KM < world.scrolled + this.width * 1.2) {
        world.signs.push({x: SIGN_KMS[world.nextSign] * PX_PER_KM, km: SIGN_KMS[world.nextSign]});
        world.nextSign++;
      }

      // Collisions (runner is at fixed screen x).
      const runnerX = this.width * 0.2;
      const groundY = this.height * 0.78;
      const runnerBox = {
        left: runnerX + 6,
        right: runnerX + RUNNER_WIDTH - 6,
        top: groundY + world.runnerY - RUNNER_HEIGHT + 4,
        bottom: groundY + world.runnerY,
      };
      for (const obstacle of world.obstacles) {
        if (obstacle.hit) {
          continue;
        }
        const screenX = obstacle.x - world.scrolled;
        if (screenX < runnerBox.right && screenX + obstacle.width > runnerBox.left
            && runnerBox.bottom > groundY - obstacle.height) {
          // Stumble: energy + speed penalty instead of instant death.
          obstacle.hit = true;
          this.energy -= STUMBLE_ENERGY;
          world.stumbleTimer = 1;
        }
      }
      for (const station of world.stations) {
        if (station.taken) {
          continue;
        }
        const screenX = station.x - world.scrolled;
        // Grab a cup only while on the ground — jumping through misses it.
        if (world.onGround && screenX < runnerBox.right && screenX + 70 > runnerBox.left) {
          station.taken = true;
          this.energy = Math.min(100, this.energy + STATION_ENERGY);
        }
      }
      for (const beer of world.beers) {
        if (beer.taken) {
          continue;
        }
        const screenX = beer.x - world.scrolled;
        if (world.onGround && screenX < runnerBox.right && screenX + RUNNER_WIDTH > runnerBox.left) {
          beer.taken = true;
          world.boostTimer = BOOST_DURATION;
        }
      }

      // Cull off-screen objects.
      world.obstacles = world.obstacles.filter(o => o.x - world.scrolled > -100);
      world.stations = world.stations.filter(s => s.x - world.scrolled > -150);
      world.beers = world.beers.filter(b => b.x - world.scrolled > -150);
      world.signs = world.signs.filter(s => s.x - world.scrolled > -150);

      if (this.km >= MARATHON_KM) {
        this.finishRun(true);
      }
    },
    finishRun(finished) {
      this.state = finished ? 'finished' : 'over';
      submitHighScore('runner.bestDistance', Math.round(Math.min(this.km, MARATHON_KM) * 100) / 100);
      this.bestDistance = getHighScore('runner.bestDistance');
      if (finished) {
        const time = Math.round(this.timeSeconds);
        const best = getHighScore('runner.bestTime');
        if (!best || time < best) {
          setScore('runner.bestTime', time);
        }
        this.bestTime = getHighScore('runner.bestTime');
        this.spawnConfetti();
      }
    },
    spawnConfetti() {
      const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#1889E6', '#FF6BB5', '#fcac45'];
      this.world.confetti = Array.from({length: 140}, (_, i) => ({
        x: Math.random() * this.width,
        y: -20 - Math.random() * this.height * 0.6,
        vx: (Math.random() - 0.5) * 120,
        vy: 80 + Math.random() * 180,
        size: 5 + Math.random() * 6,
        color: colors[i % colors.length],
        spin: Math.random() * Math.PI,
        spinV: (Math.random() - 0.5) * 6,
      }));
    },
    updateConfetti(dt) {
      for (const piece of this.world.confetti) {
        piece.x += piece.vx * dt;
        piece.y += piece.vy * dt;
        piece.spin += piece.spinV * dt;
        // Keep the celebration going while the finish panel is up.
        if (piece.y > this.height + 20) {
          piece.y = -20;
          piece.x = Math.random() * this.width;
        }
      }
    },
    render() {
      const ctx = this.ctx;
      if (!ctx) {
        return;
      }
      const world = this.world;
      const width = this.width;
      const height = this.height;
      const groundY = height * 0.78;
      const env = this.environmentAt(this.km);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, groundY);
      sky.addColorStop(0, env.skyTop);
      sky.addColorStop(1, env.skyBottom);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      // Parallax scenery layers.
      this.renderScenery(env, 0.25, 260, groundY, true);
      this.renderScenery(env, 0.55, 200, groundY, false);

      // Roadside + road.
      ctx.fillStyle = env.side;
      ctx.fillRect(0, groundY - 8, width, 8);
      ctx.fillStyle = env.road;
      ctx.fillRect(0, groundY, width, height - groundY);
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      const dashOffset = -(world.scrolled % 64);
      for (let x = dashOffset; x < width; x += 64) {
        ctx.fillRect(x, groundY + 22, 32, 5);
      }

      // Km signs, stations, obstacles.
      for (const sign of world.signs) {
        this.renderSign(sign.x - world.scrolled, groundY, sign.km);
      }
      this.renderFinish(MARATHON_KM * PX_PER_KM - world.scrolled, groundY);
      for (const station of world.stations) {
        this.renderStation(station.x - world.scrolled, groundY, station.taken);
      }
      for (const beer of world.beers) {
        // The friend keeps cheering after handing the mug over.
        this.renderSprite(FRIEND_FRAME, beer.x - world.scrolled, groundY - RUNNER_HEIGHT, beer.taken ? MUG_CHARS : null);
      }
      for (const obstacle of world.obstacles) {
        this.renderObstacle(obstacle, obstacle.x - world.scrolled, groundY);
      }

      // Runner sprite (+ speed streaks during a beer sprint).
      const runnerX = width * 0.2;
      if (this.boosting) {
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        for (let line = 0; line < 3; line++) {
          const streakY = groundY + world.runnerY - RUNNER_HEIGHT + 10 + line * 14;
          ctx.fillRect(runnerX - 34 - line * 8, streakY, 26, 4);
        }
      }
      const frame = !world.onGround
          ? RUNNER_FRAMES.jump
          : (Math.floor(world.runPhase) % 2 === 0 ? RUNNER_FRAMES.run1 : RUNNER_FRAMES.run2);
      this.renderSprite(frame, runnerX, groundY + world.runnerY - RUNNER_HEIGHT);

      // The Wall: the world literally darkens at 30 km.
      if (this.km >= WALL_KM && this.km < WALL_KM + 4 && this.state === 'running') {
        ctx.fillStyle = 'rgba(20, 12, 40, 0.3)';
        ctx.fillRect(0, 0, width, height);
      }

      // Finish confetti.
      if (this.state === 'finished' && world.confetti) {
        for (const piece of world.confetti) {
          ctx.save();
          ctx.translate(piece.x, piece.y);
          ctx.rotate(piece.spin);
          ctx.fillStyle = piece.color;
          ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
          ctx.restore();
        }
      }
    },
    renderScenery(env, parallax, tile, groundY, farLayer) {
      const ctx = this.ctx;
      const offset = this.world.scrolled * parallax;
      const first = Math.floor(offset / tile);
      const count = Math.ceil(this.width / tile) + 2;
      for (let i = first; i < first + count; i++) {
        const x = i * tile - offset;
        const variant = Math.abs((i * 7919) % 97) / 97;
        this.renderSceneryElement(env.detail, farLayer, x, variant, groundY, farLayer ? env.far : env.near);
      }
      ctx.globalAlpha = 1;
    },
    renderSceneryElement(detail, farLayer, x, variant, groundY, color) {
      const ctx = this.ctx;
      ctx.fillStyle = color;
      const base = groundY - 8;
      if (detail === 'city') {
        const buildingHeight = (farLayer ? 90 : 150) * (0.6 + variant * 0.7);
        const buildingWidth = farLayer ? 70 : 90;
        ctx.fillRect(x, base - buildingHeight, buildingWidth, buildingHeight);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        for (let wy = base - buildingHeight + 12; wy < base - 14; wy += 22) {
          for (let wx = x + 10; wx < x + buildingWidth - 12; wx += 20) {
            ctx.fillRect(wx, wy, 8, 10);
          }
        }
      } else if (detail === 'fields') {
        if (farLayer) {
          // Rolling hill
          ctx.beginPath();
          ctx.ellipse(x + 130, base + 40, 190, 90 + variant * 40, 0, Math.PI, 0);
          ctx.fill();
        } else {
          // Maize field: a row of blocky corn stalks with yellow cobs.
          for (let stalk = 0; stalk < 5; stalk++) {
            const stalkX = x + stalk * 22;
            const stalkHeight = 52 + ((stalk * 17 + Math.floor(variant * 40)) % 22);
            ctx.fillStyle = '#3e8a3e';
            ctx.fillRect(stalkX, base - stalkHeight, 5, stalkHeight);
            // Leaves
            ctx.fillRect(stalkX - 7, base - stalkHeight * 0.5, 7, 4);
            ctx.fillRect(stalkX + 5, base - stalkHeight * 0.68, 7, 4);
            // Cob
            ctx.fillStyle = '#f2c94c';
            ctx.fillRect(stalkX + 4, base - stalkHeight * 0.45, 6, 13);
          }
        }
      } else if (detail === 'forest') {
        const treeHeight = (farLayer ? 90 : 140) * (0.7 + variant * 0.5);
        const trunk = farLayer ? 8 : 12;
        ctx.fillRect(x + 30 - trunk / 2, base - treeHeight * 0.35, trunk, treeHeight * 0.35);
        ctx.beginPath();
        ctx.moveTo(x + 30, base - treeHeight);
        ctx.lineTo(x + 30 - treeHeight * 0.32, base - treeHeight * 0.28);
        ctx.lineTo(x + 30 + treeHeight * 0.32, base - treeHeight * 0.28);
        ctx.closePath();
        ctx.fill();
      } else { // mountains
        const peakHeight = (farLayer ? 160 : 220) * (0.6 + variant * 0.5);
        ctx.beginPath();
        ctx.moveTo(x - 60, base);
        ctx.lineTo(x + 90, base - peakHeight);
        ctx.lineTo(x + 240, base);
        ctx.closePath();
        ctx.fill();
        if (farLayer) {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          ctx.beginPath();
          ctx.moveTo(x + 90, base - peakHeight);
          ctx.lineTo(x + 60, base - peakHeight + 34);
          ctx.lineTo(x + 120, base - peakHeight + 34);
          ctx.closePath();
          ctx.fill();
        }
      }
    },
    // All foreground objects are drawn as blocky rect-grid pixel art,
    // matching the pixel runner sprite.
    renderObstacle(obstacle, x, groundY) {
      const ctx = this.ctx;
      const height = obstacle.height;
      const width = obstacle.width;
      const px = 4; // foreground pixel size
      ctx.globalAlpha = obstacle.hit ? 0.4 : 1;
      if (obstacle.detail === 'city') {
        // Dixi (portable toilet box).
        const top = groundY - height;
        ctx.fillStyle = '#1889E6';
        ctx.fillRect(x, top + px, width, height - px);
        ctx.fillStyle = '#FFFFFF'; // roof
        ctx.fillRect(x - px / 2, top, width + px, px * 1.5);
        ctx.fillStyle = '#0F68B0'; // door inset
        ctx.fillRect(x + px * 1.5, top + px * 3, width - px * 3, height - px * 5);
        ctx.fillStyle = '#FFFFFF'; // handle
        ctx.fillRect(x + width - px * 2.5, top + height * 0.5, px, px);
        ctx.fillStyle = '#0c3f66'; // vent slits
        ctx.fillRect(x + px * 1.5, top + px * 1.8, width - px * 3, 2);
      } else if (obstacle.detail === 'fields') {
        // Sheep, grazing toward the runner.
        const bodyTop = groundY - height + px;
        ctx.fillStyle = '#f2f1ea'; // wool
        ctx.fillRect(x + px, bodyTop, width - px * 2, height * 0.55);
        ctx.fillRect(x + px * 2, bodyTop - px, width - px * 4, px); // wool bumps
        ctx.fillStyle = '#111112'; // head (facing the runner, i.e. left)
        ctx.fillRect(x - px, bodyTop + px, px * 2.5, px * 3);
        ctx.fillRect(x - px * 1.5, bodyTop, px, px); // ear
        ctx.fillStyle = '#FFFFFF'; // eye
        ctx.fillRect(x - px * 0.5, bodyTop + px * 1.5, 2, 2);
        ctx.fillStyle = '#111112'; // legs
        ctx.fillRect(x + px * 2, groundY - px * 2.5, px, px * 2.5);
        ctx.fillRect(x + width - px * 3, groundY - px * 2.5, px, px * 2.5);
      } else if (obstacle.detail === 'forest') {
        // Chopped tree: stump with cut surface + felled trunk piece.
        const stumpWidth = width * 0.5;
        ctx.fillStyle = '#6d4a26';
        ctx.fillRect(x, groundY - height, stumpWidth, height);
        ctx.fillRect(x - px, groundY - px * 2, stumpWidth + px * 2, px * 2); // root flare
        ctx.fillStyle = '#c9a06a'; // cut surface
        ctx.fillRect(x, groundY - height, stumpWidth, px);
        ctx.fillStyle = '#8a6237'; // ring
        ctx.fillRect(x + px, groundY - height + 1, stumpWidth - px * 2, 2);
        ctx.fillStyle = '#6d4a26'; // felled piece lying next to it
        ctx.fillRect(x + stumpWidth + px, groundY - px * 3.5, width - stumpWidth - px, px * 3.5);
        ctx.fillStyle = '#c9a06a';
        ctx.fillRect(x + stumpWidth + px, groundY - px * 3.5, px, px * 3.5);
      } else {
        // Mountains: pixel homage to the 'ye' album cover — dusk sky,
        // mountain silhouette, dark foreground and the green scrawl.
        const top = groundY - height;
        ctx.fillStyle = '#4d5a74'; // upper sky
        ctx.fillRect(x, top, width, height * 0.28);
        ctx.fillStyle = '#93a3bd'; // light break in the clouds
        ctx.fillRect(x, top + height * 0.28, width, height * 0.24);
        ctx.fillStyle = '#2e3644'; // peaks
        ctx.fillRect(x + width * 0.08, top + height * 0.3, px, px);
        ctx.fillRect(x + width * 0.3, top + height * 0.26, px, px * 2);
        ctx.fillRect(x + width * 0.62, top + height * 0.32, px, px);
        ctx.fillRect(x, top + height * 0.38, width, height * 0.24);
        ctx.fillStyle = '#1d232e'; // dark foreground field
        ctx.fillRect(x, top + height * 0.62, width, height * 0.38);
        ctx.fillStyle = '#3fe05f'; // handwritten green lines
        ctx.fillRect(x + width * 0.3, top + height * 0.4, width * 0.45, 2);
        ctx.fillRect(x + width * 0.38, top + height * 0.5, width * 0.3, 2);
        ctx.fillRect(x + width * 0.34, top + height * 0.6, width * 0.36, 2);
      }
      ctx.globalAlpha = 1;
    },
    renderStation(x, groundY, taken) {
      const ctx = this.ctx;
      // Table
      ctx.fillStyle = '#0F68B0';
      ctx.fillRect(x, groundY - 34, 70, 8);
      ctx.fillRect(x + 6, groundY - 26, 6, 26);
      ctx.fillRect(x + 58, groundY - 26, 6, 26);
      // Cups
      if (!taken) {
        ctx.fillStyle = '#fff';
        for (let c = 0; c < 4; c++) {
          ctx.fillRect(x + 10 + c * 14, groundY - 44, 8, 10);
        }
      }
      // Banner with pixel water droplet.
      ctx.fillStyle = '#1889E6';
      ctx.fillRect(x + 20, groundY - 80, 30, 24);
      ctx.fillStyle = '#fff';
      ctx.fillRect(x + 33, groundY - 76, 4, 4);
      ctx.fillRect(x + 29, groundY - 72, 12, 8);
      ctx.fillRect(x + 33, groundY - 64, 4, 4);
    },
    renderSign(x, groundY, km) {
      const ctx = this.ctx;
      ctx.fillStyle = '#8a6237';
      ctx.fillRect(x + 20, groundY - 52, 6, 52);
      ctx.fillStyle = '#fff';
      ctx.fillRect(x, groundY - 78, 46, 28);
      ctx.fillStyle = '#111112';
      ctx.font = 'bold 15px coolvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(km), x + 23, groundY - 58);
    },
    renderFinish(x, groundY) {
      if (x > this.width + 50 || x < -80) {
        return;
      }
      const ctx = this.ctx;
      const height = 120;
      // Posts + checkered banner
      ctx.fillStyle = '#111112';
      ctx.fillRect(x, groundY - height, 8, height);
      ctx.fillRect(x + 90, groundY - height, 8, height);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 10; col++) {
          ctx.fillStyle = (row + col) % 2 === 0 ? '#111112' : '#fff';
          ctx.fillRect(x + 4 + col * 9, groundY - height + row * 9, 9, 9);
        }
      }
    },
    renderSprite(frame, x, y, skipChars = null) {
      const ctx = this.ctx;
      for (let row = 0; row < frame.length; row++) {
        const line = frame[row];
        for (let col = 0; col < line.length; col++) {
          const char = line[col];
          if (skipChars && skipChars.has(char)) {
            continue;
          }
          const color = SPRITE_COLORS[char];
          if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(x + col * SPRITE_SCALE, y + row * SPRITE_SCALE, SPRITE_SCALE, SPRITE_SCALE);
          }
        }
      }
    },
  }
}
</script>

<style scoped lang="scss">
.runner-game {
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
    gap: 4px;
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

    .energy {
      width: 160px;
      height: 14px;
      background: rgba(0, 0, 0, 0.75);
      border-radius: 7px;
      overflow: hidden;

      .energy-inner {
        height: 100%;
        background: $green;
        transition: width 0.2s linear;

        &.low {
          background: $red;
        }

        &.boost {
          background: $yellow;
        }
      }
    }
  }

  .wall-banner {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: $yellow;
    font-size: 28px;
    font-weight: bold;
    padding: 10px 24px;
    border-radius: 10px;
    white-space: nowrap;
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
