import {
    glColor2rgba,
    translateAxis
} from './util'
import Engine from './engine';
import vec3 from 'gl-vec3';

export default class Canvas2DEngine extends Engine {
    constructor() {
        super();
    }

    attachElement(...args) {
        super.attachElement(...args);
        this.context = this.el.getContext('2d')
    }

    setSize(width, height) {
        super.setSize(width, height);
        this.el.width = width;
        this.el.height = height;
        this.context.width = width;
        this.context.height = height;
    }

    setClearColor(color) {
        this.el.style.backgroundColor = glColor2rgba(color);
    }

    draw(el) {
        this.context.clearRect(0, 0, this.viewportWidth, this.viewportHeight);
        const {transformMatrix} = el;
        const {color} = el.options;

        this.context.beginPath();
        el.points.forEach((point, i) => {
            let [x, y, z] = vec3.transformMat4([], point, transformMatrix);
            [x, y, z] = translateAxis([x, y, z], this.viewportWidth, this.viewportHeight);
            if (i === 0) {
                this.context.moveTo(x, y);
            } else {
                this.context.lineTo(x, y);
            }
        });
        this.context.closePath();

        this.context.fillStyle = glColor2rgba(color);
        this.context.fill();
    }
}