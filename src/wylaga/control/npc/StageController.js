import HostileController from "./HostileController";
import Stage from "../../Stage";
import WaveController from "./WaveController";

export default class StageController {
    constructor(width, height, game, onStageComplete) {
        let stage = new Stage([]);

        const nextWave = () => {
            const wave = stage.nextWave();
            waveController.setWave(wave);
        };

        const onWaveExpiration = function() {
            if(stage.hasWave()) {
                nextWave();
            } else {
                onStageComplete();
            }
        };

        const waveController = new WaveController(width, height, onWaveExpiration);

        this.setStage = nextStage => {
            stage = nextStage;
            nextWave();
        };

        game.subscribeEntityExpired(waveController.onEntityExpiration);

        this.update = () => waveController.update();
    }
}