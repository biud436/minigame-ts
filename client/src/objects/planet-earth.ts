import { GameContext } from "../core/interfaces/CoreContext";
import { GameObject } from "../core/interfaces/GameObject";
import { Rect } from "../core/rect";
import { Sprite } from "../core/sprite";
import { TextureManager } from "../manager/texture-manager";
import { SocketCore } from "../net/socket-core";

/**
 * @description
 * 화면 우측 아래에서 지구가 회전해야 한다.
 */
export class PlanetEarth extends GameObject {
    private mainSprite?: Sprite;
    private angle: number;
    private padding: Rect = new Rect(-320, -320, 0, 0);
    private lastTime: number = 0;
    private TIMER: number = 500;

    constructor() {
        super();

        this.angle = 0;
        this.lastTime = performance.now();
        this.initialize();
    }

    async initialize(): Promise<void> {
        try {
            const tm = TextureManager.getInstance();
            const isReady = await tm.load(
                "/assets/planet-earth.png",
                "planet-earth"
            );

            this.mainSprite = new Sprite();
            this.mainSprite.initialize(0, 0, 640, 640, 1, "planet-earth");
            const spriteData = this.mainSprite.getSpriteData();

            if (spriteData) {
                spriteData.offsetX = 660;
                spriteData.offsetY = 600;

                this.mainSprite.setSpriteData(spriteData);
            }

            this.mainSprite.setScale(1.0);
            this.mainSprite.setRect(this.padding);

            SocketCore.getInstance().onEvent("packet", (data: any) => {
                this.angle = +data.angle;

                console.log(data);
            });
        } catch (e: any) {
            console.warn(e);
        }
    }

    draw(ctx: GameContext): void {
        this.mainSprite?.draw(ctx);
    }

    update(elapsed: number): void {
        this.mainSprite?.setAngle(this.angle);
        this.mainSprite?.update(elapsed);
    }

    destroy(): void {
        this.mainSprite?.destroy();
    }
}
