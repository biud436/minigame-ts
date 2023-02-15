import { GameContext } from "./core-context";
import { GameObject } from "./game-object";

export interface IGameState {
    update(elapsed: number): void;
    render(ctx: GameContext): void;
    onEnter(): boolean;
    onExit(): boolean;

    getStateID(): string;
    addChild(object: GameObject): void;
}
