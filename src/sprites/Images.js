import Enemy from "./Enemy.png";
import HurtEnemy from "./HurtEnemy.png";

import PlayerBaseChassis from "./player/PlayerBaseChassis.png";
import PlayerHurtChassis from "./player/PlayerHurtChassis.png";
import PlayerNearDeathChassis from "./player/PlayerNearDeathChassis.png";

import PlayerBaseSpecial from "./player/PlayerBaseSpecial.png";
import PlayerDeployedSpecial from "./player/PlayerDeployedSpecial.png";

import PlayerBaseEngine1 from "./player/PlayerBaseEngine1.png";
import PlayerBaseEngine2 from "./player/PlayerBaseEngine2.png";
import PlayerBoostEngine1 from "./player/PlayerBoostEngine1.png";
import PlayerBoostEngine2 from "./player/PlayerBoostEngine2.png";
import PlayerBrakeEngine from "./player/PlayerBrakeEngine.png";

import PlayerBaseWeapon from "./player/PlayerBaseWeapon.png";
import PlayerFiringWeapon from "./player/PlayerFiringWeapon.png";

import BigEnemyBase from "./bigenemy/BaseBigEnemy.png";
import BigEnemyHurt from "./bigenemy/HurtBigEnemy.png";

function makeImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

export const PLAYER_CHASSIS_BASE = makeImage(PlayerBaseChassis);
export const PLAYER_CHASSIS_HURT = makeImage(PlayerHurtChassis);
export const PLAYER_CHASSIS_DIRE = makeImage(PlayerNearDeathChassis);

export const PLAYER_SPECIAL_BASE = makeImage(PlayerBaseSpecial);
export const PLAYER_SPECIAL_DEPLOYED = makeImage(PlayerDeployedSpecial);

export const PLAYER_ENGINE_BASE_1 = makeImage(PlayerBaseEngine1);
export const PLAYER_ENGINE_BASE_2 = makeImage(PlayerBaseEngine2);
export const PLAYER_ENGINE_BOOST_1 = makeImage(PlayerBoostEngine1);
export const PLAYER_ENGINE_BOOST_2 = makeImage(PlayerBoostEngine2);
export const PLAYER_ENGINE_BRAKE = makeImage(PlayerBrakeEngine);

export const PLAYER_WEAPON_BASE = makeImage(PlayerBaseWeapon);
export const PLAYER_WEAPON_FIRE = makeImage(PlayerFiringWeapon);

export const BIG_ENEMY_BASE = makeImage(BigEnemyBase);
export const BIG_ENEMY_HURT = makeImage(BigEnemyHurt);

export const enemy = makeImage(Enemy);
export const hurtEnemy = makeImage(HurtEnemy);