import { GameContext } from "./interfaces/core-context";
import { IGameState } from "./interfaces/game-state.interface";
import { IGameStateMachine } from "./interfaces/game-state-machine.interface";

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

    render(ctx: GameContext): void {
        this.gameStates[this.gameStates.length - 1]?.render(ctx);
    }

    current(): IGameState {
        return this.gameStates[this.gameStates.length - 1];
    }
}
