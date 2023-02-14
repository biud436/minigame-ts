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

    constructor() {
        this.position = new Vector2D(0, 0);
        this.offsetX = 0;
        this.offsetY = 0;
        this.width = 4;
        this.height = 4;
        this.scale = 1.0;
        this.rotation = 0.0;
        this.id = "none";
        this.frameDelay = 0.0;
        this.startFrame = 0;
        this.endFrame = 1;

        this.rect = new Rect(0, 0, 4, 4);
        this.opacity = 255;
    }
}
