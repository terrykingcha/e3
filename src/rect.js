import {
    translateAxis,
    rgba2glColor
} from './util'
import Element from './element';
import mat4 from 'gl-mat4';
import vec3 from 'gl-vec3';
import unproject from 'camera-unproject';
import css2matrix from 'css-transform-to-mat4';

export default class Rect extends Element {
    constructor(options) {
        super(options);

        this.options = options;
        this.transformMatrix = mat4.create();
        mat4.identity(this.transformMatrix, this.transformMatrix); 

        const [x, y, z] = options.position;
        this.points = [
            [x, y, z], // top-left
            [x + options.width, y, z], // top-right
            [x + options.width, y - options.height, z], // bottom-right
            [x, y - options.height, z] // bottom-left
        ];

        if (typeof options.color === 'string') {
            options.color = rgba2glColor(options.color);
        }

        this.length = 4;
    }

    transform(...styles) {
        this.transformMatrix = css2matrix(styles.join(' '));
    }

    getVertices(projView, modelView, width, height) {
        const invertProjView = mat4.invert(
            [], 
            mat4.multiply([], projView, modelView)
        );
        const viewport = [0, 0, width, height];

        let vertices = [];

        const points = [
            this.points[0], // top-left
            this.points[1], // top-right
            this.points[3], // bottom-left
            this.points[2]  // bottom-right
        ]

        points.forEach(point => {
            const vertex = [];
            point = vec3.transformMat4([], point, this.transformMatrix);
            const [x, y, z] = translateAxis(point, width, height);
            unproject(vertex, [x, y, 0], viewport, invertProjView);
            vertices = [...vertices, ...vertex];
        })

        return vertices;
    }

    getColors() {
        return [
            ...this.options.color,
            ...this.options.color,
            ...this.options.color,
            ...this.options.color
        ];
    }
}
