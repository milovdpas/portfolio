import Matter from "matter-js"
import {shallowRef} from "vue";
import PhysicsHelper from "@/utils/PhysicsHelper";
import decomp from 'poly-decomp';

const Engine = Matter.Engine,
    Common = Matter.Common,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite;
Common.setDecomp(decomp);

class PhysicsWorker {
    constructor() {
        this.engine = shallowRef(Engine.create());
        this.runner = shallowRef(Runner.create());
        this.bodies = [];
        this.walls = [];
    }

    Initialize(width, height, skills) {
        this.SetWalls(width, height);
        this.Start();
        this.skills = skills.map(skill => {
            skill.body = this.getSvgBody(skill.point, skill.vertices);
            return skill;
        });
        this.usedSkills = [];
    }

    SetWalls(width, height) {
        this.width = width;
        this.height = height;
        // Create a wall for the shapes to bounce off
        const wallOptions = {
            isStatic: true,
            render: {
                visible: true
            }
        }

        const ground = shallowRef(Bodies.rectangle(width / 2, height + 50, width + 100, 100, wallOptions));
        const ceiling = shallowRef(Bodies.rectangle(width / 2, -50, width + 100, 100, wallOptions));
        const leftWall = shallowRef(Bodies.rectangle(-50, height / 2, 100, height + 100, wallOptions));
        const rightWall = shallowRef(Bodies.rectangle(width + 50, height / 2, 100, height + 100, wallOptions));
        this.walls = [ground, ceiling, leftWall, rightWall];

        Composite.add(this.engine.value.world, [ground.value, ceiling.value, leftWall.value, rightWall.value]);
    }

    AddBox(x, y, width, height, info) {
        const box = shallowRef(Bodies.rectangle(x, y, width, height));
        Composite.add(this.engine.value.world, [box.value]);
        this.bodies.push(box.value);
    }

    getSvgBody(point, vertices) {
        return shallowRef(Bodies.fromVertices(point.x, point.y, vertices, {}, true));
    }

    AddSkill() {
        if (this.skills.length > 0) {
            const index = Math.floor(Math.random() * this.skills.length);
            const skill = this.skills[index];
            this.skills.splice(index, 1);
            this.usedSkills.push(skill.body);
            this.AddSvg(index, skill);
        } else {
            const index = Math.floor(Math.random() * this.usedSkills.length);
            const body = this.usedSkills[index];
            this.UpdatePosition(body, PhysicsHelper.GetRandomPosition(this.width))
        }
    }

    AddSvg(index, svg) {
        Composite.add(this.engine.value.world, svg.body.value);
        this.bodies.push(svg.body);
        self.postMessage({status: 'add_body', index: index, body: svg.body.value});
    }

    Start() {
        Runner.run(this.runner.value, this.engine.value);
        Events.on(this.engine.value, 'afterUpdate', () => {
            this.bodies.forEach(body => {
                self.postMessage({status: 'update_body', body: body.value});
            });
        });
    }

    OnResize(width, height) {
        this.width = width;
        this.height = height;
        if (this.walls.length > 0) {
            this.walls[0].value.position.x = width / 2;
            this.walls[0].value.position.y = height + 50;
            this.walls[0].value.width = width + 100;
            this.walls[0].value.height = 100;
            this.walls[1].value.position.x = width / 2;
            this.walls[1].value.position.y = -50;
            this.walls[1].value.width = width + 100;
            this.walls[1].value.height = 100;
            this.walls[2].value.position.x = -50;
            this.walls[2].value.position.y = height / 2;
            this.walls[2].value.width = 100;
            this.walls[2].value.height = height + 100;
            this.walls[3].value.position.x = width + 50;
            this.walls[3].value.position.y = height / 2;
            this.walls[3].value.width = 100;
            this.walls[3].value.height = height + 100;
        }
    }

    UpdatePosition(body, position) {
        Body.set(body.value, "position", position);
    }
}

const physicsWorker = new PhysicsWorker();

self.addEventListener('message', (e) => {
    const data = e.data;
    postMessage('WORKER STARTED');
    switch (data.cmd) {
        case 'init':
            physicsWorker.Initialize(data.width, data.height, JSON.parse(data.skills));
            self.postMessage({status: 'init_finished'});
            break;
        case 'add_skill':
            physicsWorker.AddSkill();
            self.postMessage('matter js: Added skill');
            break;
        case 'resize':
            physicsWorker.OnResize(data.width, data.height);
            self.postMessage('matter js: Rezie applied');
            break;
        case 'stop':
            self.postMessage('matter js: Terminated');
            self.close();
            break;
        default:
            self.postMessage('Unknown command: ' + data);
    }
}, false);
