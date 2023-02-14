import { GameContext } from "../core/interfaces/CoreContext";
import { GameObject } from "../core/interfaces/GameObject";

/**
 * @description
 * 화면 우측 아래에서 지구가 회전해야 한다.
 */
export class Earth extends GameObject {
    constructor() {
        super();
    }

    draw(ctx: GameContext): void {}

    update(elapsed: number): void {}

    destroy(): void {}
}
