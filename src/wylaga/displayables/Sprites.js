import * as Images from "../../sprites/Images"
import ImageDisplayable from "../../displayables/primitives/ImageDisplayable";
import ConditionalDisplayable from "../../displayables/composites/ConditionalDisplayable";
import CompositeDisplayable from "../../displayables/composites/CompositeDisplayable";
import UnitVector from "../../utils/UnitVector";
import SolidRect from "../../displayables/primitives/SolidRect";
import CircularAnimation from "../../displayables/primitives/CircularAnimation";

export function makePlayerDisplayable(entity) {
    const displayable = new CompositeDisplayable(0, 0);

    displayable.add(makePlayerChassisDisplayable(entity));
    displayable.add(makePlayerSpecialDisplayable(entity));
    displayable.add(makePlayerEngineDisplayable(entity));
    displayable.add(makePlayerWeaponDisplayable(entity));

    displayable.getX = entity.getX;
    displayable.getY = entity.getY;

    return displayable;
}

function makePlayerWeaponDisplayable(entity) {
    const weapon = new ConditionalDisplayable(22, 0, makeImageDisplayable(Images.PLAYER_WEAPON_BASE));

    weapon.add(() => (entity.isFiring && entity.readyToFire), makeImageDisplayable(Images.PLAYER_WEAPON_FIRE));

    return weapon;
}

function makePlayerEngineDisplayable(entity) {
    const engine = new ConditionalDisplayable(12, 35, new CircularAnimation(0, 0, [makeImage(Images.PLAYER_ENGINE_BASE_1), makeImage(Images.PLAYER_ENGINE_BASE_2)], 40));

    engine.add(() => entity.getDy() < 0, new CircularAnimation(0, 0, [makeImage(Images.PLAYER_ENGINE_BOOST_1), makeImage(Images.PLAYER_ENGINE_BOOST_2)], 10));
    engine.add(() => entity.getDy() > 0, makeImageDisplayable(Images.PLAYER_ENGINE_BRAKE));

    return engine;
}

function makePlayerSpecialDisplayable(entity) {
    const special = new ConditionalDisplayable(7, 24, makeImageDisplayable(Images.PLAYER_SPECIAL_BASE));

    special.add(() => entity.isBoosting, makeImageDisplayable(Images.PLAYER_SPECIAL_DEPLOYED));

    return special;
}

function makePlayerChassisDisplayable(entity) {
    const chassis = new ConditionalDisplayable(0, 0, makeImageDisplayable(Images.PLAYER_CHASSIS_BASE));

    chassis.add(() => entity.getHealth() <= 20, makeImageDisplayable(Images.PLAYER_CHASSIS_DIRE));

    let prevHealth = entity.getHealth();
    chassis.add(() => {
        const curHealth = entity.getHealth();
        if(curHealth < prevHealth)
        {
            prevHealth = curHealth;
            return true;
        }
        return false;
    }, makeImageDisplayable(Images.PLAYER_CHASSIS_HURT));

    return chassis;
}

export function makeEnemyDisplayable(entity) {
    const enemyDisplayable = new ConditionalDisplayable(0, 0, makeImageDisplayable(Images.enemy));

    let prevHealth = entity.getHealth();
    enemyDisplayable.add(() => {
        const curHealth = entity.getHealth();
        if(curHealth < prevHealth)
        {
            prevHealth = curHealth;
            return true;
        }
        return false;
    }, makeImageDisplayable(Images.hurtEnemy));

    enemyDisplayable.getX = entity.getX;
    enemyDisplayable.getY = entity.getY;

    return enemyDisplayable;
}

export function makeBigEnemyDisplayable(entity) {
    const displayable = new ConditionalDisplayable(0, 0, makeImageDisplayable(Images.BIG_ENEMY_BASE));

    let prevHealth = entity.getHealth();
    displayable.add(() => {
        const curHealth = entity.getHealth();
        if(curHealth < prevHealth)
        {
            prevHealth = curHealth;
            return true;
        }
        return false;
    }, makeImageDisplayable(Images.BIG_ENEMY_HURT));

    displayable.getX = entity.getX;
    displayable.getY = entity.getY;

    return displayable;

}

export function makeExplosion(radius, color, particleCount, onExpire) {
    const root = new CompositeDisplayable(0, 0);

    root.radius = radius;

    let expiredParticles = [];

    for(let i = 0; i < particleCount; i++)
    {
        const speed = 4 + (Math.random() * 12);
        const trajectory = new UnitVector((Math.random() * 720) - 360, (Math.random() * 720) - 360);

        let lifespan = radius / speed;

        const particle = new SolidRect(radius, radius, 2, 2, color);
        particle.update = () => {
            if(lifespan <= 0)
            {
                expiredParticles.push(particle);
            }
            else
            {
                particle.translate(speed * trajectory.getDx(), speed * trajectory.getDy());
            }
            --lifespan;
        };

        root.add(particle);
    }

    const updateParticles = root.update;
    root.update = () => {
        updateParticles();
        expiredParticles.forEach(p => root.remove(p));
        expiredParticles = [];
        if(root.size() === 0)
            onExpire();
    };

    return root;
}

function makeImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

function makeImageDisplayable(src, update = () => {}) {
    return new ImageDisplayable(0, 0, makeImage(src), update);
}