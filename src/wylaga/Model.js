import EntityCollider, {PrimaryGroup, SecondaryGroup} from "./EntityCollider";
import Ship from "./entities/Ship";

export default class Model {
    constructor(width, height) {

        // Initialize entity collections:
        const friendlyShips = new Set(), friendlyProjectiles = new Set(),
            hostileShips = new Set(), hostileProjectiles = new Set();

        const allEntities = [friendlyShips, friendlyProjectiles, hostileShips, hostileProjectiles];

        const expiredFriendlyShips = new Set(), expiredFriendlyProjectiles = new Set(),
            expiredHostileShips = new Set(), expiredHostileProjectiles = new Set();

        const expireds = [expiredFriendlyShips, expiredFriendlyProjectiles, expiredHostileShips, expiredHostileProjectiles];

        // Lifecycle event listeners:
        const notifyExpiration = initializeLifecycleMethods.bind(this)(friendlyShips, friendlyProjectiles, hostileShips, hostileProjectiles);

        const removeExpiredEntities = () => {
            for(let i = 0; i < allEntities.length; i++) {
                const expiredSet = expireds[i], entitySet = allEntities[i];
                for(const entity of expiredSet) {
                    entitySet.delete(entity);
                    notifyExpiration(entity);
                }
                expiredSet.clear();
            }
        };

        // Collision event listeners:
        const processCollisions = initializeEntityCollider.bind(this)(friendlyShips, friendlyProjectiles, hostileShips, hostileProjectiles);

        const updateEntities = () => allEntities.forEach(list => list.forEach(e => e.update()));

        this.update = () => {
            removeExpiredEntities();
            updateEntities();
            processCollisions();
        };

        // Initialize internal event listeners:
        initializeInternalEventListeners.bind(this)(expiredFriendlyShips, expiredFriendlyProjectiles, expiredHostileShips, expiredHostileProjectiles);

        const northProjectileCatcher = new Ship(-50, -100, width + 100, 50, 0, -1);
        northProjectileCatcher.isDead = () => false;
        this.spawnHostileShip(northProjectileCatcher);

        const southProjectileCatcher = new Ship(-50, 950, width + 100, 50, 0, -1);
        southProjectileCatcher.isDead = () => false;
        this.spawnFriendlyShip(southProjectileCatcher);
    }
}

function initializeLifecycleMethods(friendlyShips, friendlyProjectiles,
                                    hostileShips, hostileProjectiles) {
    const entityExpirationListeners = [];
    const shipSpawnListeners = [];
    const projectileSpawnListeners = [];

    const notifyShipSpawn = ship => {
        shipSpawnListeners.forEach(callback => callback(ship));
    };

    const notifyProjectileSpawn = (projectile, source) => {
        projectileSpawnListeners.forEach(callback => callback(projectile, source));
    };

    this.subscribeEntityExpired = listener => {
        entityExpirationListeners.push(listener);
    };

    this.subscribeShipSpawned = listener => {
        shipSpawnListeners.push(listener);
    };

    this.subscribeProjectileSpawned = listener => {
        projectileSpawnListeners.push(listener);
    };

    this.spawnHostileShip = ship => {
        hostileShips.add(ship);
        notifyShipSpawn(ship);
    };

    this.spawnFriendlyShip = ship => {
        friendlyShips.add(ship);
        notifyShipSpawn(ship);
    };

    this.spawnFriendlyProjectile = (projectile, source) => {
        friendlyProjectiles.add(projectile);
        notifyProjectileSpawn(projectile, source);
    };

    this.spawnHostileProjectile = (projectile, source) => {
        hostileProjectiles.add(projectile);
        notifyProjectileSpawn(projectile, source);
    };

    return entity => entityExpirationListeners.forEach(callback => callback(entity));
}

function initializeEntityCollider(friendlyShips, friendlyProjectiles,
                                  hostileShips, hostileProjectiles) {

    // Initialize collision event listeners and associated methods:
    const shipToShipCollisionListeners = [];
    const hostileProjectileCollisionListeners = [];
    const friendlyProjectileCollisionListeners = [];

    this.subscribeShipToShip = listener => {
        shipToShipCollisionListeners.push(listener);
    };

    this.subscribeHostileProjectile = listener => {
        hostileProjectileCollisionListeners.push(listener);
    };

    this.subscribeFriendlyProjectile = listener => {
        friendlyProjectileCollisionListeners.push(listener);
    };

    const notifyCollisionListeners = (listeners, entity1, entity2) => {
        listeners.forEach(callback => callback(entity1, entity2));
    };

    const shipToShipCollision = (friendly, hostile) => {
        notifyCollisionListeners(shipToShipCollisionListeners, friendly, hostile);
    };

    const hostileProjectileCollision = (friendly, projectile) => {
        notifyCollisionListeners(hostileProjectileCollisionListeners, friendly, projectile);
    };

    const friendlyProjectileCollision = (hostile, projectile) => {
        notifyCollisionListeners(friendlyProjectileCollisionListeners, hostile, projectile);
    };

    //Initialize collision engine:
    const friendlyShipPrimaryGroup = new PrimaryGroup(friendlyShips);
    const hostileShipSecondaryGroup = new SecondaryGroup(hostileShips, shipToShipCollision);
    const hostileProjectileSecondaryGroup = new SecondaryGroup(hostileProjectiles, hostileProjectileCollision);
    friendlyShipPrimaryGroup.addSecondaryGroup(hostileShipSecondaryGroup);
    friendlyShipPrimaryGroup.addSecondaryGroup(hostileProjectileSecondaryGroup);

    const hostileShipPrimaryGroup = new PrimaryGroup(hostileShips);
    const friendlyProjectileSecondaryGroup = new SecondaryGroup(friendlyProjectiles, friendlyProjectileCollision);
    hostileShipPrimaryGroup.addSecondaryGroup(friendlyProjectileSecondaryGroup);

    const collider = new EntityCollider();

    collider.addPrimary(friendlyShipPrimaryGroup);
    collider.addPrimary(hostileShipPrimaryGroup);

    return collider.processCollisions;
}

function initializeInternalEventListeners(expiredFriendlyShips, expiredFriendlyProjectiles,
                                          expiredHostileShips, expiredHostileProjectiles) {

    this.expireFriendlyProjectile = projectile => expiredFriendlyProjectiles.add(projectile);
    this.expireHostileProjectile = projectile => expiredHostileProjectiles.add(projectile);
    this.expireFriendlyShip = ship => expiredFriendlyShips.add(ship);
    this.expireHostileShip = ship => expiredHostileShips.add(ship);

    this.subscribeHostileProjectile((friendly, projectile) => {
        projectile.hit(friendly);
        this.expireHostileProjectile(projectile);
    });

    this.subscribeFriendlyProjectile((hostile, projectile) => {
        projectile.hit(hostile);
        this.expireFriendlyProjectile(projectile);
    });

    this.subscribeShipToShip((friendly, hostile) => {
        friendly.damage(30);
        hostile.damage(30);
    });
}