import { Rect } from "./rect";
import { Vector2D } from "./vector-2d";

export class SpriteData {
    position!: Vector2D;
    offsetX!: number;
    offsetY!: number;
    width!: number;
    height!: number;
    scale!: number;
    rotation!: number;
    rect!: Rect;
    id!: string;

    frameDelay!: number;
    startFrame!: number;
    endFrame!: number;

    opacity!: number;
}
