<template>
  <section :id="sectionId" :class="'physics-skills bg-' + color" ref="section">
    <button class="spawn-button" ref="spawnButton" @click="spawnSkill">{{ buttonLabel }}</button>
    <SkillTooltip ref="tooltip"/>
    <canvas ref="canvas"></canvas>
  </section>
</template>

<script>
import SkillTooltip from "@/components/skills/SkillTooltip.vue";
import SkillsPhysics from "@/utils/physics/SkillsPhysics";
import SkillsCanvasRenderer from "@/utils/physics/SkillsCanvasRenderer";
import {localized} from "@/i18n";
import {isMobile} from "@/utils/device";

const TAP_MAX_DISTANCE = 8;
const TAP_MAX_DURATION = 300;

export default {
  name: "PhysicsSkillsSection",
  components: {
    SkillTooltip,
  },
  props: {
    sectionId: {type: String, required: true},
    skills: {type: Array, required: true},
    buttonLabel: {type: String, required: true},
    title: {type: String, default: ''},
    color: {type: String, default: 'yellow'},
  },
  watch: {
    title() {
      // Locale switch: re-layout the title, but only while it is still intact —
      // letters that were knocked loose stay as they are.
      if (this.physics && this.physics.titlePristine()) {
        this.layoutTitle();
      }
    }
  },
  created() {
    // Non-reactive instance state: matter.js objects must not become Vue proxies.
    this.physics = null;
    this.renderer = null;
    this.observer = null;
    this.animationFrame = null;
    this.initialized = false;
    this.dragging = false;
    this.touch = null;
    this.resizeTimeout = null;
  },
  mounted() {
    // No physics work at all until the section scrolls into reach.
    this.observer = new IntersectionObserver(this.onIntersect, {rootMargin: '150px 0px', threshold: 0});
    this.observer.observe(this.$refs.section);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onWindowMouseMove);
    window.addEventListener('mouseup', this.onWindowMouseUp);
  },
  unmounted() {
    this.pause();
    if (this.dragging) {
      document.body.style.cursor = '';
    }
    if (this.observer) {
      this.observer.disconnect();
    }
    clearTimeout(this.resizeTimeout);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onWindowMouseMove);
    window.removeEventListener('mouseup', this.onWindowMouseUp);
    if (this.physics) {
      this.physics.destroy();
    }
  },
  methods: {
    async onIntersect(entries) {
      if (entries[0].isIntersecting) {
        await this.ensureInit();
        this.resume();
      } else {
        this.pause();
      }
    },
    async ensureInit() {
      if (this.initialized) {
        return;
      }
      this.initialized = true;

      const section = this.$refs.section;
      const canvas = this.$refs.canvas;
      const width = section.clientWidth;
      const height = section.clientHeight;
      const items = await Promise.all(this.skills.map(async skill => {
        // Labeled primitives need to stay readable on mobile, so they shrink less.
        const sizeFactor = isMobile() ? (skill.icon ? 0.5 : 0.65) : 1;
        const bodyWidth = skill.size * sizeFactor;
        if (!skill.icon) {
          const bodyHeight = skill.shape === 'rect' ? bodyWidth * 0.55 : bodyWidth;
          return {skill, width: bodyWidth, height: bodyHeight};
        }
        const image = await this.loadImage(skill.icon);
        const bodyHeight = bodyWidth * (image.naturalHeight / image.naturalWidth || 1);
        return {skill, width: bodyWidth, height: bodyHeight, image};
      }));

      this.renderer = new SkillsCanvasRenderer(canvas);
      this.renderer.resize(width, height);
      for (const item of items) {
        if (item.image) {
          this.renderer.setImage(item.skill.id, item.image);
        }
      }

      this.physics = new SkillsPhysics();
      this.physics.init(width, height, items);

      // Fonts must be ready before measuring the title letters.
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      this.layoutTitle();

      canvas.addEventListener('mousedown', this.onMouseDown);
      canvas.addEventListener('mousemove', this.onMouseMove);
      canvas.addEventListener('mouseleave', this.onMouseLeave);
      // Non-passive: we preventDefault only when a body is actually grabbed,
      // so vertical page swipes over empty canvas keep scrolling natively.
      canvas.addEventListener('touchstart', this.onTouchStart, {passive: false});
      canvas.addEventListener('touchmove', this.onTouchMove, {passive: false});
      canvas.addEventListener('touchend', this.onTouchEnd);
    },
    loadImage(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });
    },
    // Places the section title in the physics world: one static body per letter,
    // horizontally centered between the spawn button and the floor, so spawned
    // shapes rain onto it and knock the letters loose.
    layoutTitle() {
      if (!this.title || !this.physics) {
        return;
      }
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      let fontSize = isMobile() ? 52 : 115;
      const measure = size => {
        ctx.font = `bold ${size}px coolvetica, sans-serif`;
        return [...this.title].map(char => ctx.measureText(char).width);
      };
      let widths = measure(fontSize);
      const total = widths.reduce((sum, w) => sum + w, 0);
      const maxTotal = width * 0.9;
      if (total > maxTotal) {
        fontSize = Math.floor(fontSize * (maxTotal / total));
        widths = measure(fontSize);
      }

      const chars = [...this.title];
      let x = (width - widths.reduce((sum, w) => sum + w, 0)) / 2;
      // Keep the title clear of the spawn button: its top edge scales with
      // viewport width (margin-top: 12.5%), so anchor below its real bottom.
      const button = this.$refs.spawnButton;
      const buttonBottom = button.offsetTop + button.offsetHeight;
      const y = Math.min(
          Math.max(height * 0.55, buttonBottom + fontSize),
          height - fontSize
      );
      const items = [];
      chars.forEach((char, index) => {
        const charWidth = widths[index];
        if (char !== ' ') {
          items.push({
            char,
            x: x + charWidth / 2,
            y,
            width: Math.max(charWidth, fontSize * 0.2),
            height: fontSize * 0.72,
            fontSize,
            color: '#111112',
          });
        }
        x += charWidth;
      });
      this.physics.setTitle(items);
    },
    resume() {
      if (!this.physics || this.animationFrame) {
        return;
      }
      const loop = () => {
        this.physics.step();
        this.renderer.draw(this.physics.drawables, skill => localized(skill.label));
        this.animationFrame = requestAnimationFrame(loop);
      };
      this.animationFrame = requestAnimationFrame(loop);
    },
    pause() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    },
    spawnSkill() {
      if (!this.physics) {
        return;
      }
      const button = this.$refs.spawnButton;
      button.classList.add('shake');
      setTimeout(() => button.classList.remove('shake'), 500);
      this.physics.spawnNext();
    },
    getPoint(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const source = (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0]) || event;
      return {x: source.clientX - rect.left, y: source.clientY - rect.top};
    },
    showTooltip(point, body) {
      const skill = body.plugin.skill;
      if (!skill) {
        // Loose title letters are grabbable but have no description.
        return;
      }
      this.$refs.tooltip.show({
        x: point.x,
        y: point.y,
        text: localized(skill.description),
        mirror: point.x < (isMobile() ? 250 : 300),
      });
    },
    onMouseDown(event) {
      const point = this.getPoint(event);
      const body = this.physics.bodyAt(point);
      if (!body) {
        return;
      }
      this.dragging = true;
      this.$refs.tooltip.hide();
      this.physics.startDrag(body, point);
      this.setCursor('grabbing');
    },
    onMouseMove(event) {
      if (this.dragging) {
        return;
      }
      const point = this.getPoint(event);
      const body = this.physics.bodyAt(point);
      this.$refs.canvas.style.cursor = body ? 'grab' : '';
      if (body && body.plugin.skill) {
        this.showTooltip(point, body);
      } else {
        this.$refs.tooltip.hide();
      }
    },
    onMouseLeave() {
      if (!this.dragging) {
        this.$refs.tooltip.hide();
      }
    },
    onWindowMouseMove(event) {
      // Window-level so a drag survives the cursor leaving the canvas.
      if (this.dragging) {
        this.physics.moveDrag(this.getPoint(event));
      }
    },
    onWindowMouseUp() {
      if (this.dragging) {
        this.dragging = false;
        this.physics.endDrag();
        this.setCursor('');
      }
    },
    // Applied to the page as well as the canvas, because the pointer may
    // leave the canvas mid-drag. The next hover restores 'grab' when relevant.
    setCursor(cursor) {
      this.$refs.canvas.style.cursor = cursor;
      document.body.style.cursor = cursor;
    },
    onTouchStart(event) {
      const point = this.getPoint(event);
      const body = this.physics.bodyAt(point);
      this.$refs.tooltip.hide();
      if (!body) {
        return;
      }
      // Grabbing a body: cancel scroll initiation for this touch sequence.
      event.preventDefault();
      this.dragging = true;
      this.physics.startDrag(body, point);
      this.touch = {body, start: point, time: Date.now(), moved: 0};
    },
    onTouchMove(event) {
      if (!this.dragging) {
        return;
      }
      event.preventDefault();
      const point = this.getPoint(event);
      if (this.touch) {
        this.touch.moved = Math.max(
            this.touch.moved,
            Math.hypot(point.x - this.touch.start.x, point.y - this.touch.start.y)
        );
      }
      this.physics.moveDrag(point);
    },
    onTouchEnd() {
      if (!this.dragging) {
        return;
      }
      this.dragging = false;
      this.physics.endDrag();
      const touch = this.touch;
      this.touch = null;
      if (touch && touch.moved < TAP_MAX_DISTANCE && Date.now() - touch.time < TAP_MAX_DURATION) {
        // A quick tap (no real drag): show the description at the body's position.
        this.showTooltip(touch.body.position, touch.body);
      }
    },
    onResize() {
      if (!this.physics) {
        return;
      }
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        const section = this.$refs.section;
        if (!section) {
          return;
        }
        const width = section.clientWidth;
        const height = section.clientHeight;
        this.renderer.resize(width, height);
        this.physics.resize(width, height);
        if (this.physics.titlePristine()) {
          this.layoutTitle();
        }
      }, 150);
    },
  }
}
</script>

<style lang="scss" scoped>
.physics-skills {
  position: relative;
  @include full-height;

  &.bg-yellow {
    background-color: $yellow;
  }

  &.bg-green {
    background-color: $green;
  }

  canvas {
    position: relative;
    display: block;
    z-index: 1;
    touch-action: pan-y;
  }

  .spawn-button {
    position: absolute;
    width: 250px;
    height: 250px;
    border-radius: 150px;
    margin: auto;
    margin-top: 12.5%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: $black;
    color: $white;
    font-size: 55px;
    font-weight: bold;
    line-height: 65px;
    // Keep wrapped lines away from the curved edge (long Dutch labels).
    padding: 0 25px;
    z-index: 3;
  }

  @-webkit-keyframes shaker {
    0% {
      -webkit-transform: translate(2px, 0);
    }
    50% {
      -webkit-transform: translate(-2px, 0);
    }
    100% {
      -webkit-transform: translate(2px, 0);
    }
  }

  .shake {
    -webkit-animation-name: shaker;
    -webkit-animation-duration: 0.1s;
    -webkit-transform-origin: 50% 50%;
    -webkit-animation-timing-function: linear;
  }
}
</style>
