import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { WebsocketsModule } from './common/micro-servers/websockets/websockets.module';
import { AuthModule } from './controllers/auth/auth.module';

@Module({
    imports: [WebsocketsModule, AuthModule, ScheduleModule.forRoot()],
    controllers: [AppController],
})
export class AppModule {}
