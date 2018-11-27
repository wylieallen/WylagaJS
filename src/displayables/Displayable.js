export default class Displayable {
    constructor(x, y, onDisplay, onUpdate = () => {}) {

        this.getX = () => x;
        this.getY = () => y;

        this.setX = _x => x = _x;
        this.setY = _y => y = _y;

        this.translate = (dx, dy) => {
            this.setX(this.getX() + dx);
            this.setY(this.getY() + dy);
        };

        this.display = ctx => {
            ctx.save();
            ctx.translate(this.getX(), this.getY());
            onDisplay(ctx);
            ctx.restore();
        };

        this.update = onUpdate;
    }
}