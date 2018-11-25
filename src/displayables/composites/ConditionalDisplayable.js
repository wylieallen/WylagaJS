import Displayable from "../Displayable";

export default class ConditionalDisplayable extends Displayable {
    _components = [];
    _activeDisplayable;

    constructor(x, y, defaultDisplayable)
    {
        super(x, y,
            (ctx) => this._activeDisplayable.display(ctx),
            () => {
                for(let i = 0; i < this._components.length; i++)
                {
                    const tuple = this._components[i];
                    if(tuple.condition())
                    {
                        this._activeDisplayable = tuple.displayable;
                        break;
                    }
                }

                this._activeDisplayable.update();
            });

        this._activeDisplayable = defaultDisplayable;
        this.add(() => true, defaultDisplayable);
    }

    add = (condition, displayable) => {
        this._components.unshift({condition, displayable});
    };

    remove = displayable => {

        for(let i = 0; i < this._components.length; i++)
        {
            if(this._components[i].displayable === displayable)
            {
                this._components.splice(i, 1);
                return;
            }
        }
    }
}