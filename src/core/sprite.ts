import { GameObject } from "./game-object";
import { SpriteData } from "./sprite-data";

export interface ISprite extends GameObject {
    initialize(
        x: number,
        y: number,
        width: number,
        height: number,
        maxFrames: number,
        textuereId: string
    ): boolean;
    update(elapsed: number): void;

    getSpriteData(): SpriteData;
}

export class Sprite implements ISprite {
    initialize(
        x: number,
        y: number,
        width: number,
        height: number,
        maxFrames: number,
        textuereId: string
    ): boolean {
        // TextureManager.load ...

        return true;
    }

    update(elapsed: number): void {
        //
    }

    getSpriteData(): SpriteData {
        return new SpriteData();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        //
    }

    destroy(): void {
        //
    }
}
