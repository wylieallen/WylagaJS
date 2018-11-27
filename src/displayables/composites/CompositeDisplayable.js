import Displayable from "../Displayable";

export default class CompositeDisplayable extends Displayable {
    constructor(x, y) {
        const components = new Set();

        super(x, y,
            (ctx) => components.forEach(d => d.display(ctx)),
            () => components.forEach(d => d.update()));

        this.add = components.add.bind(components);
        this.remove = components.delete.bind(components);
        this.size = () => components.size;
        this.clear = components.clear.bind(components);
    }
}