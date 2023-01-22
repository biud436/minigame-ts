import { GameObject } from "./game-object";
import { IGameState } from "./game-state";
import { GameText } from "./game-text";

export class MapState implements IGameState {
    public static readonly ID = "MAP";
    private gameObjects: GameObject[] = [];

    update(elapsed: number): void {
        for (const object of this.gameObjects) {
            object.update(elapsed);
        }
    }

    render(ctx: CanvasRenderingContext2D): void {
        for (const object of this.gameObjects) {
            object.draw(ctx);
        }
    }

    onEnter(): boolean {
        this.gameObjects.push(
            new GameText("Hello World", "white", "30px Arial")
        );

        return true;
    }

    onExit(): boolean {
        for (const object of this.gameObjects) {
            object.destroy();
        }

        return true;
    }

    addChild(object: GameObject): void {
        this.gameObjects.push(object);
    }

    getStateID(): string {
        return MapState.ID;
    }
}
