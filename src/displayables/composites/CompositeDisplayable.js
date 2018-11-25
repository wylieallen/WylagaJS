import Displayable from "../Displayable";

export default class CompositeDisplayable extends Displayable {
    _components;

    constructor(x, y) {
        super(x, y,
            (ctx) => this._components.forEach(d => d.display(ctx)),
            () => this._components.forEach(d => d.update()));
        this._components = new Set();
    }

    add = (d) => this._components.add(d);
    remove = (d) => this._components.delete(d);
    size = () => this._components.size;
    clear = () => this._components.clear();
}