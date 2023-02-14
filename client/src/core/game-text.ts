import { GameObject } from "./interfaces/GameObject";
import { Input } from "./input";
import { Keys } from "./keys";
import { Matrix } from "./matrix";
import { Rect } from "./rect";
import { Sound } from "./sound";

const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;

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

        this.initWithPosition();
    }

    initWithPosition() {
        const width = WINDOW_WIDTH;
        const height = WINDOW_HEIGHT;

        this.position.x = width / 2;
        this.position.y = height / 2;
    }

    updatePosition(elapsed: number) {
        if (Input.getInstance().isKeyPress(Keys.VK_LEFT)) {
            this.position.x = this.position.x - 10;
        } else if (Input.getInstance().isKeyPress(Keys.VK_RIGHT)) {
            this.position.x = this.position.x + 10;
        } else if (Input.getInstance().isKeyPress(Keys.VK_DOWN)) {
            this.position.y = this.position.y + 10;
        } else if (Input.getInstance().isKeyPress(Keys.VK_UP)) {
            this.position.y = this.position.y - 10;
        }

        if (this.position.y > 500) {
            this.position.y = 50;
        }

        if (Input.getInstance().isKeyDown(Keys.VK_SHIFT)) {
            Sound.getInstance().playOnce("/assets/wind.ogg");
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
