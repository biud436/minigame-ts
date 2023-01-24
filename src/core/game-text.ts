import { GameObject } from "./game-object";
import { Input } from "./input";
import { Matrix } from "./matrix";
import { Rect } from "./rect";

export class GameText extends GameObject {
    private text: string;
    private color: string;
    private font: string;
    private matrix: Matrix;
    private position: Pick<Rect, "x" | "y">;

    private width: number = 0;
    private height: number = 0;

    constructor(text: string, color: string, font: string) {
        super();
        this.text = text;
        this.color = color;
        this.font = font;
        this.matrix = new Matrix();
        this.position = { x: 0, y: 0 };
    }

    updatePosition(elapsed: number) {
        if (Input.getInstance().isKeyDown("ArrowLeft")) {
            this.position.x = this.position.x - 10;
        } else if (Input.getInstance().isKeyDown("ArrowRight")) {
            this.position.x = this.position.x + 10;
        }
        this.position.y = this.position.y + 2;

        if (this.position.y > 500) {
            this.position.y = 50;
        }
    }

    updateTransform() {
        this.matrix.translate(this.position.x, this.position.y);
        this.matrix.update();
    }

    setText(text: string): GameText {
        this.text = text;

        return this;
    }

    update(elapsed: number): void {
        this.updatePosition(elapsed);
        this.updateTransform();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.font = this.font;

        ctx.fillText(this.text, this.position.x, this.position.y);

        this.width = ctx.measureText(this.text).width;
        this.height = parseInt(this.font, 10);
    }

    destroy(): void {
        throw new Error("Method not implemented.");
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }
}
