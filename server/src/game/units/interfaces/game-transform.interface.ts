import { IGameObject } from './game-object.interface';

export type GameTransform = Pick<IGameObject, 'x' | 'y' | 'angle'>;
