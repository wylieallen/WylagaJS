export default class KeyListener {
    _pressMap = {};
    _releaseMap = {};
    _actionMap = {};

    bindKeyPress(keyCode, action)
    {
        this._pressMap[keyCode] = action;
    }

    bindKeyRelease(keyCode, action)
    {
        this._releaseMap[keyCode] = action;
    }

    bindAction(action, fn)
    {
        this._actionMap[action] = fn;
    }

    keyPressed(e)
    {
        const fn = this._actionMap[this._pressMap[e.keyCode.toString()]];
        if(fn) fn();
    }

    keyReleased(e)
    {
        const fn = this._actionMap[this._releaseMap[e.keyCode.toString()]];
        if(fn) fn();
    }
}