import Render from './render';
import Rect from './rect';
import mat4 from 'gl-mat4';
import css2matrix from 'css-transform-to-mat4';
import interpolate from 'mat4-interpolate';

const webglEl = document.getElementById('webgl');
const canvas2dEl = document.getElementById('canvas2d');
const css3dEl = document.getElementById('css3d');

const renders = [
    new Render(webglEl, 'webgl'),
    new Render(canvas2dEl, 'canvas'),
    new Render(css3dEl, 'css')
];

let translateX = 100;
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

    renders.forEach(render => {
        const rect = render.rect;
        render.transform(rect, 
            `rotateZ(-${rotateZ}deg)`, 
            `translateX(${translateX}px)`);
        render.draw(rect);
    });
}

renders.forEach(render => {
    render.clearColor('#000F');
    
    const rect = new Rect({
        width: 50,
        height: 50,
        position: [-25, 25, 0],
        color: '#FFFF'
    });
    render.rect = rect;
    render.draw(rect);
});

tick()

