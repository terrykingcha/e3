import Render from './render';
import Rect from './rect';

const webglEl = document.getElementById('webgl');
const canvas2dEl = document.getElementById('canvas2d');
const css3dEl = document.getElementById('css3d');

const renders = [
    new Render(webglEl, 'webgl'),
    new Render(canvas2dEl, 'canvas'),
    new Render(css3dEl, 'css')
];

renders.forEach(render => {
    render.clearColor('#000F');
});

let translateX = 50;
let translateXStep = 10 / 1000; // 50 px/s 
let rotateZ = 0;
let rotateZStep = 360 / 1000; // 360 deg/s
const rect = new Rect({
    width: 50,
    height: 50,
    position: [-25, 25, 0],
    color: '#FFFF'
});
function animation(elapsed) {
    rotateZ += rotateZStep * elapsed;

    translateX += translateXStep * elapsed;

    if (translateX >= 100) {
        translateX = 100;
        translateXStep = -translateXStep;
    } else if (translateX <= 0) {
        translateX = 0;
        translateXStep = -translateXStep;
    }

    renders.forEach(render => {
        rect.transform(
            `rotateZ(${rotateZ}deg)`, 
            `translateX(${translateX}px)`
        );
        render.draw(rect);
    });
}

let lastTime = Date.now();
function tick() {
    requestAnimationFrame(tick);
    const nowTime = Date.now();
    const elapsed = nowTime - lastTime;
    animation(elapsed);
    lastTime = nowTime;
}
tick();

