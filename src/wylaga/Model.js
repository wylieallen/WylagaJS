import EntityCollider, {PrimaryGroup, SecondaryGroup} from "./EntityCollider";

export default class Model {
    constructor(width, height) {
        const entityCollider = new EntityCollider();

        // Collision event listeners:
        const shipToShipCollisionListeners = [];
        const hostileProjectileCollisionListeners = [];
        const friendlyProjectileCollisionListeners = [];

        // Lifecycle event listeners:
        const entityExpirationListeners = [];
        const shipSpawnListeners = [];
        const projectileSpawnListeners = [];

        // Entity sets:
        const friendlyShips = new Set(), friendlyProjectiles = new Set(),
            hostileShips = new Set(), hostileProjectiles = new Set();

        const expiredFriendlyShips = new Set(), expiredFriendlyProjectiles = new Set(),
            expiredHostileShips = new Set(), expiredHostileProjectiles = new Set();

        const notifyCollisionListeners = (listeners, entity1, entity2) => {
            listeners.forEach(callback => callback(entity1, entity2));
        };

        const notifyShipSpawn = ship => {
            shipSpawnListeners.forEach(callback => callback(ship));
        };

        const notifyProjectileSpawn = (projectile, source) => {
            projectileSpawnListeners.forEach(callback => callback(projectile, source));
        };

        const notifyExpiration = (entity) => {
            entityExpirationListeners.forEach(callback => callback(entity));
        };

        this.subscribeShipToShip = listener => {
            shipToShipCollisionListeners.push(listener);
        };

        this.subscribeHostileProjectile = listener => {
            hostileProjectileCollisionListeners.push(listener);
        };

        this.subscribeFriendlyProjectile = listener => {
            friendlyProjectileCollisionListeners.push(listener);
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

        entityCollider.addPrimary(friendlyShipPrimaryGroup);
        entityCollider.addPrimary(hostileShipPrimaryGroup);

        // Initialize entity collections:
        const allEntities = [friendlyShips, friendlyProjectiles, hostileShips, hostileProjectiles];
        const expireds = [expiredFriendlyShips, expiredFriendlyProjectiles, expiredHostileShips, expiredHostileProjectiles];

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

        const updateEntities = () => {
            allEntities.forEach(set => set.forEach(entity => entity.update()));
        };

        this.update = () => {
            removeExpiredEntities();
            updateEntities();
            entityCollider.processCollisions();
        };

        // Initialize internal event listeners:

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
}