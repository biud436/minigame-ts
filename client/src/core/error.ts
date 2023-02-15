import { App } from "./app";
import { GameErrorState } from "./game-error-state";
import { GameText } from "../paints/game-text";

/**
 * @class ErrorBoundary
 */
export class ErrorBoundary {
    constructor(private readonly app: App) {
        this.app = app;

        this.raiseOn();
    }

    raiseOn() {
        try {
            this.app.start();
        } catch (e: any) {
            this.printError(e.message);
            console.error(e);
        } finally {
            this.app.dispose();
        }
    }

    printError(message: string) {
        const fsm = this.app.getFSM();
        fsm.pushState(new GameErrorState(message));
    }
}
