import Entity from "./Entity";

export default class Projectile extends Entity {
    constructor(x, y, width, height, velocity, dx, dy, onHit = () => {})
    {
        super(x, y, width, height, velocity);
        this.setTrajectory(dx, dy);
        this.hit = onHit;
    }
}