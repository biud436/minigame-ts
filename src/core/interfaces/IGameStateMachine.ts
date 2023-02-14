import { IGameState } from "./IGameState";

export abstract class IGameStateMachine {
    abstract pushState(newState: IGameState): void;
    abstract changeState(newState: IGameState): void;
    abstract popState(): void;
    abstract update(elapsed: number): void;
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract current(): IGameState;

    gameStates: IGameState[] = [];
}
