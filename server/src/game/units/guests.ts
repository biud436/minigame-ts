import { IGameObject } from './interfaces/game-object.interface';
import { Loadable } from './interfaces/loadable.interface';

export class Guests implements IGameObject, Loadable {
    public x: number = 0;
    public y: number = 0;
    public angle: number = 0;
    public isLoading: boolean = false;

    constructor() {}

    update() {}
}
