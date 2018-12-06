export default class Stage {
    constructor(waves) {
        let index = 0;

        this.nextWave = () => waves[index++];
        this.hasWave = () => index < waves.length;
    }
}