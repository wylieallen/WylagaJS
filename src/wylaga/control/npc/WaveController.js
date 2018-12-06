import HostileController from "./HostileController";

export default class WaveController {
    constructor(maxX, maxY, onWaveExpiration) {
        let controllers = new Set();

        this.setWave = wave => {
            controllers = new Set();
            wave.forEach(entity => {
                entity.controller = new HostileController(entity, maxX, maxY);
                controllers.add(entity.controller);
            });
        };

        this.onEntityExpiration = entity => {
            if(controllers.delete(entity.controller)) {
                if(controllers.size <= 0) {
                    onWaveExpiration();
                }
            }
        };

        this.update = () => controllers.forEach(controller => controller.update());
    }
}