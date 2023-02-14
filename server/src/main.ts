import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './common/micro-servers/websockets/redis-io.adapter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();

    app.enableCors();
    app.useWebSocketAdapter(redisIoAdapter);

    await app.listen(3000);
}
bootstrap();
