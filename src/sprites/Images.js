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

import BigEnemyBaseChassis from "./bigenemy/BigEnemyChassisBase.png";
import BigEnemyHurtChassis from "./bigenemy/BigEnemyChassisHurt.png";
import BigEnemyNearDeathChassis from "./bigenemy/BigEnemyChassisNearDeath.png";

import BigEnemyBaseSpecial from "./bigenemy/BigEnemySpecialBase.png";
import BigEnemyDeployedSpecial from "./bigenemy/BigEnemySpecialDeployed.png";

import BigEnemyBaseEngine from "./bigenemy/BigEnemyEngineBase.png";
import BigEnemyBaseEngine2 from "./bigenemy/BigEnemyEngineBase2.png";
import BigEnemyBrakeEngine from "./bigenemy/BigEnemyEngineBrake.png";
import BigEnemyBoostEngine from "./bigenemy/BigEnemyEngineBoost.png";
import BigEnemyBoostEngine2 from "./bigenemy/BigEnemyEngineBoost2.png";

import BigEnemyBaseWeapon from "./bigenemy/BigEnemyWeaponBase.png";
import BigEnemyFiringWeapon from "./bigenemy/BigEnemyWeaponFiring.png";

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
export const BIG_ENEMY_CHASSIS_BASE = makeImage(BigEnemyBaseChassis);
export const BIG_ENEMY_CHASSIS_HURT = makeImage(BigEnemyHurtChassis);
export const BIG_ENEMY_CHASSIS_DIRE = makeImage(BigEnemyNearDeathChassis);

export const BIG_ENEMY_SPECIAL_BASE = makeImage(BigEnemyBaseSpecial);
export const BIG_ENEMY_SPECIAL_DEPLOYED = makeImage(BigEnemyDeployedSpecial);

export const BIG_ENEMY_ENGINE_BASE = makeImage(BigEnemyBaseEngine);
export const BIG_ENEMY_ENGINE_BASE_2 = makeImage(BigEnemyBaseEngine2);
export const BIG_ENEMY_ENGINE_BRAKE = makeImage(BigEnemyBrakeEngine);
export const BIG_ENEMY_ENGINE_BOOST = makeImage(BigEnemyBoostEngine);
export const BIG_ENEMY_ENGINE_BOOST_2 = makeImage(BigEnemyBoostEngine2);

export const BIG_ENEMY_WEAPON_BASE = makeImage(BigEnemyBaseWeapon);
export const BIG_ENEMY_WEAPON_FIRING = makeImage(BigEnemyFiringWeapon);

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