import { ErrorBoundary } from "./core/error";
import { GameCanvas } from "./core/game-canvas";
import { GameErrorState } from "./core/game-error-state";
import { GameStateMachine } from "./core/game-state-machine";
import { GameText } from "./core/game-text";
import { Input } from "./core/input";
import { MapState } from "./core/map-state";

export type MiniGameBootstrapApplication = HTMLDivElement | null;

export class App {
    private application!: MiniGameBootstrapApplication;
    private gameCanvas?: GameCanvas;
    public gameContext: CanvasRenderingContext2D | null = null;
    private stateMachine: GameStateMachine = new GameStateMachine();

    private lastElapsed: number = 0;
    private animationProviderId: number = 0;

    private static INSTANCE: App;

    private constructor() {}

    static getInstance(): App {
        if (!App.INSTANCE) {
            App.INSTANCE = new App();
        }

        return App.INSTANCE;
    }

    start() {
        this.initWithCanvas();
        this.update(1.0);
    }

    getFSM(): GameStateMachine {
        return this.stateMachine;
    }

    initWithCanvas(): void {
        const application = document.querySelector<HTMLDivElement>("#app");
        if (!application) return;
        this.gameCanvas = new GameCanvas(800, 600);
        this.gameContext = this.gameCanvas.context;

        application.appendChild(this.gameCanvas.element);

        this.setApplication(application);

        this.stateMachine.pushState(new MapState());
    }

    initiWithInput(): void {
        Input.getInstance().initWithEventHandlers();
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

    catchError(e: any) {
        const fsm = this.getFSM();
        fsm.pushState(
            new GameErrorState(e.message ? e.message : "오류가 발생하였습니다.")
        );
    }

    dispose() {
        Input.getInstance().removeEventHandlers();
    }
}

const errorBoundary = new ErrorBoundary(App.getInstance());
