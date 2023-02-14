import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { WebsocketsModule } from './common/micro-servers/websockets/websockets.module';

@Module({
  imports: [WebsocketsModule],
  controllers: [AppController],
})
export class AppModule {}
