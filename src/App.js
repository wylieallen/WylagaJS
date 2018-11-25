import React, {Component} from 'react';
import './App.css';
import DisplayCanvas from './components/DisplayCanvas';
import CompositeDisplayable from "./displayables/composites/CompositeDisplayable";
import KeyListener from "./control/KeyListener";

import * as Sprites from "./wylaga/displayables/Sprites";
import Starfield from "./wylaga/displayables/Starfield";
import Game from "./wylaga/Game";
import KeyboardController from "./control/KeyboardController";
import Ship from "./wylaga/entities/Ship";
import Displayable from "./displayables/Displayable";
import TextDisplayable from "./displayables/primitives/TextDisplayable";

const WIDTH = 1600, HEIGHT = 900;

class App extends Component {
    root;
    canvas;

    game;

    playerController;

    constructor(props) {
        super(props);
        this.canvas = React.createRef();

        const root = new CompositeDisplayable(0, 0);
        const entityLayer = new CompositeDisplayable(0, 0);
        const effectLayer = new CompositeDisplayable(0, 0);
        const hudLayer = new CompositeDisplayable(0, 0);
        root.add(new Starfield(WIDTH, HEIGHT, 200));
        root.add(entityLayer);
        root.add(effectLayer);
        root.add(hudLayer);

        const entityToSpriteMap = new Map();

        const game = new Game();

        const expireEntityDisplayable = function() {
            entityLayer.remove(this);
            entityToSpriteMap.delete(this.getEntity());
        };

        const playerEntity = game.getPlayer();
        playerEntity.setLocation(
            (WIDTH / 2) - (playerEntity.getWidth() / 2),
            (3 * HEIGHT / 4) - (playerEntity.getHeight() / 2)
        );

        entityToSpriteMap.set(playerEntity, Sprites.makeModularPlayerDisplayable(playerEntity,
            () => {
            entityLayer.remove(entityToSpriteMap.get(playerEntity));
        }));

        game.subscribeShipSpawned(ship => {
            entityLayer.add(entityToSpriteMap.get(ship));
        });

        game.subscribeEntityExpired(entity => {
            entityToSpriteMap.get(entity).explode();
        });

        game.subscribeProjectileSpawned((projectile, source) => {
            const projectileDisplayable = Sprites.makeProjectileDisplayable(projectile, () => {
                entityLayer.remove(projectileDisplayable);
            });

            entityLayer.add(projectileDisplayable);
            entityToSpriteMap.set(projectile, projectileDisplayable);
        });

        const northProjectileCatcher = new Ship(-50, -50, WIDTH, 50, 0, -1);
        northProjectileCatcher.isDead = () => false;
        entityToSpriteMap.set(northProjectileCatcher, new Displayable(0, 0, () => {}));
        game.spawnHostileShip(northProjectileCatcher);

        const southProjectileCatcher = new Ship(-50, 1650, WIDTH, 50, 0, -1);
        southProjectileCatcher.isDead = () => false;
        entityToSpriteMap.set(southProjectileCatcher, new Displayable(0, 0, () => {}));
        game.spawnFriendlyShip(southProjectileCatcher);

        const badGuy = new Ship(500, 500, 25, 25, 5, 100, game.expireHostileShip, () => {});
        entityToSpriteMap.set(badGuy, Sprites.makeNewEnemyDisplayable(badGuy, () => {
            entityLayer.remove(entityToSpriteMap.get(badGuy));
        }));

        const bigBadGuy = new Ship(550, 450, 50, 50, 5, 100, game.expireHostileShip, () => {});
        entityToSpriteMap.set(bigBadGuy, Sprites.makeNewBigEnemyDisplayable(bigBadGuy, () => {
            entityLayer.remove(entityToSpriteMap.get(bigBadGuy));
        }));

        game.spawnHostileShip(badGuy);
        game.spawnHostileShip(bigBadGuy);
        game.spawnFriendlyShip(playerEntity);

        hudLayer.add(new TextDisplayable(40, 40, "#FFF", () => "HP: " + game.getPlayer().getHealth()));
        hudLayer.add(new TextDisplayable(40, 60, "#FFF", () => "FUEL: " + game.getPlayer().getCurrentFuel()));

        this.dt = 17;
        this.carry = 0;
        this.now = this.last = this.timestamp();

        this.game = game;
        this.root = root;

        this.initializeController(playerEntity);

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
