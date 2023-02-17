import { IGameObject } from './interfaces/game-object.interface';

export class PlanetEarth implements IGameObject {
    x: number;
    y: number;
    angle: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.angle = 0;
    }

    update() {
        this.angle += 0.05;

        if (this.angle > 360) {
            this.angle -= 360;
        }
    }
}
