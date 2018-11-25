import ShipDisplayable from './ShipDisplayable';
import CompositeDisplayable from "../../displayables/composites/CompositeDisplayable";

export default class ModularShipDisplayable extends ShipDisplayable {
    _weapon;
    _body;
    _engine;
    _special;

    constructor(entity, explode, expire, body, weapon, engine, special) {
        super(entity, new CompositeDisplayable(0, 0), explode, expire, () => this.fire(), () => this.hit(), () => this.specialOn(), () => this.specialOff(), () => this.changeDirection());
        const sprite = this.getSprite();
        sprite.add(body);
        sprite.add(weapon);
        sprite.add(engine);
        sprite.add(special);

        this._body = body;
        this._weapon = weapon;
        this._engine = engine;
        this._special = special;
    }

    hit = () => {
        this._body.hit();
    };

    fire = () => {
        this._weapon.fire();
    };

    specialOn = () => {
        this._special.activate();
    };

    specialOff = () => {
        this._special.deactivate();
    };

    changeDirection = () => {
        this._engine.changeDirection();
    };

    setWeapon = weapon => {
        this.getSprite().remove(this._weapon);
        this._weapon = weapon;
        this.getSprite().add(this._weapon);
    };

    setBody = body => {
        this.getSprite().remove(this._body);
        this._body = body;
        this.getSprite().add(this._body);
    };

    setEngine = engine => {
        this.getSprite().remove(this._engine);
        this._engine = engine;
        this.getSprite().add(this._engine);
    };

    setSpecial = special => {
        this.getSprite().remove(this._special);
        this._special = special;
        this.getSprite().add(this._special);
    };

    getWeapon = () => this._weapon;
    getBody = () => this._body;
    getEngine = () => this._engine;
    getSpecial = () => this._special;
}