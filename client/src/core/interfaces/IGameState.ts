import { GameContext } from "./CoreContext";
import { GameObject } from "./GameObject";

export interface IGameState {
    update(elapsed: number): void;
    render(ctx: GameContext): void;
    onEnter(): boolean;
    onExit(): boolean;

    getStateID(): string;
    addChild(object: GameObject): void;
}
