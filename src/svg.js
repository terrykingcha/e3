import {
    glColor2rgba,
    translateAxis,
    obj2style
} from './util';
import vec3 from 'gl-vec3';
import Engine from './engine';

export default class SVGEngine extends Engine {
    constructor() {
        super();
    }

    setSize(width, height) {
        super.setSize(width, height);
        this.el.setAttribute('width', width + 'px');
        this.el.setAttribute('height', height + 'px');
        this.el.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    setClearColor(color) {
        this.el.style.backgroundColor = glColor2rgba(color);
    }

    draw(el) {
        let pathElement
        if (!el.pathElement) {
            pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            el.pathElement = pathElement;
        } else {
            pathElement = el.pathElement
        }

        const {transformMatrix} = el;
        const {color} = el.options;

        const d = [];

        el.points.forEach((point, i) => {
            let [x, y, z] = vec3.transformMat4([], point, transformMatrix);
            // invert Y axis against css transform matrix
            [x, y, z] = translateAxis([x, -y, z], this.viewportWidth, this.viewportHeight);
            if (i === 0) {
                d.push(`M ${x} ${y}`);
            } else {
                d.push(`L ${x} ${y}`);
            }
        });
        pathElement.setAttribute('d', d.join(' '));
        pathElement.setAttribute('fill', glColor2rgba(color));

        if (pathElement.parentNode == null) {
            this.el.appendChild(pathElement);
        }
    }
}