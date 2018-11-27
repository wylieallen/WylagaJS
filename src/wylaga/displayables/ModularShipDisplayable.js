import ShipDisplayable from './ShipDisplayable';
import CompositeDisplayable from "../../displayables/composites/CompositeDisplayable";

export default class ModularShipDisplayable extends ShipDisplayable {
    constructor(entity, explode, expire, body, weapon, engine, special) {
        super(entity, new CompositeDisplayable(0, 0), explode, expire, () => this.fire(), () => this.hit(), () => this.specialOn(), () => this.specialOff(), () => this.changeDirection());

        const sprite = this.getSprite();
        sprite.add(body);
        sprite.add(weapon);
        sprite.add(engine);
        sprite.add(special);

        this.hit = () => body.hit();
        this.fire = () => weapon.fire();
        this.specialOn = () => special.activate();
        this.specialOff = () => special.deactivate();
        this.changeDirection = () => engine.changeDirection();

        this.setWeapon = _weapon => {
            sprite.remove(weapon);
            weapon = _weapon;
            sprite.add(weapon);
        };

        this.setBody = _body => {
            sprite.remove(body);
            body = _body;
            sprite.add(body);
        };

        this.setSpecial = _special => {
            sprite.remove(special);
            special = _special;
            sprite.add(special);
        };

        this.setEngine = _engine => {
            sprite.remove(engine);
            engine = _engine;
            sprite.add(engine);
        };

        this.getWeapon = () => weapon;
        this.getBody = () => body;
        this.getSpecial = () => special;
        this.getEngine = () => engine;
    }
}