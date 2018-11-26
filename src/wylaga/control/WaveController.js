export default class WaveController {
    constructor(entities) {
        this._entities = entities;
    }

    update = () => {
        this._entities.forEach(e => this.updateEntity(e));
    };

    updateEntity = entity => {
        entity.setFiring(Math.random() <= 0.01);

        if(Math.random() <= 0.02)
        {
            entity.setBoosting(!entity.isBoosting);
        }

        if(Math.random() <= 0.05)
        {
            entity.setTrajectory((Math.random() * 2) - 1, (Math.random() * 2) - 1);
        }
    };
}