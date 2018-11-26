import UnitVector from "../../utils/UnitVector";

export default class Entity {
    _x;
    _y;
    _width;
    _height;
    _dx;
    _dy;
    _velocity;

    constructor(x, y, width, height, velocity)
    {
        this._x = x;
        this._y = y;
        this._dx = 0;
        this._dy = 0;
        this._width = width;
        this._height = height;
        this._velocity = velocity;
    }

    update = () => {
        this._x += this._dx * this._velocity;
        this._y += this._dy * this._velocity;
    };

    setTrajectory = (dx, dy) => {
        const vector = new UnitVector(dx, dy);
        this._dx = vector.getDx();
        this._dy = vector.getDy();
    };

    setLocation = (x, y) => {
        this._x = x;
        this._y = y;
    };

    setVelocity = (velocity) => {
        this._velocity = velocity;
    };

    getDx = () => this._dx;
    getDy = () => this._dy;
    getX = () => this._x;
    getY = () => this._y;
    getWidth = () => this._width;
    getHeight = () => this._height;
}