import { GameObject } from "./game-object";
import { Matrix } from "./matrix";
import { Rect } from "./rect";

export class GameText extends GameObject {
    private text: string;
    private color: string;
    private font: string;
    private matrix: Matrix;
    private position: Pick<Rect, "x" | "y">;

    constructor(text: string, color: string, font: string) {
        super();
        this.text = text;
        this.color = color;
        this.font = font;
        this.matrix = new Matrix();
        this.position = { x: 0, y: 0 };
    }

    updatePosition(elapsed: number) {
        this.position.y = this.position.y + 2;

        if (this.position.y > 500) {
            this.position.y = 50;
        }
    }

    updateTransform() {
        this.matrix.translate(this.position.x, this.position.y);
        this.matrix.update();
    }

    update(elapsed: number): void {
        this.updatePosition(elapsed);
        this.updateTransform();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.font = this.font;

        ctx.fillText(this.text, 50 + this.position.x, 50 + this.position.y);
    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }
}
