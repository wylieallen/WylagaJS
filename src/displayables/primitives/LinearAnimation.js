import Displayable from "../Displayable";

export default class LinearAnimation extends Displayable {

    constructor(x, y, frames, interval, onConclusion, onUpdate = () => {})
    {
        let counter = 0, index = 0;

        super(x, y,
            (ctx) => ctx.drawImage(this.getCurrentFrame(), 0, 0),
            () =>
            {
                onUpdate();
                if(++counter >= interval) {
                    counter = 0;
                    if(index + 1 >= frames.length) {
                        onConclusion();
                    }
                    else ++index;
                }
            }
        );

        this.reset = () => {index = counter = 0};
        this.getCurrentFrame = () => frames[index];
    }

}