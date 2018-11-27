export default class KeyListener {

    constructor() {

        const pressMap = {},
            releaseMap = {},
            actionMap = {};

        this.bindKeyPress = (keyCode, action) => {
            pressMap[keyCode] = action;
        };

        this.bindKeyRelease = (keyCode, action) => {
            releaseMap[keyCode] = action;
        };

        this.bindAction = (action, fn) => {
            actionMap[action] = fn;
        };

        this.keyPressed = e => {
            const fn = actionMap[pressMap[e.keyCode.toString()]];
            if(fn) { fn(); }
        };

        this.keyReleased = e => {
            const fn = actionMap[releaseMap[e.keyCode.toString()]];
            if(fn) { fn(); }
        }
    }
}