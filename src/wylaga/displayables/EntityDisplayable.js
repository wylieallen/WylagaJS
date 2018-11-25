export default class EntityDisplayable {
    _entity;
    _sprite;

    constructor(entity, sprite, explode, expire)
    {
        this._entity = entity;
        this._sprite = sprite;

        this.getX = this._entity.getX;
        this.getY = this._entity.getY;

        this.explode = explode;
        this.expire = expire;
    }

    update = () => {
        this._sprite.update();
    };

    setSprite = sprite => this._sprite = sprite;
    getSprite = () => this._sprite;

    getEntity = () => this._entity;

    display = ctx => {
        ctx.save();
        ctx.translate(this.getX(), this.getY());
        this._sprite.display(ctx);
        ctx.restore();
    };
}