/**
 * Unified game input on top of Pointer Events (one code path for mouse and
 * touch, multi-touch included) plus a small keyboard helper.
 *
 * Tracks every active pointer by pointerId, including its velocity — needed
 * for flick/shot power and for air hockey strikers following fingers.
 */
// Keys games use; their browser default (Space/arrows scroll the page!)
// is suppressed while a game is mounted.
const CAPTURED_KEYS = new Set(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD']);

export default class Input {
    constructor(element) {
        this.element = element;
        this.pointers = new Map(); // pointerId -> {x, y, vx, vy, startX, startY, time}
        this.keys = new Set();
        this.handlers = {down: [], move: [], up: [], keydown: [], keyup: []};

        this.onPointerDown = this.onPointerDown.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerUp = this.onPointerUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        element.addEventListener('pointerdown', this.onPointerDown);
        element.addEventListener('pointermove', this.onPointerMove);
        element.addEventListener('pointerup', this.onPointerUp);
        element.addEventListener('pointercancel', this.onPointerUp);
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    on(event, handler) {
        this.handlers[event].push(handler);
        return this;
    }

    #emit(event, payload) {
        for (const handler of this.handlers[event]) {
            handler(payload);
        }
    }

    #position(event) {
        const rect = this.element.getBoundingClientRect();
        return {x: event.clientX - rect.left, y: event.clientY - rect.top};
    }

    onPointerDown(event) {
        this.element.setPointerCapture(event.pointerId);
        const {x, y} = this.#position(event);
        const pointer = {id: event.pointerId, x, y, vx: 0, vy: 0, startX: x, startY: y, time: performance.now()};
        this.pointers.set(event.pointerId, pointer);
        this.#emit('down', pointer);
    }

    onPointerMove(event) {
        const pointer = this.pointers.get(event.pointerId);
        if (!pointer) {
            return;
        }
        const {x, y} = this.#position(event);
        const now = performance.now();
        const dt = Math.max(1, now - pointer.time);
        pointer.vx = (x - pointer.x) / dt * 1000;
        pointer.vy = (y - pointer.y) / dt * 1000;
        pointer.x = x;
        pointer.y = y;
        pointer.time = now;
        this.#emit('move', pointer);
    }

    onPointerUp(event) {
        const pointer = this.pointers.get(event.pointerId);
        if (!pointer) {
            return;
        }
        this.pointers.delete(event.pointerId);
        this.#emit('up', pointer);
    }

    onKeyDown(event) {
        if (CAPTURED_KEYS.has(event.code)) {
            event.preventDefault();
        }
        if (!this.keys.has(event.code)) {
            this.keys.add(event.code);
            this.#emit('keydown', event.code);
        }
    }

    onKeyUp(event) {
        if (CAPTURED_KEYS.has(event.code)) {
            event.preventDefault();
        }
        this.keys.delete(event.code);
        this.#emit('keyup', event.code);
    }

    pressed(code) {
        return this.keys.has(code);
    }

    destroy() {
        this.element.removeEventListener('pointerdown', this.onPointerDown);
        this.element.removeEventListener('pointermove', this.onPointerMove);
        this.element.removeEventListener('pointerup', this.onPointerUp);
        this.element.removeEventListener('pointercancel', this.onPointerUp);
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        this.pointers.clear();
        this.keys.clear();
    }
}
