import { App } from "../main";
import { GameText } from "./game-text";

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
        if (this.app.gameContext) {
            this.app.gameContext.fillStyle = "black";
            this.app.gameContext.fillRect(0, 0, 800, 600);

            this.app.gameContext.save();
            this.app.gameContext.setTransform(1, 0, 0, 1, 10, 600 / 2 - 100);

            const text = new GameText(message, "yellow", "30px Arial");
            text.draw(this.app.gameContext);

            this.app.gameContext.restore();
        }
    }
}
