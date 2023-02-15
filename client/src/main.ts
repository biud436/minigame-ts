import { Colors } from "./core/colors";
import { ConfigService } from "./core/config-service";
import { ErrorBoundary } from "./core/error";
import { Errors } from "./core/errors";
import { GameCanvas } from "./core/game-canvas";
import { GameErrorState } from "./core/game-error-state";
import { GameStateMachine } from "./core/game-state-machine";
import { Input } from "./core/input";
import { GameContext, Nullable } from "./core/interfaces/CoreContext";
import { MapState } from "./states/map-state";
import { SocketCore } from "./net/socket-core";

export type MiniGameBootstrapApplication = HTMLDivElement | null;

export class App {
    private application!: MiniGameBootstrapApplication;
    private gameCanvas?: GameCanvas;
    public gameContext: Nullable<GameContext> = null;
    private stateMachine: GameStateMachine = new GameStateMachine();
    private socketCore: SocketCore = new SocketCore();

    private lastElapsed: number = 0;
    private animationProviderId: number = 0;

    private static INSTANCE: App;
    private serverTime: Date = new Date();

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

    setServerTime(serverTime: Date) {
        this.serverTime = serverTime;
    }

    getServerTime() {
        return this.serverTime;
    }

    getFSM(): GameStateMachine {
        return this.stateMachine;
    }

    initWithCanvas(): void {
        const application = document.querySelector<HTMLDivElement>("#app");
        if (!application) return;
        this.gameCanvas = new GameCanvas(
            ConfigService.getInstance().width,
            ConfigService.getInstance().height
        );
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

        context.fillStyle = Colors.BLACK;
        context.fillRect(
            0,
            0,
            ConfigService.getInstance().width,
            ConfigService.getInstance().height
        );

        return this;
    }

    render(): void {
        const { gameContext: context } = this;
        if (!context) return;
        this.stateMachine.render(context);
    }

    getContext(): Nullable<GameContext> {
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
        this.stateMachine.update((elapsed - this.lastElapsed) / 1000);

        this.render();
        Input.getInstance().update();

        this.animationProviderId = window.requestAnimationFrame(
            this.update.bind(this)
        );
    }

    catchError(e: any) {
        const fsm = this.getFSM();
        fsm.pushState(
            new GameErrorState(
                e.message ? e.message : Errors.DEFAULT_ERROR_MESSAGE
            )
        );
    }

    dispose() {
        Input.getInstance().removeEventHandlers();
    }
}

const errorBoundary = new ErrorBoundary(App.getInstance());
