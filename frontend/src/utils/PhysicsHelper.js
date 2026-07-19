import "pathseg"
import Matter from "matter-js";

const Vertices = Matter.Vertices,
    Svg = Matter.Svg;

class PhysicsHelper {
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

    GetVerticesOfSvg(point, raw, scale, switcher) {
        const root = this.#LoadSvg(raw);

        const paths = this.#Select(root, 'path');
        return paths
            .map((path) => {
                if (switcher)
                    return Vertices.scale(this.#ToVertex(path, 0.5), scale, scale, point);
                return Vertices.scale(Svg.pathToVertices(path, 30), scale, scale, point);
                // return Svg.pathToVertices(path, 30);
            });
    }

    GetRandomPosition(width) {
        return {x: Math.floor(Math.random() * width), y: 200};
    };

    Intersects(point, position, dimensions) {
        const hw = dimensions.width/2;
        const hh = dimensions.height/2;
        return point.x >= position.x - hw && point.x <= position.x+hw && point.y >= position.y - hh && point.y <= position.y+hh;
    };
}

const physicsHelper = new PhysicsHelper();
export default physicsHelper;
