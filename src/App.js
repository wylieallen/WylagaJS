import React, {Component} from 'react';
import './App.css';
import DisplayCanvas from './components/DisplayCanvas';
import CompositeDisplayable from "./displayables/composites/CompositeDisplayable";
import KeyListener from "./control/KeyListener";

import * as Sprites from "./wylaga/displayables/Sprites";
import Starfield from "./wylaga/displayables/Starfield";
import Game from "./wylaga/Game";
import KeyboardController from "./control/KeyboardController";
import SolidRect from "./displayables/primitives/SolidRect";
import Ship from "./wylaga/entities/Ship";
import Displayable from "./displayables/Displayable";
import TextDisplayable from "./displayables/primitives/TextDisplayable";

const WIDTH = 1600, HEIGHT = 900;

class App extends Component {
    root;
    canvas;

    game;

    playerController;
    playerEntity;

    entityMap;
    entityLayer;

    effectLayer;

    hudLayer;

    entityToExplosionMap;

    constructor(props) {
        super(props);
        this.canvas = React.createRef();

        this.root = new CompositeDisplayable(0, 0);
        this.root.add(new Starfield(WIDTH, HEIGHT, 200));
        this.root.add(this.entityLayer = new CompositeDisplayable(0, 0));
        this.root.add(this.effectLayer = new CompositeDisplayable(0, 0));
        this.root.add(this.hudLayer = new CompositeDisplayable(0, 0));

        this.entityMap = new Map();

        this.entityToExplosionMap = new Map();

        this.game = new Game();
        this.playerEntity = this.game.getPlayer();
        this.playerEntity.setLocation(
            (WIDTH / 2) - (this.playerEntity.getWidth() / 2),
            (3 * HEIGHT / 4) - (this.playerEntity.getHeight() / 2)
        );
        this.playerController = new KeyboardController(this.playerEntity);

        this.entityMap.set(this.playerEntity, Sprites.makePlayerDisplayable(this.playerEntity));
        const playerExplosion = Sprites.makeExplosion(100, "#f00", 100, () =>
        {
            this.entityToExplosionMap.delete(this.playerEntity);
            this.effectLayer.remove(playerExplosion);
        });
        this.entityToExplosionMap.set(this.playerEntity, playerExplosion);

        this.game.subscribeShipSpawned(ship => {
            this.entityLayer.add(this.entityMap.get(ship));
        });

        this.game.subscribeEntityExpired(entity => {
            this.entityLayer.remove(this.entityMap.get(entity));
            this.entityMap.delete(entity);

            const explosion = this.entityToExplosionMap.get(entity);

            explosion.setX(entity.getX() + (entity.getWidth() / 2) - explosion.radius);
            explosion.setY(entity.getY() + (entity.getHeight() / 2) - explosion.radius);

            this.effectLayer.add(explosion);
            this.entityToExplosionMap.delete(entity);
        });

        this.game.subscribeProjectileSpawned((projectile, source) => {
            const projectileDisplayable = new SolidRect(0, 0,
                projectile.getWidth(), projectile.getHeight(), '#FF0000');
            projectileDisplayable.getX = projectile.getX;
            projectileDisplayable.getY = projectile.getY;

            this.entityLayer.add(projectileDisplayable);
            this.entityMap.set(projectile, projectileDisplayable);

            console.log("source:", source);

            // this.entityMap.get(source).fire();

            const projectileExplosion = Sprites.makeExplosion(50, "#f00", 70, () => {
                this.entityToExplosionMap.delete(projectile);
                this.effectLayer.remove(projectileExplosion);
            });

            this.entityToExplosionMap.set(projectile, projectileExplosion);
        });

        const northProjectileCatcher = new Ship(-50, -50, WIDTH, 50, 0, -1);
        northProjectileCatcher.isDead = () => false;
        this.entityMap.set(northProjectileCatcher, new Displayable(0, 0, () => {}));
        this.game.spawnHostileShip(northProjectileCatcher);

        const southProjectileCatcher = new Ship(-50, 1650, WIDTH, 50, 0, -1);
        southProjectileCatcher.isDead = () => false;
        this.entityMap.set(southProjectileCatcher, new Displayable(0, 0, () => {}));
        this.game.spawnFriendlyShip(southProjectileCatcher);

        const badGuy = new Ship(500, 500, 25, 25, 5, 100, this.game.expireHostileShip, () => {});
        this.entityMap.set(badGuy, Sprites.makeEnemyDisplayable(badGuy));
        const enemyExplosion = Sprites.makeExplosion(100, "#f00", 100, () =>
        {
            this.entityToExplosionMap.delete(badGuy);
            this.effectLayer.remove(enemyExplosion);
        });
        this.entityToExplosionMap.set(badGuy, enemyExplosion);

        const bigBadGuy = new Ship(550, 450, 50, 50, 5, 100, this.game.expireHostileShip, () => {});
        this.entityMap.set(bigBadGuy, Sprites.makeBigEnemyDisplayable(bigBadGuy));
        const bigEnemyExplosion = Sprites.makeExplosion(100, "#f00", 100, () =>
        {
            this.entityToExplosionMap.delete(bigBadGuy);
            this.effectLayer.remove(bigEnemyExplosion);
        });
        this.entityToExplosionMap.set(bigBadGuy, bigEnemyExplosion);

        this.game.spawnHostileShip(badGuy);
        this.game.spawnHostileShip(bigBadGuy);
        this.game.spawnFriendlyShip(this.playerEntity);

        this.hudLayer.add(new TextDisplayable(40, 40, "#FFF", () => "HP: " + this.game.getPlayer().getHealth()));
        this.hudLayer.add(new TextDisplayable(40, 60, "#FFF", () => "FUEL: " + this.game.getPlayer().getCurrentFuel()));

        this.dt = 17;
        this.carry = 0;
        this.now = this.last = this.timestamp();

        this.initializeController();

        requestAnimationFrame(this.tick)
    }

    timestamp = () => {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    };

    now;
    last;
    dt;
    carry;

    tick = () => {
        this.now = this.timestamp();
        let delta = (this.now - this.last) + this.carry;
        if(delta > 1000) delta = 1000;

        while(delta >= this.dt)
        {
            delta -= this.dt;
            this.playerController.update();
            this.canvas.current.update();
            this.canvas.current.repaint();
            this.game.update();
        }

        this.carry = delta;
        this.last = this.now;

        requestAnimationFrame(this.tick);
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <DisplayCanvas width={WIDTH} height={HEIGHT} root={this.root} ref={this.canvas}/>
                </header>
            </div>
        );
    }

    initializeController() {
        const keyListener = new KeyListener();

        keyListener.bindKeyPress('38', "upPress");
        keyListener.bindKeyRelease('38', "upRelease");

        keyListener.bindKeyPress('87', "upPress");
        keyListener.bindKeyRelease('87', "upRelease");

        keyListener.bindKeyPress('40', "downPress");
        keyListener.bindKeyRelease('40', "downRelease");

        keyListener.bindKeyPress('83', "downPress");
        keyListener.bindKeyRelease('83', "downRelease");

        keyListener.bindKeyPress('37', "leftPress");
        keyListener.bindKeyRelease('37', "leftRelease");

        keyListener.bindKeyPress('65', "leftPress");
        keyListener.bindKeyRelease('65', "leftRelease");

        keyListener.bindKeyPress('39', "rightPress");
        keyListener.bindKeyRelease('39', "rightRelease");

        keyListener.bindKeyPress('68', "rightPress");
        keyListener.bindKeyRelease('68', "rightRelease");

        keyListener.bindKeyPress('32', "firePress");
        keyListener.bindKeyRelease('32', "fireRelease");

        keyListener.bindKeyPress('13', "firePress");
        keyListener.bindKeyRelease('13', "fireRelease");

        keyListener.bindKeyPress('16', "specialPress");
        keyListener.bindKeyRelease('16', "specialRelease");


        keyListener.bindAction("upPress", () => this.playerController.upPressed = true);
        keyListener.bindAction("downPress", () => this.playerController.downPressed = true);
        keyListener.bindAction("leftPress", () => this.playerController.leftPressed = true);
        keyListener.bindAction("rightPress", () => this.playerController.rightPressed = true);

        keyListener.bindAction("upRelease", () => this.playerController.upPressed = false);
        keyListener.bindAction("downRelease", () => this.playerController.downPressed = false);
        keyListener.bindAction("leftRelease", () => this.playerController.leftPressed = false);
        keyListener.bindAction("rightRelease", () => this.playerController.rightPressed = false);

        keyListener.bindAction("firePress", () => this.playerController.isFiring = true);
        keyListener.bindAction("fireRelease", () => this.playerController.isFiring = false);

        keyListener.bindAction("specialPress", () => this.playerController.isBoosting = true);
        keyListener.bindAction("specialRelease", () => this.playerController.isBoosting = false);

        window.onkeydown = keyListener.keyPressed.bind(keyListener);
        window.onkeyup = keyListener.keyReleased.bind(keyListener);
    }
}

export default App;
