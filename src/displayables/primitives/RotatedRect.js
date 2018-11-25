export default class RotatedRect
{
    constructor(entity, width, height, rotation, color)
    {
        this.entity = entity;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.color = color;
    }

    update = () => {};

    display = ctx => {
        ctx.save();
        ctx.translate(this.entity.getX(), this.entity.getY());
        ctx.translate(this.width / 2, this.height / 2);
        ctx.rotate(this.rotation);
        ctx.translate(-this.width / 2, -this.height / 2);
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
    };
}