export default class Displayable {
    _x;
    _y;

    _display;
    update;

    constructor(x, y, onDisplay, onUpdate = () => {}) {
        this.setX(x);
        this.setY(y);
        this._display = onDisplay;
        this.update = onUpdate;
    }

    getX = () => this._x;
    getY = () => this._y;

    setX = (x) => this._x = x;
    setY = (y) => this._y = y;

    translate = (dx, dy) => { this.setX(this.getX() + dx); this.setY(this.getY() + dy); };

    display = (ctx) => {
        ctx.save();
        ctx.translate(this.getX(), this.getY());
        this._display(ctx);
        ctx.restore();
    }
}