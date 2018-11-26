export default class KeyboardController {
    _entity;

    upPressed = false;
    downPressed = false;
    leftPressed = false;
    rightPressed = false;
    isFiring = false;
    isBoosting = false;

    constructor(entity) {
        this._entity = entity;
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

    update = () => {
        const dx = KeyboardController.getSign(this.rightPressed, this.leftPressed);
        const dy = KeyboardController.getSign(this.downPressed, this.upPressed);
        this._entity.setTrajectory(dx, dy);
        this._entity.setFiring(this.isFiring);
        this._entity.setBoosting(this.isBoosting);
    }
}