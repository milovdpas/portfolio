import {Bodies, Body, Composite, Constraint, Engine, Events, Query} from 'matter-js';

const WALL_THICKNESS = 200;
const SPAWN_MARGIN = 150;

/**
 * Main-thread matter.js wrapper for a skills section.
 * One instance per section; the owning component drives stepping via rAF,
 * which makes pause/resume trivial (no Runner, no catch-up spiral).
 */
export default class SkillsPhysics {
    constructor() {
        this.engine = Engine.create();
        this.walls = [];
        this.pending = [];
        this.spawned = [];
        this.letters = [];
        this.dragConstraint = null;
        this.width = 0;
        this.height = 0;
    }

    /**
     * @param width  canvas width in px
     * @param height canvas height in px
     * @param items  [{skill, width, height}] — skill is a config entry from config/skills.js,
     *               width/height the rendered size of the body in px
     */
    init(width, height, items) {
        this.width = width;
        this.height = height;
        this.#buildWalls();
        for (const item of items) {
            const body = this.#createBody(item);
            body.plugin.skill = item.skill;
            body.plugin.size = {width: item.width, height: item.height};
            // Matter recenters vertices on the centre of mass, which for
            // asymmetric shapes (e.g. triangle-down) is not the bounding-box
            // center the icon is drawn around — remember the difference.
            body.plugin.drawOffset = {
                x: (body.bounds.min.x + body.bounds.max.x) / 2 - body.position.x,
                y: (body.bounds.min.y + body.bounds.max.y) / 2 - body.position.y,
            };
            // Bodies wait in a spawn queue (not in the world) until the spawn button pops them.
            this.pending.push(body);
        }
        // Title letters start as static bodies; the first dynamic body that
        // touches one knocks it loose (freed letters then free their neighbours).
        Events.on(this.engine, 'collisionStart', event => {
            for (const pair of event.pairs) {
                this.#maybeFreeLetter(pair.bodyA, pair.bodyB);
                this.#maybeFreeLetter(pair.bodyB, pair.bodyA);
            }
        });
    }

    #maybeFreeLetter(letter, other) {
        if (!letter.plugin.letter || !letter.isStatic) {
            return;
        }
        const otherIsToy = other.plugin.skill || other.plugin.letter;
        if (otherIsToy && !other.isStatic) {
            Body.setStatic(letter, false);
        }
    }

    /**
     * (Re)places the section title as one static body per letter.
     * @param items [{char, x, y, width, height, fontSize, color}]
     */
    setTitle(items) {
        this.clearTitle();
        for (const item of items) {
            const body = Bodies.rectangle(item.x, item.y, item.width, item.height, {
                isStatic: true,
                restitution: 0.3,
                friction: 0.3,
                frictionAir: 0.01,
            });
            body.plugin.letter = {char: item.char, fontSize: item.fontSize, color: item.color};
            this.letters.push(body);
        }
        Composite.add(this.engine.world, this.letters);
    }

    clearTitle() {
        for (const letter of this.letters) {
            Composite.remove(this.engine.world, letter);
        }
        this.letters = [];
    }

    /** True while no letter has been knocked loose (safe to re-layout the title). */
    titlePristine() {
        return this.letters.every(letter => letter.isStatic);
    }

    /** Bodies the renderer should draw, letters underneath the shapes. */
    get drawables() {
        return [...this.letters, ...this.spawned];
    }

    #createBody(item) {
        const options = {
            restitution: 0.4,
            friction: 0.3,
            frictionAir: 0.01,
        };
        // The collision body may be smaller than the drawn size for icons
        // with a lot of transparent area.
        const scale = item.skill.hitboxScale || 1;
        const width = item.width * scale;
        const height = item.height * scale;
        switch (item.skill.shape) {
            case 'circle':
                return Bodies.circle(0, 0, width / 2, options);
            case 'triangle':
                return Bodies.polygon(0, 0, 3, width / 2, options);
            case 'hexagon':
                // Matter's 6-sided polygon is pointy-top, like the Node.js badge;
                // its circumradius runs along the vertical axis.
                return Bodies.polygon(0, 0, 6, height / 2, options);
            case 'diamond': {
                const rx = width / 2;
                const ry = height / 2;
                return Bodies.fromVertices(0, 0, [[
                    {x: -rx, y: 0},
                    {x: 0, y: -ry},
                    {x: rx, y: 0},
                    {x: 0, y: ry},
                ]], options);
            }
            case 'triangle-down': {
                const rx = width / 2;
                const ry = height / 2;
                return Bodies.fromVertices(0, 0, [[
                    {x: -rx, y: -ry},
                    {x: rx, y: -ry},
                    {x: 0, y: ry},
                ]], options);
            }
            default:
                return Bodies.rectangle(0, 0, width, height, {
                    ...options,
                    chamfer: {radius: Math.min(width, height) * 0.15},
                });
        }
    }

    #buildWalls() {
        if (this.walls.length) {
            for (const wall of this.walls) {
                Composite.remove(this.engine.world, wall);
            }
        }
        const t = WALL_THICKNESS;
        const w = this.width;
        const h = this.height;
        const options = {isStatic: true};
        this.walls = [
            Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, options), // ground
            Bodies.rectangle(w / 2, -t / 2, w + t * 2, t, options),   // ceiling
            Bodies.rectangle(-t / 2, h / 2, t, h + t * 2, options),   // left
            Bodies.rectangle(w + t / 2, h / 2, t, h + t * 2, options),// right
        ];
        Composite.add(this.engine.world, this.walls);
    }

    /** Pops a random queued body into the world; once empty, re-flings an existing one. */
    spawnNext() {
        if (this.pending.length === 0) {
            const body = this.spawned[Math.floor(Math.random() * this.spawned.length)];
            if (!body) {
                return;
            }
            Body.setPosition(body, this.#spawnPoint());
            Body.setVelocity(body, {x: 0, y: 0});
            Body.setAngularVelocity(body, 0);
            return;
        }
        const index = Math.floor(Math.random() * this.pending.length);
        const body = this.pending.splice(index, 1)[0];
        Body.setPosition(body, this.#spawnPoint());
        Composite.add(this.engine.world, body);
        this.spawned.push(body);
    }

    #spawnPoint() {
        const x = SPAWN_MARGIN + Math.random() * Math.max(1, this.width - SPAWN_MARGIN * 2);
        return {x, y: 150};
    }

    step() {
        Engine.update(this.engine, 1000 / 60);
    }

    /** Accurate per-shape hit test; loose letters are grabbable too. */
    bodyAt(point) {
        const grabbable = [...this.spawned, ...this.letters.filter(letter => !letter.isStatic)];
        return Query.point(grabbable, point)[0] || null;
    }

    startDrag(body, point) {
        this.endDrag();
        this.dragConstraint = Constraint.create({
            pointA: {x: point.x, y: point.y},
            bodyB: body,
            pointB: {x: point.x - body.position.x, y: point.y - body.position.y},
            length: 0,
            stiffness: 0.2,
            damping: 0.05,
        });
        Composite.add(this.engine.world, this.dragConstraint);
    }

    moveDrag(point) {
        if (this.dragConstraint) {
            this.dragConstraint.pointA = {x: point.x, y: point.y};
        }
    }

    /** Releasing simply removes the constraint — the body keeps its throw velocity. */
    endDrag() {
        if (this.dragConstraint) {
            Composite.remove(this.engine.world, this.dragConstraint);
            this.dragConstraint = null;
        }
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.#buildWalls();
        const dynamicBodies = [...this.spawned, ...this.letters.filter(letter => !letter.isStatic)];
        for (const body of dynamicBodies) {
            const x = Math.min(Math.max(body.position.x, 50), Math.max(50, width - 50));
            const y = Math.min(body.position.y, height - 50);
            if (x !== body.position.x || y !== body.position.y) {
                Body.setPosition(body, {x, y});
                Body.setVelocity(body, {x: 0, y: 0});
            }
        }
    }

    destroy() {
        this.endDrag();
        Events.off(this.engine);
        Engine.clear(this.engine);
        this.walls = [];
        this.pending = [];
        this.spawned = [];
        this.letters = [];
    }
}
