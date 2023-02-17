import { Module } from '@nestjs/common';
import { Players } from '../units/players';
import { Rooms } from './core/rooms';
import { NetworkService } from './network.gateway';

@Module({
    providers: [NetworkService, Rooms, Players],
})
export class NetworkModule {}
