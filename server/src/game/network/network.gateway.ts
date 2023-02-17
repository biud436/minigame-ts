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
import { PlanetEarth } from '../units/planet-earth';
import { GameTransform } from '../units/interfaces/game-transform.interface';
import { Players } from '../units/players';
interface IMessage {
    message: string;
}

@WebSocketGateway({ cors: true })
export class NetworkService
    implements
        OnGatewayInit,
        OnGatewayConnection,
        OnGatewayDisconnect,
        OnModuleDestroy
{
    private logger: Logger = new Logger(NetworkService.name);

    private TICK: number = 1000 / 60;

    private clients: Socket[] = [];

    @WebSocketServer()
    server: Server;

    constructor(
        private readonly schedulerRegistry: SchedulerRegistry,
        private readonly rooms: Rooms,
        private readonly players: Players,
    ) {}

    afterInit(server: Server) {
        const intervalId = setInterval(() => {
            const packet = this.rooms
                .collectStaticPackets()
                .append(this.players.collectPackets());

            this.server.emit('packet', packet.toJSON());
        }, this.TICK);

        this.schedulerRegistry.addInterval('tick', intervalId);
    }

    onModuleDestroy() {
        this.schedulerRegistry.deleteInterval('tick');
    }

    handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        this.logger.log('connect ' + client.id);

        this.clients.push(client);
        this.players.add(client);
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.logger.log('disconnect ' + client.id);
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
