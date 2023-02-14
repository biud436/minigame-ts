/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
}
