import HostileController from "./HostileController";
import Stage from "../Stage";

export default class StageController {
    constructor(width, height, game, onStageComplete) {
        const controlledEntities = new Set();

        let stage = new Stage([]);

        const nextWave = () => {
            const wave = stage.nextWave();
            wave.forEach(e => controlledEntities.add(e));
        };

        const onWaveExpiration = function() {
            if(stage.hasWave()) {
                nextWave();
            } else {
                onStageComplete();
            }
        };

        const onEntityExpiration = function(entity) {
            if(controlledEntities.delete(entity)) {
                if(controlledEntities.size <= 0) {
                    onWaveExpiration();
                }
            }
        };

        this.setStage = nextStage => {
            stage = nextStage;
            nextWave();
        };

        game.subscribeEntityExpired(onEntityExpiration);

        const entityController = new HostileController(controlledEntities, width, height);

        this.update = () => entityController.update();
    }
}