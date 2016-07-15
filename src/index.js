import {
    rgba2glColor,
    deg2rad
} from './util';
import WebGLEngine from './webgl';
import Canvas2DEngine from './canvas2d';
import CSS3DEngine from './css3d';
import Rect from './rect';
import mat4 from 'gl-mat4';

class Render {
    constructor(element, engine) {
        const elRect = element.getBoundingClientRect();
        this.viewportWidth = elRect.width;
        this.viewportHeight = elRect.height;
        this.engine = engine;

        engine.attachElement(element);
        engine.setSize(this.viewportWidth, this.viewportHeight);
    }

    clearColor(color) {
        if (typeof color === 'string') {
            color = rgba2glColor(color)
        }
        this.engine.setClearColor(color)
    }

    draw(el) {
        this.engine.draw(el);
    }

    drawRect(options) {
        const rect = new Rect(options);
        this.draw(rect);
        return rect;
    }

}

const webglEl = document.getElementById('webgl');
const canvas2dEl = document.getElementById('canvas2d');
const css3dEl = document.getElementById('css3d');

const renders = [
    new Render(webglEl, new WebGLEngine()),
    new Render(canvas2dEl, new Canvas2DEngine()),
    new Render(css3dEl, new CSS3DEngine())
];

let translateX = 80;
let rotateZ = 0;
let lastTime = Date.now();
function tick() {
    requestAnimationFrame(tick);
    const nowTime = Date.now();
    const elapsed = nowTime - lastTime;
    animation(elapsed);
    lastTime = nowTime;
}

function animation(elapsed) {
    rotateZ += (90 * elapsed) / 1000;
    
    const matrix = mat4.create();
    mat4.identity(matrix, matrix);
    mat4.rotateZ(matrix, matrix, deg2rad(rotateZ));
    mat4.translate(matrix, matrix, [translateX, 0, 0]);

    renders.forEach(render => {
        const rect = render.rect;

        render.rect.transform(matrix);
        render.draw(render.rect);
    });
}

renders.forEach(render => {
    render.clearColor('#000F');
    
    const rect = render.drawRect({
        width: 50,
        height: 50,
        position: [-25, 25, 0],
        color: '#FFFF'
    });
    render.rect = rect;
});

tick()

