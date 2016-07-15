export default class Engine {
    constructor() {}

    attachElement(el) {
        this.el = el;
    }

    setSize(width, height) {
        this.viewportWidth = width;
        this.viewportHeight = height;
    }
    setClearColor() {}
    draw() {}
}