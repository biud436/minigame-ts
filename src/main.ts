import { GameStateMachine } from "./core/game-state-machine";
import { GameText } from "./core/game-text";
import { MapState } from "./core/map-state";

export type MiniGameBootstrapApplication = HTMLDivElement | null;

export class App {
    private application!: MiniGameBootstrapApplication;
    private gameCanvas: HTMLCanvasElement | null = null;
    private gameContext: CanvasRenderingContext2D | null = null;
    private stateMachine: GameStateMachine = new GameStateMachine();

    private lastElapsed: number = 0;
    private animationProviderId: number = 0;

    constructor() {
        this.initWithCanvas();
    }

    initWithCanvas(): void {
        const application = document.querySelector<HTMLDivElement>("#app");
        if (!application) return;
        this.gameCanvas = document.createElement("canvas");
        this.gameCanvas.width = 800;
        this.gameCanvas.height = 600;

        this.gameContext = this.gameCanvas.getContext("2d");

        application.appendChild(this.gameCanvas);

        this.setApplication(application);

        this.stateMachine.pushState(new MapState());
    }

    clear() {
        const { gameContext: context } = this;
        if (!context) return;

        context.fillStyle = "black";
        context.fillRect(0, 0, 800, 600);

        return this;
    }

    render(): void {
        const { gameContext: context } = this;
        if (!context) return;
        this.stateMachine.render(context);
    }

    getContext(): CanvasRenderingContext2D | null {
        return this.gameCanvas ? this.gameContext : null;
    }

    setApplication(app: MiniGameBootstrapApplication): void {
        this.application = app;
    }

    update(elapsed: number) {
        this.clear();

        if (this.lastElapsed === 0) {
            this.lastElapsed = elapsed;
        }
        this.stateMachine.update(elapsed - this.lastElapsed);

        this.render();

        this.animationProviderId = window.requestAnimationFrame(
            this.update.bind(this)
        );
    }
}

const app = new App();
app.update(1.0);
