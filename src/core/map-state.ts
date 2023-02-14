import { App } from "../main";
import { TextureManager } from "../manager/texture-manager";
import { GameErrorState } from "./game-error-state";
import { GameObject } from "./interfaces/GameObject";
import { IGameState } from "./interfaces/IGameState";
import { GameText } from "./game-text";
import { Input } from "./input";
import { Sound } from "./sound";
import { Sprite } from "./sprite";
import loadYaml from "./yaml-loader";

export class MapState implements IGameState {
    public static readonly ID = "MAP";
    private gameObjects: GameObject[] = [];

    update(elapsed: number): void {
        for (const object of this.gameObjects) {
            object.update(elapsed);

            if (object instanceof Sprite) {
                object.setAngle(object.getAngle() + 1);
            }

            if (object instanceof GameText) {
                object.setText(
                    `마우스 X 좌표 : ${Input.getInstance()
                        .getMouseX()
                        .toString()}`
                );
            }
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

        TextureManager.getInstance()
            .load("/assets/tile1.png", "tile1")
            .then(() => {
                const tile = new Sprite();
                if (tile.initialize(0, 0, 32, 32, 1, "tile1")) {
                    console.log("success");
                }

                tile.setX(100).setY(400).setOpacity(128).setAngle(45);

                this.gameObjects.push(tile);
            })
            .catch((e) => {
                App.getInstance()
                    .getFSM()
                    .pushState(
                        new GameErrorState("텍스쳐 tile1을 찾지 못했습니다.")
                    );
            });

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
