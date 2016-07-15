import Engine from './engine';
import getWebGLContext from 'webgl-context';
import mat4 from 'gl-mat4';
import clearColor from 'gl-clear';
import initShader from 'gl-shader';
import initBuffer from 'gl-buffer';

const basicVertex = `
precision mediump float;

attribute vec3 aPosition;
attribute vec4 aColor;

uniform mat4 uElement;
uniform mat4 uProjection;
uniform mat4 uTransform;

varying vec4 vColor;

void main() {
  gl_Position = uProjection * uElement * (vec4(aPosition, 1.0) * uTransform);
  vColor = aColor;
}
`;

const basicFragment = `
precision mediump float;

varying vec4 vColor;

void main() {
  gl_FragColor = vec4(vColor);
}

`;

const basicShader = gl

export default class WebGLEngine extends Engine {
    constructor() {
        super();
    }

    attachElement(...args) {
        super.attachElement(...args);
        this.gl = getWebGLContext({
            canvas: this.el
        });
        const shader = initShader(this.gl, basicVertex, basicFragment);
        shader.attributes.aPosition.location = 0
        shader.attributes.aColor.location = 1
        this.basicShader = shader;
    }

    setSize(width, height) {
        super.setSize(width, height);
        this.gl.canvas.width = width;
        this.gl.canvas.height = height
    }

    setClearColor(rgba) {
        this.clear = clearColor({
            color: rgba
        });
    }

    draw(el) {
        this.clear(this.gl);
        this.gl.viewport(0, 0, this.viewportWidth, this.viewportHeight);

        const projectionMatrix = mat4.create();
        const elementMatrix = mat4.create();
        const {transformMatrix} = el;

        mat4.perspective(projectionMatrix, Math.PI / 4, this.viewportWidth / this.viewportHeight, 0.01, 100)
        mat4.identity(elementMatrix, elementMatrix);

        this.basicShader.bind();
        this.basicShader.uniforms.uProjection = projectionMatrix;
        this.basicShader.uniforms.uElement = elementMatrix;
        this.basicShader.uniforms.uTransform = transformMatrix;

        const vertices = initBuffer(this.gl, 
            new Float32Array(el.getVertices(projectionMatrix, elementMatrix, this.viewportWidth, this.viewportHeight)));
        const colors = initBuffer(this.gl, 
            new Float32Array(el.getColors()));

        vertices.bind();
        this.basicShader.attributes.aPosition.pointer();
        colors.bind();
        this.basicShader.attributes.aColor.pointer();

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, el.length);

    }
}