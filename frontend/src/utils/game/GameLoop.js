/**
 * Fixed-timestep game loop: update() runs at a constant simulation rate
 * (default 120 Hz) regardless of display refresh rate; render() runs once
 * per animation frame.
 */
export default class GameLoop {
    constructor({update, render, timestep = 1000 / 120}) {
        this.update = update;
        this.render = render;
        this.timestep = timestep;
        this.running = false;
        this.paused = false;
        this.accumulator = 0;
        this.lastTime = 0;
        this.frame = null;
    }

    start() {
        if (this.running) {
            return;
        }
        this.running = true;
        this.paused = false;
        this.accumulator = 0;
        this.lastTime = performance.now();
        this.frame = requestAnimationFrame(this.tick);
    }

    tick = (now) => {
        if (!this.running) {
            return;
        }
        this.frame = requestAnimationFrame(this.tick);
        if (this.paused) {
            this.lastTime = now;
            return;
        }
        // Clamp huge deltas (tab switches) so the simulation never fast-forwards.
        let delta = Math.min(now - this.lastTime, 250);
        this.lastTime = now;
        this.accumulator += delta;
        while (this.accumulator >= this.timestep) {
            this.update(this.timestep / 1000);
            this.accumulator -= this.timestep;
        }
        this.render();
    };

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    stop() {
        this.running = false;
        if (this.frame) {
            cancelAnimationFrame(this.frame);
            this.frame = null;
        }
    }
}
