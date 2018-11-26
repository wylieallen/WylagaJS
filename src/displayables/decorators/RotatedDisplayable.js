export default class RotatedDisplayable {
    _x;
    _y;
    _radians;
    _target;
    _aboutX;
    _aboutY;

    constructor(x, y, aboutX, aboutY, radians, target, onUpdate)
    {
        this._x = x;
        this._y = y;
        this._aboutX = aboutX;
        this._aboutY = aboutY;
        this._radians = radians;
        this._target = target;
        if(onUpdate)
        {
            this.update = () => {
                onUpdate();
                this._target.update();
            };
        }
        else
        {
            this.update = () => this._target.update();
        }
    }

    getX = () => this._x;
    getY = () => this._y;

    getRads = () => this._radians;
    setRads = radians => this._radians = radians;

    setTarget = target => this._target = target;

    display = ctx => {
        ctx.save();
        ctx.translate(this._aboutX, this._aboutY);
        ctx.rotate(this.getRads());
        ctx.translate(-this._aboutX, -this._aboutY);
        ctx.translate(this.getX(), this.getY());
        target.display(ctx);
        ctx.restore();
    };
}