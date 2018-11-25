import Displayable from "../Displayable";

export default class ImageDisplayable extends Displayable {
    _image;

    constructor(x, y, image, onUpdate = () => {})
    {
        super(x, y, ctx => ctx.drawImage(this.getImage(), 0, 0), onUpdate);
        this.setImage(image);
    }

    getImage = () => this._image;
    setImage = image => this._image = image;
}