import {
    glColor2rgba,
    translateAxis,
    obj2style
} from './util';
import Engine from './engine';

export default class CSS3DEngine extends Engine {
    constructor() {
        super();
    }

    setSize(width, height) {
        super.setSize(width, height);
        this.el.style.width = width + 'px';
        this.el.style.height = height + 'px';
    }

    setClearColor(color) {
        this.el.style.backgroundColor = glColor2rgba(color);
    }

    draw(el) {
        let domElement
        if (!el.domElement) {
            domElement = document.createElement('div');
            el.domElement = domElement;
        } else {
            domElement = el.domElement
        }

        const {transformMatrix} = el;
        const {width, height, position, color} = el.options;
        const [x, y, z] = translateAxis(position, this.viewportWidth, this.viewportHeight);

        domElement.style.cssText = obj2style({
            position: 'absolute',
            width,
            height,
            'background-color': glColor2rgba(color),
            left: x,
            top: y,
            transform: `matrix3d(${transformMatrix.join(',')})`
        });

        if (domElement.parentNode == null) {
            this.el.appendChild(domElement);
        }
    }
}