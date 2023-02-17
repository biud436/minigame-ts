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
import { Rooms } from './commands/rooms.command';
import { PlanetEarth } from '../units/planet-earth';
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
    ) {}

    afterInit(server: Server) {
        const intervalId = setInterval(() => {
            const packet = this.rooms.collectStaticPackets();
            this.server.emit('packet', packet);
        }, this.TICK);

        this.schedulerRegistry.addInterval('tick', intervalId);
    }

    onModuleDestroy() {
        this.schedulerRegistry.deleteInterval('tick');
    }

    handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        this.logger.log('connect ' + client.id);

        this.clients.push(client);
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        this.logger.log('disconnect ' + client.id);
        this.clients = this.clients.filter((c) => c.id !== client.id);
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

    @SubscribeMessage('message')
    async onMessage(
        @MessageBody() data: IMessage,
        @ConnectedSocket() client: Socket,
    ) {
        // 자신을 제외한 모든 클라이언트에 전송하기
        client.broadcast.emit(
            'message',
            JSON.stringify({ message: data.message }),
        );
    }

    @SubscribeMessage('pos:planet-earth')
    async onPosPlanetEarth(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        this.logger.debug('pos:planet-earth ' + JSON.stringify(data));
        client.broadcast.emit('pos:planet-earth', JSON.stringify(data));
    }
}
