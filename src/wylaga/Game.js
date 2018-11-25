import {entitiesCollide} from "./Collision";
import Ship from "./entities/Ship";
import Projectile from "./entities/Projectile";

export default class Game {
    _friendlyShips = new Set();
    _friendlyProjectiles = new Set();
    _hostileShips = new Set();
    _hostileProjectiles = new Set();
    _entities = [this._friendlyShips, this._friendlyProjectiles, this._hostileShips, this._hostileProjectiles];
    _expireds = [];

    _player;

    _shipToShipCollisionListeners = [];
    _hostileProjectileCollisionListeners = [];
    _friendlyProjectileCollisionListeners = [];
    _entityExpirationListeners = [];
    _projectileSpawnListeners = [];
    _shipSpawnListeners = [];

    getPlayer = () => this._player;

    constructor(width, height) {
        for(let i = 0; i < this._entities.length; i++) {
            this._expireds.push(new Set());
        }

        this._player = new Ship(0, 0, 50, 50, 3, 100, this.expireFriendlyShip,
            (x, y) => this.spawnFriendlyProjectile(new Projectile(x + 23, y - 5 - 2, 4, 15, 9, 0, -1, ship => ship.damage(10)), this._player)
        );

        this._player.setLocation(
            (width / 2) - (this._player.getWidth() / 2),
            (3 * height / 4) - (this._player.getHeight() / 2)
        );

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

    expireFriendlyProjectile = projectile => this._expireds[1].add(projectile);
    expireHostileProjectile = projectile => this._expireds[3].add(projectile);
    expireFriendlyShip = ship => this._expireds[0].add(ship);
    expireHostileShip = ship => this._expireds[2].add(ship);

    spawnHostileShip = ship => {
        this._hostileShips.add(ship);
        this._shipSpawnListeners.forEach(callback => callback(ship));
    };

    spawnFriendlyShip = ship => {
        this._friendlyShips.add(ship);
        this._shipSpawnListeners.forEach(callback => callback(ship));
    };

    spawnFriendlyProjectile = (projectile, source) => {
        this._friendlyProjectiles.add(projectile);
        this._projectileSpawnListeners.forEach(callback => callback(projectile, source));
    };

    spawnHostileProjectile = (projectile, source) => {
        this._hostileProjectiles.add(projectile);
        this._projectileSpawnListeners.forEach(callback => callback(projectile, source));
    };

    update = () => {

        for(let i = 0; i < this._entities.length; i++)
        {
            const expired = this._expireds[i], set = this._entities[i];
            for(const entity of expired)
            {
                set.delete(entity);
                this.entityExpiration(entity);
            }
            this._expireds[i] = new Set();
        }

        this._entities.forEach(list => list.forEach(entity => entity.update()));

        this._friendlyShips.forEach(friendly => {
            this._hostileShips.forEach(hostile => {
                if(entitiesCollide(friendly, hostile))
                {
                    this.shipToShipCollision(friendly, hostile);
                }
            });

            this._hostileProjectiles.forEach(projectile => {
                if(entitiesCollide(friendly, projectile))
                {
                    this.hostileProjectileCollision(friendly, projectile);
                }
            });
        });

        this._hostileShips.forEach(hostile => {
           this._friendlyProjectiles.forEach(projectile => {
                if(entitiesCollide(hostile, projectile))
                {
                    this.friendlyProjectileCollision(hostile, projectile);
                }
           });
        });
    };

    entityExpiration = entity => {
        this._entityExpirationListeners.forEach(callback => callback(entity));
    };

    hostileProjectileCollision = (friendly, projectile) => {
        this._hostileProjectileCollisionListeners.forEach(callback => callback(friendly, projectile));
    };

    friendlyProjectileCollision = (hostile, projectile) => {
        this._friendlyProjectileCollisionListeners.forEach(callback => callback(hostile, projectile));
    };

    shipToShipCollision = (friendly, hostile) => {
        this._shipToShipCollisionListeners.forEach(callback => callback(friendly, hostile));
    };

    subscribeShipSpawned = callback => this._shipSpawnListeners.push(callback);
    subscribeProjectileSpawned = callback => this._projectileSpawnListeners.push(callback);
    subscribeEntityExpired = callback => this._entityExpirationListeners.push(callback);
    subscribeHostileProjectile = callback => this._hostileProjectileCollisionListeners.push(callback);
    subscribeFriendlyProjectile = callback => this._friendlyProjectileCollisionListeners.push(callback);
    subscribeShipToShip = callback => this._shipToShipCollisionListeners.push(callback);
}