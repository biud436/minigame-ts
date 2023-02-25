import { DynamicModule, Module } from '@nestjs/common';
import { Players } from '../units/players';
import { Rooms } from './core/rooms';
import { NETWORK_MODULE_OPTIONS } from './network.constant';
import { NetworkService } from './network.gateway';

export interface NetworkModuleOptions {
    ticker: number;
}

@Module({
    providers: [NetworkService, Rooms, Players],
})
export class NetworkModule {
    static register(options: NetworkModuleOptions): DynamicModule {
        return {
            module: NetworkModule,
            providers: [
                {
                    provide: NETWORK_MODULE_OPTIONS,
                    useFactory: () => options,
                },
            ],
        };
    }
}
