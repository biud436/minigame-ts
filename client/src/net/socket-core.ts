import { io, Socket } from "socket.io-client";
import { ConfigService } from "../core/config-service";
import { GameObject } from "../core/interfaces/GameObject";
import { App } from "../main";

export type TickCallback = (data: any) => void;
export type Packet = {
    x: number;
    y: number;
    angle: number;
};
export type PacketData = {
    planetEarth: Packet;

    [key: string]: Packet;
};

export class SocketCore {
    protected socket?: Socket;
    private static INSTANCE: SocketCore;
    private observers: Map<string, TickCallback> = new Map();

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
        this.readPackets();
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

    onEvent(event: string, callback: any) {
        this.socket?.on(event, callback);
    }

    sendEvent(event: string, data: any) {
        this.socket?.emit(event, data);
    }

    /**
     * 받은 유닛 데이터를 각각의 게임 객체에 전달한다.
     */
    readPackets() {
        this.socket?.on("packet", (data: PacketData) => {
            this.observers.forEach((syncFunction, id) => {
                syncFunction(data[id]);
            });
        });
    }

    addObserver(id: string, callback: TickCallback) {
        this.observers.set(id, callback);
    }

    removeObserver(id: string) {
        this.observers.delete(id);
    }
}
