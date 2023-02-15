import { GameObject } from "../core/interfaces/GameObject";
import { Input } from "../core/input";
import { Keys } from "../core/keys";
import { Matrix } from "../core/matrix";
import { Rect } from "../core/rect";
import { Sound } from "../core/sound";
import { GameContext } from "../core/interfaces/CoreContext";

const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;

/**
 * @class GameText
 * @description
 * 이 클래스는 텍스트를 화면에 그릴 수 있게 해줍니다.
 * 다중 라인과 색상, 폰트를 지정할 수 있습니다.
 */
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

        this.position.x = 10;
        this.position.y = 40;
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

    getLineHeight(): number {
        return parseInt(this.font, 10) ?? 1;
    }

    draw(ctx: GameContext): void {
        const lineHeight = this.getLineHeight();

        ctx.fillStyle = this.color;
        ctx.font = this.font;

        this.drawTexts(ctx, lineHeight);

        this.width = ctx.measureText(this.text).width;
        this.height = lineHeight;
    }

    /**
     * 다중 라인 텍스트를 묘화합니다.
     *
     * @param ctx
     * @param lineHeight
     */
    drawTexts(ctx: GameContext, lineHeight: number) {
        const texts = this.text.split(/[\r\n]+/i);
        let startY = this.position.y;
        const paddingY = 5;

        for (let text of texts) {
            ctx.fillText(text, this.position.x, startY);
            startY += lineHeight;
            startY += paddingY;
        }
    }

    destroy(): void {}

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }
}
