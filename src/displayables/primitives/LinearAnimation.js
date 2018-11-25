import Displayable from "../Displayable";

export default class LinearAnimation extends Displayable {

    _index;
    _counter;
    _frames;

    constructor(x, y, frames, interval, onConclusion, onUpdate = () => {})
    {
        super(x, y,
            (ctx) => ctx.drawImage(this.getCurrentFrame(), 0, 0),
            () =>
            {
                onUpdate();
                if(++this._counter >= interval) {
                    this._counter = 0;
                    if(++this._index >= frames.length) {
                        onConclusion();
                    }
                }
            }
        );
        this._counter = 0;
        this._frames = frames;
        this._index = 0;
    }

    getCurrentFrame = () => this._frames[this._index];
}