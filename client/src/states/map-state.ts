import { App } from "../core/app";
import { TextureManager } from "../manager/texture-manager";
import { GameErrorState } from "../core/game-error-state";
import { GameObject } from "../core/interfaces/game-object";
import { IGameState } from "../core/interfaces/game-state.interface";
import { GameText } from "../paints/game-text";
import { Input } from "../core/input";
import { Sound } from "../core/sound";
import { Sprite } from "../core/sprite";
import loadYaml from "../core/yaml-loader";
import { GameContext } from "../core/interfaces/core-context";
import { PlanetEarth } from "../objects/planet-earth";
import { Packet, SocketCore } from "../net/socket-core";

export class MapState implements IGameState {
  public static readonly ID = "MAP";
  private gameObjects: GameObject[] = [];
  private tile: Sprite | undefined;

  update(elapsed: number): void {
    for (const object of this.gameObjects) {
      object.update(elapsed);

      if (object instanceof Sprite) {
        object.setAngle(object.getAngle() + 1);
      }

      if (object instanceof GameText) {
        object.setText(
          [
            "< 마우스 좌표 >",
            `${Input.getInstance()
              .getMouseX()
              .toString()}, ${Input.getInstance().getMouseY().toString()}`,
            "< 서버 시간 >",
            new Intl.DateTimeFormat("ko-KR", {
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            }).format(App.getInstance().getServerTime()),
          ].join("\r\n")
        );
      }
    }

    SocketCore.getInstance().sendEvent("sync", {
      x: Input.getInstance().getMouseX(),
      y: Input.getInstance().getMouseY(),
      angle: 0,
    });
  }

  render(ctx: GameContext): void {
    for (const object of this.gameObjects) {
      object.draw(ctx);
    }
  }

  onEnter(): boolean {
    this.gameObjects.push(new GameText("Hello World", "white", "30px Arial"));

    TextureManager.getInstance()
      .load("/assets/tile1.png", "tile1")
      .then(() => {
        const tile = new Sprite();
        if (tile.initialize(0, 0, 32, 32, 1, "tile1")) {
          console.log("success");
        }

        tile.setX(200).setY(400).setOpacity(128).setAngle(45);

        this.gameObjects.push(tile);

        this.tile = tile;
      })
      .catch((e) => {
        App.getInstance()
          .getFSM()
          .pushState(new GameErrorState("텍스쳐 tile1을 찾지 못했습니다."));
      });

    this.gameObjects.push(new PlanetEarth());

    SocketCore.getInstance().addObserver<Date>("serverTime", (data) => {
      App.getInstance().setServerTime(data);
    });

    SocketCore.getInstance().addObserver<Packet>("players", (data: Packet) => {
      const x = data.x;
      const y = data.y;

      this.tile?.setX(x).setY(y);
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
