import { Matrix } from "../core/matrix";
import { Rect } from "../core/rect";

export interface ITextureManager {
    load(filename: string, id: string): boolean;
    remove(id: string): boolean;
    drawText(
        id: string,
        x: number,
        y: number,
        width: number,
        height: number,
        rect: Rect,
        transform: Matrix
    ): void;
}
