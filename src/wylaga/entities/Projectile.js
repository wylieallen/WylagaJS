import Entity from "./Entity";

export default class Projectile extends Entity {
    _onHit;

    constructor(x, y, width, height, velocity, dx, dy, onHit = () => {})
    {
        super(x, y, width, height, velocity);
        this.setTrajectory(dx, dy);
        this._onHit = onHit;
    }

    hit = ship => this._onHit(ship);
}