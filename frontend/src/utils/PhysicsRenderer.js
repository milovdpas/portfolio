import "pathseg"
import decomp from 'poly-decomp';
import PhysicsHelper from "@/utils/PhysicsHelper";

window.decomp = decomp;

class PhysicsRenderer {
    constructor() {
        this.svgs = {};
        this.info = {};
        this.dimensions = {};
        this.images = {};
        this.offsets = {};
        this.showTooltip = false;
    }

    SetRender(id, width, height, isMobile) {
        this.canvas = document.getElementById(id);
        this.context = this.canvas.getContext("2d");
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.tooltip = document.getElementById('tooltip');
        window.requestAnimationFrame(() => this.Draw());
        this.AddEventListeners(isMobile);
    }

    AddEventListeners(isMobile){
        this.canvas.addEventListener('mousemove', (event) => {
            for(const bodyId in this.svgs){
                const body = this.svgs[bodyId];
                const point = {x: event.clientX, y: event.clientY};
                if (!PhysicsHelper.Intersects(point, body.position, this.dimensions[bodyId]))
                    continue;
                this.tooltip.style.left = event.x - this.tooltip.offsetWidth + 'px';
                this.tooltip.style.top = event.y - this.tooltip.offsetHeight + 'px';
                this.tooltip.childNodes[2].textContent = this.info[bodyId];
                if (!this.showTooltip) {
                    console.log(point.x);
                    if(point.x < (isMobile ? 150 : 250))
                        this.tooltip.classList.add('mirror');
                    else
                        this.tooltip.classList.remove('mirror');
                    this.tooltip.classList.add('show');
                    this.showTooltip = true;
                }
                return;
            }
            this.tooltip.classList.remove('show');
            this.showTooltip = false;

        });
        this.canvas.addEventListener('mouseout', () => {
            this.tooltip.classList.remove('show');
            this.showTooltip = false;
        });
    }

    AddSvg(body, svg) {
        const img = new Image();
        img.src = svg.href;
        img.onload = () => {
            this.svgs[body.id] = body;
        }

        const width = body.bounds.max.x - body.bounds.min.x;
        const height = body.bounds.max.y - body.bounds.min.y;
        this.dimensions[body.id] = {
            width,
            height
        }
        this.images[body.id] = img;
        this.info[body.id] = svg.info;
        this.offsets[body.id] = svg.offset;
    }

    UpdateSvg(body) {
        this.svgs[body.id] = body;
    }

    ClearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    Draw() {
        this.ClearCanvas();
        for (const bodyId in this.svgs) {
            const body = this.svgs[bodyId];
            const image = this.images[bodyId];
            const dimensions = this.dimensions[bodyId];
            this.DrawImage(image, body, dimensions);
        }
        window.requestAnimationFrame(() => this.Draw())
    }

    DrawImage(img, body, dimensions) {
        let pos = body.position;
        let angle = body.angle;
        let degrees = angle * (180 / Math.PI);

        this.context.save();
        this.context.translate(pos.x, pos.y);
        this.context.rotate(degrees * Math.PI / 180);
        this.context.drawImage(img, -dimensions.width / 2, -dimensions.height / 2, dimensions.width, dimensions.height);
        this.context.restore();
    }

    Resize(width, height){
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

const physicsRenderer = new PhysicsRenderer();
export default physicsRenderer;
