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
import { PlanetEarth } from './dto/planet-earth';
interface IMessage {
    message: string;
}

@WebSocketGateway({ cors: true })
export class WebsocketsGateway
    implements
        OnGatewayInit,
        OnGatewayConnection,
        OnGatewayDisconnect,
        OnModuleDestroy
{
    private logger: Logger = new Logger(WebsocketsGateway.name);
    private planetEarth: PlanetEarth = new PlanetEarth();
    private intervalId: NodeJS.Timer;
    private TICK: number = 1000 / 60;

    private clients: Socket[] = [];

    @WebSocketServer()
    server: Server;

    constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

    afterInit(server: Server) {
        this.intervalId = setInterval(() => {
            this.planetEarth.updateAngle();
            this.server.emit('packet', {
                planetEarth: {
                    x: this.planetEarth.x,
                    y: this.planetEarth.y,
                    angle: this.planetEarth.angle,
                },
            });
        }, this.TICK);
    }

    // @Cron(CronExpression.EVERY_SECOND)
    // handleTicker() {
    //     this.planetEarth.updateAngle();
    //     this.server?.emit('packet', {
    //         planetEarth: {
    //             x: this.planetEarth.x,
    //             y: this.planetEarth.y,
    //             angle: this.planetEarth.angle,
    //         },
    //     });
    // }

    onModuleDestroy() {
        clearInterval(this.intervalId);
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
        // console.log('hello');
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

    // @SubscribeMessage('tick')
    // async onTick(@ConnectedSocket() client: Socket) {
    //     this.planetEarth.updateAngle();
    //     client.broadcast.emit('tick', JSON.stringify(this.planetEarth));
    // }

    @SubscribeMessage('pos:planet-earth')
    async onPosPlanetEarth(
        @MessageBody() data: any,
        @ConnectedSocket() client: Socket,
    ) {
        this.logger.debug('pos:planet-earth ' + JSON.stringify(data));
        client.broadcast.emit('pos:planet-earth', JSON.stringify(data));
    }
}
