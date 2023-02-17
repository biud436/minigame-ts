import { IGameObject } from './interfaces/game-object.interface';
import { GameTransform } from './interfaces/game-transform.interface';

export class Guest implements IGameObject {
    public x: number = 0;
    public y: number = 0;
    public angle: number = 0;

    constructor() {}

    initialize() {
        this.x = 0;
        this.y = 0;
        this.angle = 0;
    }

    sync(transform: GameTransform) {
        const { x, y, angle } = transform;

        this.x = x;
        this.y = y;
        this.angle = angle;
    }

    update() {}
}
