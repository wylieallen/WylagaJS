export default class UnitVector {
    _dx;
    _dy;

    constructor(x, y)
    {
        const magnitude = Math.sqrt((x * x) + (y * y));
        if(magnitude)
        {
            this._dx = x / magnitude;
            this._dy = y / magnitude;
        }
        else
        {
            this._dx = this._dy = 0;
        }
    }

    getDx = () => this._dx;
    getDy = () => this._dy;
}