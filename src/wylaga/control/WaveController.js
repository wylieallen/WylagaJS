export default class WaveController {
    constructor(entity) {
        this._entity = entity;
    }

    update = () => {
        this._entity.setFiring(Math.random() <= 0.15);
        this._entity.setBoosting(Math.random() <= 0.15);
    }
}