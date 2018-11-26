import React, {Component} from 'react';
import './App.css';
import DisplayCanvas from './components/DisplayCanvas';
import CompositeDisplayable from "./displayables/composites/CompositeDisplayable";
import KeyListener from "./control/KeyListener";
import KeyboardController from "./control/KeyboardController";

import * as Sprites from "./wylaga/displayables/Sprites";
import Starfield from "./wylaga/displayables/Starfield";
import Game from "./wylaga/Game";
import Ship from "./wylaga/entities/Ship";
import TextDisplayable from "./displayables/primitives/TextDisplayable";
import WaveController from "./wylaga/control/WaveController";
import Projectile from "./wylaga/entities/Projectile";

const WIDTH = 1600, HEIGHT = 900;

class App extends Component {
    root;
    canvas;

    game;

    playerController;

    constructor(props) {
        super(props);
        this.canvas = React.createRef();

        // Initialize display tree:
        const root = new CompositeDisplayable(0, 0);
        const entityLayer = new CompositeDisplayable(0, 0);
        const hudLayer = new CompositeDisplayable(0, 0);

        root.add(new Starfield(WIDTH, HEIGHT, 200));
        root.add(entityLayer);
        root.add(hudLayer);

        hudLayer.add(new TextDisplayable(40, 40, "#FFF", () => "SHIELD: " + this.game.getPlayer().getHealth()));
        hudLayer.add(new TextDisplayable(40, 60, "#FFF", () => "POWER: " + this.game.getPlayer().getCurrentFuel()));

        // Initialize game:
        this.game = new Game(WIDTH, HEIGHT);
        const game = this.game;

        this.initializeEventListeners(game, entityLayer);

        const removeEntitySprite = function() {
            entityLayer.remove(this)
        };

        const badGuy = new Ship(500, 500, 25, 25, 1, 60, game.expireHostileShip, (x, y) => {
            game.spawnHostileProjectile(new Projectile(x + 9, y + 25, 7, 7, 12, 0, 1, ship => ship.damage(10)), badGuy)
        });
        badGuy.sprite = Sprites.makeModularEnemyDisplayable(badGuy, removeEntitySprite);

        const badGuy2 = new Ship(600, 500, 25, 25, 1, 60, game.expireHostileShip, (x, y) => {
            game.spawnHostileProjectile(new Projectile(x + 9, y + 25, 7, 7, 12, 0, 1, ship => ship.damage(10)), badGuy2)
        });
        badGuy2.sprite = Sprites.makeModularEnemyDisplayable(badGuy2, removeEntitySprite);

        const bigBadGuy = new Ship(550, 450, 50, 50, 0.3, 150, game.expireHostileShip, (x, y) => {
            game.spawnHostileProjectile(new Projectile(x + 21, y + 42, 8, 8, 6, 0, 1, ship => ship.damage(25)), bigBadGuy);
        });
        bigBadGuy.sprite = Sprites.makeNewBigEnemyDisplayable(bigBadGuy, removeEntitySprite);

        const playerEntity = game.getPlayer();
        playerEntity.sprite = Sprites.makeModularPlayerDisplayable(playerEntity, removeEntitySprite);

        game.spawnHostileShip(badGuy);
        game.spawnHostileShip(badGuy2);
        game.spawnHostileShip(bigBadGuy);
        game.spawnFriendlyShip(playerEntity);

        this.game = game;
        this.root = root;

        this.initializeController(playerEntity);
        this.initializeEnemyController([badGuy, badGuy2, bigBadGuy]);

        this.startTimer();
    }

    timestamp = () => {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    };

    now;
    last;
    dt;
    carry;

    startTimer = () => {
        this.dt = 17;
        this.carry = 0;
        this.now = this.last = this.timestamp();
        requestAnimationFrame(this.tick)
    };

    tick = () => {
        this.now = this.timestamp();
        let delta = (this.now - this.last) + this.carry;
        if(delta > 1000) delta = 1000;

        while(delta >= this.dt)
        {
            delta -= this.dt;
            this.enemyController.update();
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

    initializeEventListeners(game, entityLayer) {
        game.subscribeShipSpawned(ship => {
            entityLayer.add(ship.sprite);
        });

        game.subscribeEntityExpired(entity => {
            entity.sprite.explode();
        });

        game.subscribeProjectileSpawned((projectile, source) => {
            const projectileDisplayable = Sprites.makeProjectileDisplayable(projectile, () => {
                entityLayer.remove(projectileDisplayable);
            });

            entityLayer.add(projectileDisplayable);
            projectile.sprite = projectileDisplayable;
        });
    }

    initializeEnemyController(enemy) {
        this.enemyController = new WaveController(enemy);
    }

    initializeController(player) {
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

        this.playerController = new KeyboardController(player);

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
