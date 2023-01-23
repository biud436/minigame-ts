import { GameObject } from "./game-object";
import { IGameState } from "./game-state";
import { GameText } from "./game-text";

export class GameErrorState implements IGameState {
    static readonly ID = "ERROR";
    private gameObjects: GameObject[] = [];
    private text: GameText;
    private static GAME_WIDTH = 800;
    private static GAME_HEIGHT = 600;

    constructor(private readonly message: string) {
        this.text = new GameText(message, "yellow", "30px Arial");
    }

    update(elapsed: number): void {
        //
    }

    render(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "black";
        ctx.fillRect(
            0,
            0,
            GameErrorState.GAME_WIDTH,
            GameErrorState.GAME_HEIGHT
        );

        ctx.save();

        const w = this.text.getWidth();
        const h = this.text.getHeight();
        ctx.translate(
            GameErrorState.GAME_WIDTH / 2 - w,
            GameErrorState.GAME_HEIGHT / 2 - h / 2
        );

        this.text.draw(ctx);

        ctx.restore();
    }

    onEnter(): boolean {
        return true;
    }
    onExit(): boolean {
        return true;
    }
    getStateID(): string {
        return GameErrorState.ID;
    }

    addChild(object: GameObject): void {
        this.gameObjects.push(object);
    }
}
