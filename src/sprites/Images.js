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

import EnemyBaseChassis from "./enemy/EnemyBaseChassis.png";
import EnemyHurtChassis from "./enemy/EnemyHurtChassis.png";
import EnemyNearDeathChassis from "./enemy/EnemyNearDeathChassis.png";

import EnemyBaseSpecial from "./enemy/EnemyBaseSpecial.png";
import EnemyDeployedSpecial from "./enemy/EnemyDeployedSpecial.png";

import EnemyBaseEngine from "./enemy/EnemyBaseEngine.png";
import EnemyBoostEngine from "./enemy/EnemyBoostEngine.png";

import EnemyBaseWeapon from "./enemy/EnemyBaseWeapon.png";
import EnemyFiringWeapon from "./enemy/EnemyFiringWeapon.png";

function makeImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

// Player sprite components:
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

// Big enemy sprite components:
export const BIG_ENEMY_BASE = makeImage(BigEnemyBase);
export const BIG_ENEMY_HURT = makeImage(BigEnemyHurt);

// Enemy sprite components:
export const ENEMY_CHASSIS_BASE = makeImage(EnemyBaseChassis);
export const ENEMY_CHASSIS_HURT = makeImage(EnemyHurtChassis);
export const ENEMY_CHASSIS_DIRE = makeImage(EnemyNearDeathChassis);

export const ENEMY_WEAPON_BASE = makeImage(EnemyBaseWeapon);
export const ENEMY_WEAPON_FIRE = makeImage(EnemyFiringWeapon);

export const ENEMY_ENGINE_BASE = makeImage(EnemyBaseEngine);
export const ENEMY_ENGINE_BOOST = makeImage(EnemyBoostEngine);

export const ENEMY_SPECIAL_BASE = makeImage(EnemyBaseSpecial);
export const ENEMY_SPECIAL_DEPLOYED = makeImage(EnemyDeployedSpecial);

export const enemy = makeImage(Enemy);
export const hurtEnemy = makeImage(HurtEnemy);