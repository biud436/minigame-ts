import { IGameState } from "./game-state";

export abstract class IGameStateMachine {
    abstract pushState(newState: IGameState): void;
    abstract changeState(newState: IGameState): void;
    abstract popState(): void;
    abstract update(elapsed: number): void;
    abstract render(ctx: CanvasRenderingContext2D): void;
    abstract current(): IGameState;

    gameStates: IGameState[] = [];
}

export class GameStateMachine extends IGameStateMachine {
    pushState(newState: IGameState): void {
        this.gameStates.push(newState);
        this.gameStates[this.gameStates.length - 1]?.onEnter();
    }

    changeState(newState: IGameState): void {
        const { gameStates: states } = this;

        if (states.length > 0) {
            if (
                states[states.length - 1].getStateID() === newState.getStateID()
            ) {
                return;
            }

            if (states[states.length - 1].onExit()) {
                this.gameStates.pop();
            }
        }

        states.push(newState);
        states[states.length - 1].onEnter();
    }

    popState(): void {
        if (this.gameStates.length > 0) {
            if (this.gameStates[this.gameStates.length - 1].onExit()) {
                this.gameStates.pop();
            }
        }
    }

    update(elapsed: number): void {
        this.gameStates[this.gameStates.length - 1]?.update(elapsed);
    }

    render(ctx: CanvasRenderingContext2D): void {
        this.gameStates[this.gameStates.length - 1]?.render(ctx);
    }

    current(): IGameState {
        return this.gameStates[this.gameStates.length - 1];
    }
}
