import { Module } from '@nestjs/common';
import { Rooms } from './commands/rooms.command';
import { NetworkService } from './network.gateway';

@Module({
    providers: [NetworkService, Rooms],
})
export class NetworkModule {}
