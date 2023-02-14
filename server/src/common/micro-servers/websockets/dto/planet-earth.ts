export class PlanetEarth {
    /**
     * 캡슐화를 하지 않음 (은닉화 X)
     */
    public x: number;
    public y: number;
    public angle: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.angle = 0;
    }

    updateAngle() {
        this.angle += 0.05;

        if (this.angle > 360) {
            this.angle -= 360;
        }
    }
}
