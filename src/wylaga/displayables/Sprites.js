import * as Images from "../../sprites/Images"
import ImageDisplayable from "../../displayables/primitives/ImageDisplayable";
import CompositeDisplayable from "../../displayables/composites/CompositeDisplayable";
import UnitVector from "../../utils/UnitVector";
import SolidRect from "../../displayables/primitives/SolidRect";
import CircularAnimation from "../../displayables/primitives/CircularAnimation";
import ModularShipDisplayable from "./ModularShipDisplayable";
import EntityDisplayable from "./EntityDisplayable";


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

export function makeSmallEnemyProjectile(projectile, onExpire) {
    const sprite = new SolidRect(0, 0, projectile.getWidth(), projectile.getHeight(), '#0F0');
    const explosion = makeNewExplosion(projectile, 50, "#0F0", 70, onExpire);
    const explode = function() {
        explosion.centerOn(projectile);
        this.setSprite(explosion);
    };
    const displayable = new EntityDisplayable(projectile, sprite, explode, onExpire);

    return displayable;
}

export function makeBigEnemyProjectile(projectile, onExpire) {
    const sprite = new SolidRect(0, 0, projectile.getWidth(), projectile.getHeight(), '#0F0');
    const explosion = makeNewExplosion(projectile, 50, "#0F0", 70, onExpire);
    const explode = function() {
        explosion.centerOn(projectile);
        this.setSprite(explosion);
    };
    const displayable = new EntityDisplayable(projectile, sprite, explode, onExpire);

    return displayable;
}

export function makeProjectileDisplayable(projectile, onExpire) {
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

function makeBigEnemyExplosion(entity, onExpire) {
    return makeNewExplosion(entity, 100, "#0f0", 100, onExpire);
}

function makeSmallEnemyExplosion(entity, onExpire) {
    return makeNewExplosion(entity, 70, "#0f0", 80, onExpire);
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
   return makeModularSpecialDisplayable(entity, 7, 24, Images.PLAYER_SPECIAL_BASE, Images.PLAYER_SPECIAL_DEPLOYED);
}

function makeModularSpecialDisplayable(entity, x, y, base, deployed) {
    const displayable = new ImageDisplayable(x, y, base);

    displayable.activate = () => displayable.setImage(deployed);
    displayable.deactivate = () => displayable.setImage(base);

    return displayable;
}

function makeNewPlayerBodyDisplayable(entity) {
    return makeModularBodyDisplayable(
        entity, Images.PLAYER_CHASSIS_BASE, Images.PLAYER_CHASSIS_HURT, Images.PLAYER_CHASSIS_DIRE, 20
    );
}

function makeModularBodyDisplayable(entity, baseImage, hurtImage, direImage, direThreshold = 20, duration = 3) {
    const displayable = new ImageDisplayable(0, 0, baseImage);

    displayable.hit = () => {
        let counter = duration;
        displayable.setImage(hurtImage);
        displayable.update = () => {
            if(--counter <= 0) {
                if(entity.getHealth() <= direThreshold) {
                    displayable.setImage(direImage);
                } else {
                    displayable.setImage(baseImage);
                }
            }
        }
    };

    return displayable;
}

function makeNewPlayerEngineDisplayable(entity) {
    const down = new ImageDisplayable(0, 0, Images.PLAYER_ENGINE_BRAKE);
    const neutral = new CircularAnimation(0, 0, [Images.PLAYER_ENGINE_BASE_1, Images.PLAYER_ENGINE_BASE_2], 40);
    const up = new CircularAnimation(0, 0, [Images.PLAYER_ENGINE_BOOST_1, Images.PLAYER_ENGINE_BOOST_2], 10);
    return makeModularEngineDisplayable(entity, 12, 35, up, down, neutral);
}

function makeModularEngineDisplayable(entity, x , y, up, down, neutral) {
    const root = new CompositeDisplayable(x, y);

    root.add(neutral);

    root.changeDirection = () => {
        const dy = entity.getDy();

        root.clear();

        if(dy < 0) {
            root.add(up);
        } else if(dy > 0) {
            root.add(down);
        } else {
            root.add(neutral);
        }
    };

    return root;
}

function makeNewPlayerWeaponDisplayable(entity) {
    return makeModularWeaponDisplayable(entity, 22, 0, Images.PLAYER_WEAPON_BASE, Images.PLAYER_WEAPON_FIRE);
}

function makeModularWeaponDisplayable(entity, x, y, baseImage, firingImage, duration = 3) {
    const displayable = new ImageDisplayable(x, y, baseImage);

    displayable.fire = () => {
        let counter = 3;
        displayable.setImage(firingImage);
        displayable.update = () => {
            if(--counter <= 0) {
                displayable.setImage(baseImage);
                displayable.update = () => {};
            }
        }
    };

    return displayable;
}

export function makeModularEnemyDisplayable(entity, onExpire) {
    const explosion = makeSmallEnemyExplosion(entity, onExpire);
    const explode = function() {
        explosion.centerOn(entity);
        this.setSprite(explosion);
    };

    const body = makeEnemyBodyDisplayable(entity);
    const weapon = makeEnemyWeaponDisplayable(entity);
    const engine = makeEnemyEngineDisplayable(entity);
    const special = makeEnemySpecialDisplayable(entity);

    return new ModularShipDisplayable(entity, explode, onExpire, body, weapon, engine, special);
}

function makeEnemyBodyDisplayable(entity) {
    return makeModularBodyDisplayable(entity, Images.ENEMY_CHASSIS_BASE, Images.ENEMY_CHASSIS_HURT, Images.ENEMY_CHASSIS_DIRE);
}

function makeEnemyWeaponDisplayable(entity) {
    return makeModularWeaponDisplayable(entity, 6, 22, Images.ENEMY_WEAPON_BASE, Images.ENEMY_WEAPON_FIRE);
}

function makeEnemyEngineDisplayable(entity) {
    const up = new ImageDisplayable(0, 0, Images.ENEMY_ENGINE_BASE);
    const down = new ImageDisplayable(0, 0, Images.ENEMY_ENGINE_BOOST);
    return makeModularEngineDisplayable(entity, 7, 0, up, down, up);
}

function makeEnemySpecialDisplayable(entity) {
    return makeModularSpecialDisplayable(entity, 3, 4, Images.ENEMY_SPECIAL_BASE, Images.ENEMY_SPECIAL_DEPLOYED);
}

export function makeNewBigEnemyDisplayable(entity, onExpire) {
    const explosion = makeBigEnemyExplosion(entity, onExpire);
    const explode = function() {
        explosion.centerOn(entity);
        this.setSprite(explosion);
    };

    const chassis = makeBigEnemyChassis(entity);
    const special = makeBigEnemySpecial(entity);
    const engine = makeBigEnemyEngine(entity);
    const weapon = makeBigEnemyWeapon(entity);

    return new ModularShipDisplayable(entity, explode, onExpire, chassis, weapon, engine, special);
}

function makeBigEnemyChassis(entity) {
    return makeModularBodyDisplayable(entity, Images.BIG_ENEMY_CHASSIS_BASE, Images.BIG_ENEMY_CHASSIS_HURT, Images.BIG_ENEMY_CHASSIS_DIRE);
}

function makeBigEnemySpecial(entity) {
    return makeModularSpecialDisplayable(entity, 0, 0, Images.BIG_ENEMY_SPECIAL_BASE, Images.BIG_ENEMY_SPECIAL_DEPLOYED);
}

function makeBigEnemyEngine(entity) {
    const up = makeImageDisplayable(Images.BIG_ENEMY_ENGINE_BRAKE);
    const down = new CircularAnimation(0, 0, [Images.BIG_ENEMY_ENGINE_BOOST, Images.BIG_ENEMY_ENGINE_BOOST_2], 10);
    const neutral = new CircularAnimation(0, 0, [Images.BIG_ENEMY_ENGINE_BASE, Images.BIG_ENEMY_ENGINE_BASE_2], 40);
    return makeModularEngineDisplayable(entity, 0, 0, up, down, neutral);
}

function makeBigEnemyWeapon(entity) {
    return makeModularWeaponDisplayable(entity, 0, 0, Images.BIG_ENEMY_WEAPON_BASE, Images.BIG_ENEMY_WEAPON_FIRING);
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