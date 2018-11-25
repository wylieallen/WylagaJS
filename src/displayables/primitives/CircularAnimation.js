import LinearAnimation from "./LinearAnimation";

export default class CircularAnimation extends LinearAnimation {

    constructor(x, y, frames, interval, onUpdate = () => {}) {
        super(x, y, frames, interval,
            () => this._index = 0,
            onUpdate
        );
    }
}