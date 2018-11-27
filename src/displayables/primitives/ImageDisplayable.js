import Displayable from "../Displayable";

export default class ImageDisplayable extends Displayable {
    constructor(x, y, image, onUpdate = () => {})
    {
        super(x, y, ctx => ctx.drawImage(this.getImage(), 0, 0), onUpdate);
        this.setImage = _image => image = _image;
        this.getImage = () => image;
    }
}