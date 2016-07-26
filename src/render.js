import {
    rgba2glColor,
    deg2rad
} from './util';
import Engine from './engine';
import WebGLEngine from './webgl';
import Canvas2DEngine from './canvas2d';
import CSS3DEngine from './css3d';
import SVGEngine from './svg';
import Rect from './rect';
import mat4 from 'gl-mat4';

const Engines = {
    'webgl': WebGLEngine,
    'canvas': Canvas2DEngine,
    'css': CSS3DEngine,
    'svg': SVGEngine
};

export default class Render {
    constructor(element, some) {
        let engine;
        if (typeof some === 'string'
                && Engines[some]) {
            engine = new Engines[some]();
        } else if (some instanceof Engine) {
            engine = some;
        }

        if (engine == null) {
            throw new Error(`invalid engine "${some}"`);
        }

        const {width, height} = element.getBoundingClientRect();
        this.viewportWidth = width;
        this.viewportHeight = height;
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
}

