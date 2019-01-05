export default class HostileController {
    constructor(entity, maxX, maxY) {
        const minX = 0, minY = 0;
        maxY /= 2;

        const drunkenEntity = entity => {
            entity.setFiring(Math.random() <= 0.01);

            if (Math.random() <= 0.02) {
                entity.setBoosting(!entity.isBoosting);
            }

            const x = entity.getX(), y = entity.getY();

            if (x <= minX || x >= (maxX - entity.getWidth())
                || y <= minY || y >= (maxY - entity.getHeight())) {
                let dx, dy;

                if (x <= minX) {
                    dx = 1;
                }
                else if (x >= (maxX - entity.getWidth())) {
                    dx = -1;
                }
                else {
                    dx = entity.getDx();
                }

                if (y <= minY) {
                    dy = 1;
                }
                else if (y >= (maxY - entity.getHeight())) {
                    dy = -1;
                }
                else {
                    dy = entity.getDy();
                }

                entity.setTrajectory(dx, dy);
            }
            else if (Math.random() <= 0.05) {
                entity.setTrajectory((Math.random() * 2) - 1, (Math.random() * 2) - 1);
            }
        };

        const quarterY = maxY / 2;

        const rallyEntity = (entity) => {

            if(entity.getY() >= quarterY) {
                entity.setBoosting(false);
                entity.setTrajectory((Math.random() * 2) - 1, (Math.random() * 2) - 1);
                updateEntity = drunkenEntity;
            } else {
                entity.setBoosting(true);
                entity.setTrajectory(0, 1);
            }
        };

        let updateEntity = rallyEntity;

        this.update = () => {
            updateEntity(entity);
        };
    }
}

