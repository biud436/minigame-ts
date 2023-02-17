import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { NetworkModule } from './game/network/network.module';
import { AuthModule } from './controllers/auth/auth.module';

@Module({
    imports: [NetworkModule, AuthModule, ScheduleModule.forRoot()],
    controllers: [AppController],
})
export class AppModule {}
