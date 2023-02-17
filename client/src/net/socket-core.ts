import { io, Socket } from "socket.io-client";
import { ConfigService } from "../core/config-service";
import { GameObject } from "../core/interfaces/game-object";
import { App } from "../core/app";

export type Packet = {
  x: number;
  y: number;
  angle: number;
};
export type PacketData = {
  planetEarth: Packet;
  serverTime: Packet;
  players: Packet[];
};
export type TickCallback<T = Packet> = (data: T) => void;

export class SocketCore {
  protected socket?: Socket;
  private static INSTANCE: SocketCore;
  private observers: Map<keyof PacketData, TickCallback> = new Map();

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
        if (id === "planetEarth") {
          syncFunction(data[id] as Packet);
        } else if (id === "serverTime") {
          const time = data[id].x;
          const d = new Date(time);

          App.getInstance().setServerTime(d);
        } else if (id === "players") {
          const players = data[id] as any;
          const items: any[] = [];

          const keys = Object.keys(players);

          keys.forEach((key) => {
            const player = players[key];

            items.push(player);
          });

          items.sort((a, b) => b.x - a.x);

          syncFunction(items[0]);
        }
      });
    });
  }

  addObserver<T = Packet>(id: keyof PacketData, callback: TickCallback<T>) {
    this.observers.set(id, callback as TickCallback);
  }

  removeObserver(id: keyof PacketData) {
    this.observers.delete(id);
  }
}
