export default class WaveController {
    constructor(entities) {
        this._entities = entities;
        this._isBoosting = false;
    }

    update = () => {
        this._entities.forEach(e => this.updateEntity(e));
    };

    updateEntity = entity => {
        entity.setFiring(Math.random() <= 0.01);
        entity.setBoosting(this._isBoosting);

        if(Math.random() <= 0.05)
        {
            this._isBoosting = !this._isBoosting;
        }

        if(Math.random() <= 0.05)
        {
            entity.setTrajectory((Math.random() * 2) - 1, (Math.random() * 2) - 1);
        }
    };
}