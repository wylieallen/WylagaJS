export default class KeyboardController {
    upPressed = false;
    downPressed = false;
    leftPressed = false;
    rightPressed = false;
    isFiring = false;
    isBoosting = false;

    constructor(entity) {
        this.update = () => {
            entity.setTrajectory(
                KeyboardController.getSign(this.rightPressed, this.leftPressed),
                KeyboardController.getSign(this.downPressed, this.upPressed)
            );
            entity.setFiring(this.isFiring);
            entity.setBoosting(this.isBoosting);
        }
    }

    static getSign = (pos, neg) =>
    {
        if(pos === neg) // positive XNOR negative
        {
            return 0;
        }
        else if (pos)
        {
            return 1;
        }
        else // if (negative)
        {
            return -1;
        }
    };
}