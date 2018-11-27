export default class UnitVector {
    constructor(x, y)
    {
        const magnitude = Math.sqrt((x * x) + (y * y));
        this._dx = (magnitude ? (x / magnitude) : 0);
        this._dy = (magnitude ? (y / magnitude) : 0);

        this.getDx = () => this._dx;
        this.getDy = () => this._dy;
    }
}