import { GameContext } from "./CoreContext";
import { IGameState } from "./IGameState";

export abstract class IGameStateMachine {
    abstract pushState(newState: IGameState): void;
    abstract changeState(newState: IGameState): void;
    abstract popState(): void;
    abstract update(elapsed: number): void;
    abstract render(ctx: GameContext): void;
    abstract current(): IGameState;

    gameStates: IGameState[] = [];
}
