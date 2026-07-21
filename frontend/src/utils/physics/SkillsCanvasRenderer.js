/**
 * Canvas 2D renderer for a skills physics section.
 * Icon bodies draw their SVG image; icon-less bodies draw their exact physics
 * outline (chamfers included) filled with the skill color plus a centered label.
 */
export default class SkillsCanvasRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.images = new Map();
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    setImage(id, image) {
        this.images.set(id, image);
    }

    /**
     * @param bodies   matter bodies with plugin.skill / plugin.size
     * @param getLabel resolves the (localized) label for a skill entry
     */
    draw(bodies, getLabel) {
        const ctx = this.context;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const body of bodies) {
            if (body.plugin.letter) {
                this.#drawLetter(body);
                continue;
            }
            const skill = body.plugin.skill;
            const size = body.plugin.size;
            if (skill.icon) {
                const image = this.images.get(skill.id);
                if (!image) {
                    continue;
                }
                const offset = body.plugin.drawOffset || {x: 0, y: 0};
                ctx.save();
                ctx.translate(body.position.x, body.position.y);
                ctx.rotate(body.angle);
                ctx.drawImage(image, offset.x - size.width / 2, offset.y - size.height / 2, size.width, size.height);
                ctx.restore();
            } else {
                this.#drawShape(body, skill, size, getLabel);
            }
        }
    }

    #drawShape(body, skill, size, getLabel) {
        const ctx = this.context;
        ctx.save();
        ctx.fillStyle = skill.color;
        if (body.circleRadius) {
            ctx.beginPath();
            ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // The physics vertices are already in world space and include the chamfer.
            const vertices = body.vertices;
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
            ctx.fill();
        }

        const label = getLabel(skill);
        if (label) {
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle);
            ctx.fillStyle = skill.textColor || '#111112';
            ctx.font = `bold ${Math.max(13, Math.round(size.width / 9))}px coolvetica, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            let maxWidth = size.width * 0.85;
            if (skill.shape === 'triangle') {
                // Keep the label inside the triangle's incircle (centered on the
                // centroid): the only region that stays clear of all three edges
                // no matter how the body is rotated. Inradius = circumradius / 2.
                maxWidth = (size.width / 2) * 0.95;
            }
            ctx.fillText(label, 0, 0, maxWidth);
        }
        ctx.restore();
    }

    #drawLetter(body) {
        const ctx = this.context;
        const letter = body.plugin.letter;
        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);
        ctx.fillStyle = letter.color;
        ctx.font = `bold ${letter.fontSize}px coolvetica, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter.char, 0, 0);
        ctx.restore();
    }
}
