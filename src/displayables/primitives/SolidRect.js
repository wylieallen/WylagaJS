import Displayable from "../Displayable";

export default class SolidRect extends Displayable {
    _color;
    _width;
    _height;

    constructor(x, y, width, height, color, onUpdate = () => {}) {
        super(x, y,
            (ctx) => {
                ctx.fillStyle = this.getColor();
                ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
            },
            onUpdate);
        this._color = color;
        this._width = width;
        this._height = height;
    }

    getColor = () => this._color;
    getWidth = () => this._width;
    getHeight = () => this._height;
}