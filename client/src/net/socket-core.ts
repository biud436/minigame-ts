import { io, Socket } from "socket.io-client";
import { ConfigService } from "../core/config-service";
import { App } from "../main";

export class SocketCore {
    protected socket?: Socket;
    private static INSTANCE: SocketCore;

    constructor() {
        this.initialize();
    }

    public static getInstance() {
        if (!SocketCore.INSTANCE) {
            SocketCore.INSTANCE = new SocketCore();
        }

        return SocketCore.INSTANCE;
    }

    initialize() {
        this.initWithSocket();
        this.handleError();
        this.emitConntectEcho();
    }

    initWithSocket() {
        const configService = ConfigService.getInstance();
        const host = configService.baseServerUrl;

        this.socket = io(host);
    }

    handleError() {
        this.socket?.on("connect_error", (err) => {
            App.getInstance().catchError(err);
        });
    }

    emitConntectEcho() {
        this.socket?.emit("connectEcho");
    }

    sendEvent(event: string, data: any) {
        this.socket?.emit(event, data);
    }
}
