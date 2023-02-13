import Matter from "matter-js"
import "pathseg"
import {shallowRef} from "vue";
import decomp from 'poly-decomp';

const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Svg = Matter.Svg,
    Vertices = Matter.Vertices,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

window.decomp = decomp;

class Physics {
    constructor() {
        this.engine = shallowRef(Engine.create());
        this.runner = shallowRef(Runner.create());
        this.bodies = [];
        this.walls = [];
        this.divs = {};
        this.offsets = {};
        this.showTooltip = false;
        Events.on(this.engine.value, 'afterUpdate', () => {
            this.bodies.forEach(body => {
                this.UpdateDiv(body, this.divs[body.id], this.offsets[body.id]);
            });
        });
    }

    SetRender(id, width, height, background) {
        this.canvas = document.getElementById(id);
        this.render = shallowRef(Render.create({
            element: document.getElementById(id),
            engine: this.engine.value,
            options: {
                width: width,
                height: height,
                pixelRatio: window.devicePixelRatio,
                background: background,
                hasBounds: true,
                enabled: true,
                wireframes: false,
                showSleeping: true,
                showDebug: false,
                showBroadphase: false,
                showBounds: false,
                showVelocity: false,
                showCollisions: false,
                showSeparations: false,
                showAxes: false,
                showPositions: false,
                showAngleIndicator: false,
                showIds: false,
                showVertexNumbers: false,
                showConvexHulls: false,
                showInternalEdges: false,
                showMousePosition: false
            }
        }));
        this.tooltip = document.getElementById('tooltip');
        this.width = width;
        this.height = height;
    }

    SetWalls() {
        // Create a wall for the shapes to bounce off
        const wallOptions = {
            isStatic: true,
            render: {
                visible: true
            }
        }

        const ground = shallowRef(Bodies.rectangle(this.width / 2, this.height + 50, this.width + 100, 100, wallOptions));
        const ceiling = shallowRef(Bodies.rectangle(this.width / 2, -50, this.width + 100, 100, wallOptions));
        const leftWall = shallowRef(Bodies.rectangle(-50, this.height / 2, 100, this.height + 100, wallOptions));
        const rightWall = shallowRef(Bodies.rectangle(this.width + 50, this.height / 2, 100, this.height + 100, wallOptions));
        this.walls = [ground, ceiling, leftWall, rightWall];

        Composite.add(this.engine.value.world, [ground.value, ceiling.value, leftWall.value, rightWall.value]);
    }

    SetMouse(id, stiffness) {
        const mouse = shallowRef(Mouse.create(this.render.value.canvas)),
            mouseConstraint = shallowRef(MouseConstraint.create(this.engine.value, {
                mouse: mouse.value,
                constraint: {
                    stiffness: stiffness,
                    render: {
                        visible: false
                    }
                }
            }));
        Mouse.setElement(mouse.value, document.getElementById(id));
        Events.on(mouseConstraint.value, 'mousemove', (event) => {
            //For Matter.Query.point pass "array of bodies" and "mouse position"
            const foundBodies = Matter.Query.point(this.bodies, event.mouse.position);
            // if(foundBodies !== undefined && foundBodies.length > 0){
            //     const foundBody = foundBodies[0];
            //     this.tooltip.style.left = event.mouse.position.x - this.tooltip.offsetWidth + 'px';
            //     this.tooltip.style.top = event.mouse.position.y - this.tooltip.offsetHeight + 'px';
            //     this.tooltip.childNodes[2].textContent = this.info[foundBody.id];
            //     if(!this.showTooltip){
            //         this.tooltip.classList.toggle('show');
            //         this.showTooltip = !this.showTooltip;
            //     }
            // }else if(this.showTooltip) {
            //     this.tooltip.classList.toggle('show');
            //     this.showTooltip = !this.showTooltip;
            // }
        });

        Composite.add(this.engine.value.world, mouseConstraint.value);
        this.render.value.mouse = mouse.value;
    }

    AddBox(x, y, width, height, info) {
        const box = shallowRef(Bodies.rectangle(x, y, width, height));
        Composite.add(this.engine.value.world, [box.value]);
        this.bodies.push(box.value);
    }

    #LoadSvg(raw) {
        return new window.DOMParser().parseFromString(raw, 'image/svg+xml');
    }

    #Select(root, selector) {
        return Array.prototype.slice.call(root.querySelectorAll(selector));
    }

    #ToVertex(pathSVG, n) {
        let pathLength = pathSVG.getTotalLength();
        let vtx = [];
        let i = 0;
        while (i < pathLength) {
            let arr = pathSVG.getPointAtLength(i);
            vtx.push({x: arr.x, y: arr.y});
            i += n;
        }
        return vtx;
    }

    GetColors(raw) {
        const re = /#[0-9a-f]{3,6}/gi;
        return raw.match(re);
    }

    getSvgBody(point, raw, scale, switcher) {
        const root = this.#LoadSvg(raw);
        const colors = this.GetColors(raw);

        const paths = this.#Select(root, 'path');
        const vertexSets = paths
            .map((path) => {
                if (switcher)
                    return Vertices.scale(this.#ToVertex(path, 0.5), scale, scale, point);
                return Vertices.scale(Svg.pathToVertices(path, 30), scale, scale, point);
                // return Svg.pathToVertices(path, 30);
            });

        return shallowRef(Bodies.fromVertices(point.x, point.y, vertexSets, {
            render: {
                fillStyle: colors[0],
                strokeStyle: colors[0],
                lineWidth: 1
            }
        }, true));
    }

    AddSvg(svg) {
        const parser = new DOMParser();
        const svgElement = parser.parseFromString(svg.raw, "image/svg+xml").documentElement;

        svgElement.style.position = "absolute";
        svgElement.setAttribute('width', svgElement.getAttribute('width') * svg.scale);
        svgElement.setAttribute('height', svgElement.getAttribute('height') * svg.scale);
        this.UpdateDiv(svg.svgBody, svgElement, svg.offset);
        this.canvas.appendChild(svgElement);
        svgElement.addEventListener('mouseover', (event) => {
            this.tooltip.style.left = event.x - this.tooltip.offsetWidth + 'px';
            this.tooltip.style.top = event.y - this.tooltip.offsetHeight + 'px';
            this.tooltip.childNodes[2].textContent = svg.info;
            if (!this.showTooltip) {
                this.tooltip.classList.toggle('show');
                this.showTooltip = !this.showTooltip;
            }
        });
        svgElement.addEventListener('mouseout', () => {
            this.tooltip.classList.toggle('show');
            this.showTooltip = !this.showTooltip;
        });

        Composite.add(this.engine.value.world, svg.svgBody);
        this.bodies.push(svg.svgBody);
        this.divs[svg.svgBody.id] = svgElement;
        this.offsets[svg.svgBody.id] = svg.offset;
    }

    Start() {
        Render.run(this.render.value);
        Runner.run(this.runner.value, this.engine.value);
    }

    OnResize(width, height) {
        this.width = width;
        this.height = height;
        if (this.walls.length > 0) {
            this.walls[0].value.position.x = this.width / 2;
            this.walls[0].value.position.y = this.height + 50;
            this.walls[0].value.width = this.width + 100;
            this.walls[0].value.height = 100;
            this.walls[1].value.position.x = this.width / 2;
            this.walls[1].value.position.y = -50;
            this.walls[1].value.width = this.width + 100;
            this.walls[1].value.height = 100;
            this.walls[2].value.position.x = -50;
            this.walls[2].value.position.y = this.height / 2;
            this.walls[2].value.width = 100;
            this.walls[2].value.height = this.height + 100;
            this.walls[3].value.position.x = this.width + 50;
            this.walls[3].value.position.y = this.height / 2;
            this.walls[3].value.width = 100;
            this.walls[3].value.height = this.height + 100;
        }
    }

    UpdateDiv(body, div, offset) {
        let pos = body.position;
        let angle = body.angle;
        let degrees = angle * (180 / Math.PI);

        div.style.transform = "rotate(" + degrees + "deg)";
        div.style.left = (pos.x - offset.x) + "px";
        div.style.top = (pos.y - offset.y) + "px";
    }

    UpdatePosition(body, position) {
        Body.set(body, "position", position);
    }
}

const physics = new Physics();
export default physics;
