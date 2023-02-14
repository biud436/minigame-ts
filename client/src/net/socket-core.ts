import { io, Socket } from "socket.io-client";
import { ConfigService } from "../core/config-service";

export class SocketCore {
    protected socket?: Socket;
    public static host = "http://localhost:3000";

    constructor() {
        this.init();
    }

    init() {
        const configService = ConfigService.getInstance();
        const host = configService.baseServerUrl;

        this.socket = io(host);

        this.socket.emit("connectEcho");
    }
}
