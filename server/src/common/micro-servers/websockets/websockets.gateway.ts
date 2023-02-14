/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
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
interface IMessage {
    message: string;
}

@WebSocketGateway({ cors: true })
export class WebsocketsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private logger: Logger = new Logger(WebsocketsGateway.name);

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        //
    }

    handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        this.logger.log('connect ' + client.id);
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        //
    }

    /**
     * 서버와 클라이언트 소켓의 연결이 발생하면 호출되는 이벤트입니다.
     * 자신을 제외한 모든 클라이언트에게 메시지 전송
     * @param {Socket} client
     */
    @SubscribeMessage('connectEcho')
    async connect(@ConnectedSocket() client: Socket) {
        console.log('hello');
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
}
