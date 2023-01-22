import { TextureManager } from "../manager/texture-manager";
import { GameObject } from "./game-object";
import { IGameState } from "./game-state";
import { GameText } from "./game-text";
import { Sprite } from "./sprite";

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

        TextureManager.getInstance().load("/assets/tile1.png", "tile1");

        // 비동기 로더가 필요할 듯?
        const tile = new Sprite();
        if (tile.initialize(0, 0, 32, 32, 1, "tile1")) {
            console.log("success");
        }

        tile.setX(100).setY(400).setOpacity(128).setAngle(45);

        this.gameObjects.push(tile);

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
