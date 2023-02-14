export class PlanetEarth {
    private x: number;
    private y: number;
    private angle: number;

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
