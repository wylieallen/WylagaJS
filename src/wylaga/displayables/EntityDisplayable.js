export default class EntityDisplayable {
    constructor(entity, sprite, explode, expire)
    {
        this.getX = entity.getX;
        this.getY = entity.getY;

        this.explode = explode;
        this.expire = expire;

        this.setSprite = _sprite => sprite = _sprite;
        this.getSprite = () => sprite;
        this.getEntity = () => entity;

        this.update = () => sprite.update();
        this.display = ctx => {
            ctx.save();
            ctx.translate(this.getX(), this.getY());
            sprite.display(ctx);
            ctx.restore();
        }
    }
}