<template>
  <div class="gallery" @click.self="close">
    <button class="icon-btn close" @click="close" aria-label="Close gallery">&times;</button>

    <button v-if="items.length > 1" class="icon-btn nav prev" @click.stop="prev" aria-label="Previous">&lsaquo;</button>

    <figure class="stage" @click.self="close">
      <img
        v-if="current.type !== 'video'"
        ref="img"
        :src="current.src"
        :alt="current.alt || ''"
        :class="{ zoomed }"
        :style="imgStyle"
        @click.stop="toggleZoom"
        @mousemove="onMove"
        @touchstart.stop="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      />
      <video
        v-else
        controls
        playsinline
        preload="metadata"
        :src="current.src"
        class="video-el"
        @click.stop
      ></video>
      <figcaption v-if="current.alt" class="caption">{{ current.alt }}</figcaption>
    </figure>

    <button v-if="items.length > 1" class="icon-btn nav next" @click.stop="next" aria-label="Next">&rsaquo;</button>

    <div v-if="items.length > 1" class="counter">{{ index + 1 }} / {{ items.length }}</div>
  </div>
</template>

<script>
export default {
  name: "MediaGallery",
  props: {
    items: {type: Array, required: true},
    startIndex: {type: Number, default: 0},
  },
  emits: ["close"],
  data() {
    return {
      index: this.startIndex,
      zoomed: false,
      originX: 50,
      originY: 50,
      touchStartX: 0,
      touchStartY: 0,
      touchMoved: false,
    };
  },
  computed: {
    current() {
      return this.items[this.index] || {};
    },
    imgStyle() {
      if (!this.zoomed) return {};
      return {
        transform: "scale(2.4)",
        transformOrigin: `${this.originX}% ${this.originY}%`,
      };
    },
  },
  mounted() {
    window.addEventListener("keydown", this.onKey);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKey);
  },
  methods: {
    close() {
      this.$emit("close");
    },
    next() {
      this.index = (this.index + 1) % this.items.length;
      this.resetZoom();
    },
    prev() {
      this.index = (this.index - 1 + this.items.length) % this.items.length;
      this.resetZoom();
    },
    resetZoom() {
      this.zoomed = false;
      this.originX = 50;
      this.originY = 50;
    },
    toggleZoom(event) {
      if (this.zoomed) {
        this.resetZoom();
      } else {
        this.setOrigin(event);
        this.zoomed = true;
      }
    },
    setOrigin(event) {
      const img = this.$refs.img;
      if (!img) return;
      const rect = img.getBoundingClientRect();
      const point = event.touches ? event.touches[0] : event;
      const x = ((point.clientX - rect.left) / rect.width) * 100;
      const y = ((point.clientY - rect.top) / rect.height) * 100;
      this.originX = Math.max(0, Math.min(100, x));
      this.originY = Math.max(0, Math.min(100, y));
    },
    onMove(event) {
      if (this.zoomed) this.setOrigin(event);
    },
    onKey(event) {
      if (event.key === "Escape") this.close();
      else if (event.key === "ArrowRight" && this.items.length > 1) this.next();
      else if (event.key === "ArrowLeft" && this.items.length > 1) this.prev();
    },
    onTouchStart(event) {
      const t = event.touches[0];
      this.touchStartX = t.clientX;
      this.touchStartY = t.clientY;
      this.touchMoved = false;
    },
    onTouchMove(event) {
      const t = event.touches[0];
      const dx = t.clientX - this.touchStartX;
      const dy = t.clientY - this.touchStartY;
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) this.touchMoved = true;
      if (this.zoomed) this.setOrigin(event);
    },
    onTouchEnd(event) {
      if (this.zoomed) return;
      const dx = (event.changedTouches[0]?.clientX ?? this.touchStartX) - this.touchStartX;
      if (!this.touchMoved) {
        this.setOrigin({clientX: this.touchStartX, clientY: this.touchStartY});
        this.zoomed = true;
      } else if (this.items.length > 1 && Math.abs(dx) > 45) {
        dx < 0 ? this.next() : this.prev();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.gallery {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 12, 0.94);
  backdrop-filter: blur(4px);
  animation: fade 0.18s ease;
}

@keyframes fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.stage {
  margin: 0;
  max-width: 92vw;
  max-height: 88vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  gap: 14px;

  img, .video-el {
    max-width: 92vw;
    max-height: 82vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  img {
    cursor: zoom-in;
    transition: transform 0.12s ease-out;

    &.zoomed {
      cursor: zoom-out;
      transition: none;
    }
  }

  .video-el {
    width: auto;
    background: #000;
  }

  .caption {
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.95rem;
    text-align: center;
    max-width: 80vw;
  }
}

.icon-btn {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 50%;
  transition: background 0.15s ease;
  line-height: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.24);
  }
}

.close {
  top: 20px;
  right: 24px;
  width: 48px;
  height: 48px;
  font-size: 32px;
}

.nav {
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  font-size: 40px;
  padding-bottom: 4px;

  &.prev { left: 24px; }
  &.next { right: 24px; }
}

.counter {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 14px;
  border-radius: 20px;
}

@media (max-width: 767px) {
  .close { top: 14px; right: 14px; width: 42px; height: 42px; font-size: 28px; }
  .nav { width: 46px; height: 46px; font-size: 32px; }
  .nav.prev { left: 10px; }
  .nav.next { right: 10px; }
}
</style>
