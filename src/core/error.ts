import { App } from "../main";

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
            console.error(e);
        } finally {
            this.app.dispose();
        }
    }
}
