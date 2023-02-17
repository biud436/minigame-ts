import { IGameObject } from './interfaces/game-object.interface';

export class ServerTime implements IGameObject {
    x: number;
    y: number;
    angle: number;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.angle = 0;
    }

    update() {
        this.x = Date.now();
    }
}
