/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebsocketsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        //
    }

    handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
        console.log('connect ' + client.id);
    }

    handleDisconnect(@ConnectedSocket() client: Socket) {
        //
    }

    /**
     * 서버와 클라이언트 소켓의 연결이 발생하면 호출되는 이벤트입니다.
     * 자신을 제외한 모든 클라이언트에게 메시지 전송
     * @param client
     */
    @SubscribeMessage('connect')
    async connect(@ConnectedSocket() client: Socket) {
        client.broadcast.emit(
            'newMember',
            JSON.stringify({
                id: client.id,
            }),
        );
    }
}
