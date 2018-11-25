import EntityDisplayable from './EntityDisplayable';

export default class ShipDisplayable extends EntityDisplayable {
    constructor(entity, sprite, explode, expire, fire, hit, specialOn, specialOff, onDirectionChange)
    {
        super(entity, sprite, explode, expire);
        this.hit = hit;
        this.fire = fire;
        this.specialOn = specialOn;
        this.specialOff = specialOff;
        this.changeDirection = onDirectionChange;

        const innerDamage = entity.damage;
        entity.damage = damage => {
            innerDamage(damage);
            this.hit();
        };

        const innerFire = entity.onFire;
        entity.onFire = (x, y) => {
            innerFire(x, y);
            this.fire();
        };

        const innerSetBoosting = entity.setBoosting;
        entity.setBoosting = value => {
            innerSetBoosting(value);
            if(value)
            {
                this.specialOn();
            }
            else
            {
                this.specialOff();
            }
        };

        const innerSetTrajectory = entity.setTrajectory;
        entity.setTrajectory = (dx, dy) => {
            innerSetTrajectory(dx, dy);
            this.changeDirection();
        };
    }

}