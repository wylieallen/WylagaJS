import Displayable from "../Displayable";

export default class SolidRect extends Displayable {
    constructor(x, y, width, height, color, onUpdate = () => {}) {
        super(x, y,
            (ctx) => {
                ctx.fillStyle = this.getColor();
                ctx.fillRect(0, 0, this.getWidth(), this.getHeight());
            },
            onUpdate);

        this.getColor = () => color;
        this.getWidth = () => width;
        this.getHeight = () => height;
    }
}