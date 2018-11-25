import * as Images from "../../sprites/Images"
import ImageDisplayable from "../../displayables/primitives/ImageDisplayable";
import CompositeDisplayable from "../../displayables/composites/CompositeDisplayable";
import UnitVector from "../../utils/UnitVector";
import SolidRect from "../../displayables/primitives/SolidRect";
import CircularAnimation from "../../displayables/primitives/CircularAnimation";
import LinearAnimation from "../../displayables/primitives/LinearAnimation";
import ModularShipDisplayable from "./ModularShipDisplayable";
import EntityDisplayable from "./EntityDisplayable";
import ShipDisplayable from "./ShipDisplayable";


export function makeModularPlayerDisplayable(entity, onExpire) {
    const weapon = makeNewPlayerWeaponDisplayable(entity);
    const body = makeNewPlayerBodyDisplayable(entity);
    const engine = makeNewPlayerEngineDisplayable(entity);
    const special = makeNewPlayerSpecialDisplayable(entity);

    const explosion = makeNewPlayerExplosion(entity, onExpire);

    const explode = function() {
        explosion.centerOn(entity);
        this.setSprite(explosion);
    };

    return new ModularShipDisplayable(entity, explode, onExpire, body, weapon, engine, special);
}

export function makeProjectileDisplayable(projectile, onExpire){
    const sprite = new SolidRect(0, 0,
        projectile.getWidth(), projectile.getHeight(), '#FF0000');

    const explosion = makeNewExplosion(projectile, 50, "#f00", 70, onExpire);

    const explode = function() {
        explosion.centerOn(projectile);
        this.setSprite(explosion);
    };

    const displayable = new EntityDisplayable(projectile, sprite, explode, onExpire);

    return displayable;
}

function makeNewPlayerExplosion(entity, onExpire) {
    return makeNewExplosion(entity, 100, "#f00", 100, onExpire);
}

function makeNewExplosion(entity, radius, color, particleCount, onExpire) {
    const explosion = makeExplosion(radius, color, particleCount, onExpire);
    explosion.centerOn = () => {
        explosion.setX((entity.getWidth() / 2) - explosion.radius);
        explosion.setY((entity.getHeight() / 2) - explosion.radius);
    };

    return explosion;
}

function makeNewPlayerSpecialDisplayable(entity) {
    const displayable = new ImageDisplayable(7, 24, Images.PLAYER_SPECIAL_BASE);

    displayable.activate = () => displayable.setImage(Images.PLAYER_SPECIAL_DEPLOYED);
    displayable.deactivate = () => displayable.setImage(Images.PLAYER_SPECIAL_BASE);

    return displayable;
}

function makeNewPlayerBodyDisplayable(entity) {
    const displayable = new ImageDisplayable(0, 0, Images.PLAYER_CHASSIS_BASE);

    displayable.hit = () => {
        let counter = 3;
        displayable.setImage(Images.PLAYER_CHASSIS_HURT);
        displayable.update = () => {
            if(--counter <= 0) {
                if(entity.getHealth() <= 20)
                {
                    displayable.setImage(Images.PLAYER_CHASSIS_DIRE);
                }
                else
                {
                    displayable.setImage(Images.PLAYER_CHASSIS_BASE);
                }
            }
        }
    };

    return displayable;
}

function makeNewPlayerEngineDisplayable(entity) {

    const root = new CompositeDisplayable(12, 35);

    const downAnimation = new ImageDisplayable(0, 0, Images.PLAYER_ENGINE_BRAKE);
    const neutralAnimation = new CircularAnimation(0, 0, [Images.PLAYER_ENGINE_BASE_1, Images.PLAYER_ENGINE_BASE_2], 40);
    const upAnimation = new CircularAnimation(0, 0, [Images.PLAYER_ENGINE_BOOST_1, Images.PLAYER_ENGINE_BOOST_2], 10);

    root.add(neutralAnimation);

    root.changeDirection = () => {
        const dy = entity.getDy();

        root.clear();

        if(dy < 0)
        {
            root.add(upAnimation);
        }
        else if(dy > 0)
        {
            root.add(downAnimation);
        }
        else
        {
            root.add(neutralAnimation);
        }
    };

    return root;
}

function makeNewPlayerWeaponDisplayable(entity) {
    const displayable = new ImageDisplayable(22, 0, Images.PLAYER_WEAPON_BASE);

    displayable.fire = () => {
        const prev = displayable.getImage();
        let counter = 3;
        displayable.setImage(Images.PLAYER_WEAPON_FIRE);
        displayable.update = () => {
            if(--counter <= 0)
            {
                displayable.setImage(prev);
                displayable.update = () => {};
            }
        }
    };

    return displayable;
}

export function makeNewEnemyDisplayable(entity, onExpire) {
    const explosion = makeNewPlayerExplosion(entity, onExpire);
    const explode = function() {
        explosion.centerOn(entity);
        this.setSprite(explosion);
    };

    const displayable = new ShipDisplayable(entity, makeImageDisplayable(Images.enemy), explode, onExpire,
        () => {},
        () =>
        {
            displayable.setSprite(new LinearAnimation(0,0, [Images.hurtEnemy], 3,
                () => displayable.setSprite(makeImageDisplayable(Images.enemy))));
        },
        ()=>{},
        ()=>{},
        ()=>{});

    return displayable;
}

export function makeNewBigEnemyDisplayable(entity, onExpire) {
    const explosion = makeNewPlayerExplosion(entity, onExpire);
    const explode = function() {
        explosion.centerOn(entity);
        this.setSprite(explosion);
    };
    const displayable = new ShipDisplayable(entity, makeImageDisplayable(Images.BIG_ENEMY_BASE), explode, onExpire,
        () => {},
        () => {
            displayable.setSprite(new LinearAnimation(0, 0, [Images.BIG_ENEMY_HURT], 3,
                () => displayable.setSprite(makeImageDisplayable(Images.BIG_ENEMY_BASE))));
        },
        () => {},
        () => {},
        () => {});

    return displayable;
}

class Particle extends SolidRect {
    constructor(x, y, size, color, lifespan, velocity, trajectory, onExpire)
    {
        super(x, y, size, size, color);
        this._lifespan = lifespan;
        this._dx = trajectory.getDx() * velocity;
        this._dy = trajectory.getDy() * velocity;
        this._onExpire = onExpire;
    }

    update = () => {
        if(this._lifespan <= 0) {
            this._onExpire();
        }
        else {
            this.translate(this._dx, this._dy);
        }
        --this._lifespan;
    }
}

class Explosion extends CompositeDisplayable {
    constructor(radius, color, particleCount, onExpire)
    {
        super(0, 0);

        this.radius = radius;

        let _expiredParticles = [];

        const pushExpiredParticle = function() {
            _expiredParticles.push(this);
        };

        for(let i = 0; i < particleCount; i++)
        {
            const speed = 4 + (Math.random() * 12);
            const trajectory = new UnitVector((Math.random() * 720) - 360, (Math.random() * 720) - 360);
            const lifespan = radius / speed;

            const particle = new Particle(radius, radius, 2, color, lifespan, speed, trajectory, pushExpiredParticle);

            this.add(particle);
        }

        const superUpdate = this.update;
        this.update = () => {
            superUpdate();
            _expiredParticles.forEach(p => this.remove(p));
            _expiredParticles = [];
            if(this.size() === 0)
            {
                onExpire();
            }
        };
    }
}

export function makeExplosion(radius, color, particleCount, onExpire) {
    return new Explosion(radius, color, particleCount, onExpire);
}

function makeImageDisplayable(image, update = () => {}) {
    return new ImageDisplayable(0, 0, image, update);
}