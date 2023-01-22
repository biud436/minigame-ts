import { GameObject } from "./game-object";
import { Matrix } from "./matrix";

export class GameText extends GameObject {
    private text: string;
    private color: string;
    private font: string;
    private matrix: Matrix;

    constructor(text: string, color: string, font: string) {
        super();
        this.text = text;
        this.color = color;
        this.font = font;
        this.matrix = new Matrix();
    }

    update(elapsed: number): void {
        this.matrix.translate(this.matrix.e, this.matrix.f + 5000 / elapsed);

        if (this.matrix.f > 500) {
            this.matrix.translate(0, 50);
        }

        this.matrix.update();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.font = this.font;

        ctx.fillText(this.text, 50 + this.matrix.e, 50 + this.matrix.f);
    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }
}
