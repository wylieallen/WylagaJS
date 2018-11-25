import Entity from "./Entity";

export default class Ship extends Entity {
    curHealth;
    maxHealth;

    curFuel;
    maxFuel;

    onFire;

    isFiring = false;
    readyToFire = true;

    isBoosting = false;

    constructor(x, y, width, height, velocity, maxHealth, onDeath, onFire = () => {})
    {
        super(x, y, width, height, velocity);
        this.maxHealth = this.curHealth = maxHealth;
        this.maxFuel = this.curFuel = 200;
        this.onFire = onFire;
        this.onDeath = onDeath;
        const updatePosition = this.update;
        const DEFAULT_VELOCITY = velocity;
        const BOOST_VELOCITY = velocity * 2;
        this.update = () => {
            updatePosition();

            if(this.isBoosting)
            {
                if(this.curFuel > 0)
                {
                    this.curFuel -= 2;
                    this.setVelocity(BOOST_VELOCITY)
                }
                else
                {
                    this.setVelocity(DEFAULT_VELOCITY);
                }
            }
            else
            {
                if(this.curFuel < this.maxFuel) ++this.curFuel;
                this.setVelocity(DEFAULT_VELOCITY);
            }

            if(this.isFiring && this.readyToFire)
            {
                this.onFire(this.getX(), this.getY());
                this.readyToFire = false;
            }
            else if(!this.isFiring)
            {
                this.readyToFire = true;
            }
        }
    }

    setBoosting = isBoosting => this.isBoosting = isBoosting;

    setFiring = isFiring => {
        this.isFiring = isFiring;
    };

    getCurrentFuel = () => this.curFuel;
    getMaxFuel = () => this.maxFuel;
    getHealth = () => this.curHealth;
    getMaxHealth = () => this.maxHealth;

    damage = damage => {
        this.curHealth -= damage;
        if(this.isDead())
            this.onDeath(this);
    };

    heal = healing => {
        this.curHealth += healing;
        if(this.curHealth > this.maxHealth)
            this.curHealth = this.maxHealth;
    };

    isDead = () => this.curHealth <= 0;
}