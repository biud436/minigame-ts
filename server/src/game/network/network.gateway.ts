/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger, OnModuleDestroy } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule/dist';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Rooms } from './core/rooms';
import { GameTransform } from '../units/interfaces/game-transform.interface';
import { Players } from '../units/players';
import { InjectNetworkModuleOptions } from './network.constant';
import { NetworkModuleOptions } from './network.module';

@WebSocketGateway({ cors: true })
export class NetworkService
    implements
        OnGatewayInit,
        OnGatewayConnection,
        OnGatewayDisconnect,
        OnModuleDestroy
{
    @WebSocketServer()
    server: Server;

    private static DEFAULT_TICK = 1000 / 60;
    private TICK: number = 1000 / 60;
    private clients: Socket[] = [];

    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly rooms: Rooms,
        private readonly players: Players,
        @InjectNetworkModuleOptions()
        private readonly options: NetworkModuleOptions,
    ) {}

    afterInit(server: Server) {
        this.TICK = this.options.ticker ?? NetworkService.DEFAULT_TICK;

        const intervalId = setInterval(() => {
            const packet = this.rooms
                .collectStaticPackets()
                .append('players', this.players.collectPackets());

            this.server.emit('packet', packet.toJSON());
        }, this.TICK);

        this.schedulerRegistry.addInterval('tick', intervalId);
    }

    onModuleDestroy() {
        this.schedulerRegistry.deleteInterval('tick');
    }

    handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        this.clients.push(client);
        this.players.add(client);
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.clients = this.clients.filter((c) => c.id !== client.id);
        this.players.remove(client.id);
    }

    /**
     * 서버와 클라이언트 소켓의 연결이 발생하면 호출되는 이벤트입니다.
     * 자신을 제외한 모든 클라이언트에게 메시지 전송
     * @param {Socket} client
     */
    @SubscribeMessage('connectEcho')
    async connect(@ConnectedSocket() client: Socket) {
        client.broadcast.emit('newMember', JSON.stringify({}));
    }

    @SubscribeMessage('sync')
    async onSync(
        @MessageBody() transform: GameTransform,
        @ConnectedSocket() client: Socket,
    ) {
        this.players.sync(client.id, transform);
    }
}
