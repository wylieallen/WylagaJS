export default class WaveController {
    constructor(entities, maxX, maxY) {
        this._entities = entities;
        this._minX = this._minY = 0;
        this._maxX = maxX;
        this._maxY = maxY / 2;
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

        const x = entity.getX(), y = entity.getY();

        if(x <= this._minX || x >= (this._maxX - entity.getWidth()) || y <= this._minY || y >= (this._maxY - entity.getHeight()))
        {
            let dx, dy;

            if(x <= this._minX)
            {
                dx = 1;
            }
            else if(x >= (this._maxX - entity.getWidth()))
            {
                dx = -1;
            }
            else
            {
                dx = entity.getDx();
            }

            if(y <= this._minY)
            {
                dy = 1;
            }
            else if(y >= (this._maxY - entity.getHeight()))
            {
                dy = -1;
            }
            else
            {
                dy = entity.getDy();
            }

            entity.setTrajectory(dx, dy);
        }
        else if(Math.random() <= 0.05)
        {
            entity.setTrajectory((Math.random() * 2) - 1, (Math.random() * 2) - 1);
        }
    };
}