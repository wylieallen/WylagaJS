import Displayable from "../Displayable";

export default class TextDisplayable extends Displayable {

    constructor(x, y, color, getString, font = "16px Arial", onUpdate = () => {})
    {
        super(
            x, y,
            ctx => {
                ctx.fillStyle = this.getColor();
                ctx.font = font;
                ctx.fillText(this.getString(), 0, 0);
                },
            onUpdate
        );
        this.getColor = () => color;
        this.getString = getString;
    }
}