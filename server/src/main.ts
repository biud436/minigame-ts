import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './game/network/redis-io.adapter';
import { INestBootstrapApplication } from './common/interfaces/nest-bootstrap-application.interface';

export class NestBootstrapApplication extends INestBootstrapApplication {
    private static INSTANCE: NestBootstrapApplication;
    private application: INestApplication;

    private static PORT = 3000;

    private constructor() {
        super();
        this.initialize();
    }

    public static getInstance(): NestBootstrapApplication {
        if (!NestBootstrapApplication.INSTANCE) {
            NestBootstrapApplication.INSTANCE = new NestBootstrapApplication();
        }

        return NestBootstrapApplication.INSTANCE;
    }

    private enableSuperErrorHandling(): NestBootstrapApplication {
        process.on('uncaughtException', (err) => {
            console.log(err);
        });

        process.on('unhandledRejection', (err) => {
            console.log(err);
        });

        return this;
    }

    enableCors(): NestBootstrapApplication {
        if (!this.application) {
            return;
        }
        this.application.enableCors();
    }

    async initialize() {
        this.enableSuperErrorHandling();

        this.application = await NestFactory.create(AppModule);
        this.enableCors();
        await this.enableWebsocket(this.application);
        await this.listen();
    }

    async enableWebsocket(app: INestApplication): Promise<void> {
        const redisIoAdapter = new RedisIoAdapter(app);
        await redisIoAdapter.connectToRedis();

        app.useWebSocketAdapter(redisIoAdapter);
    }

    async listen(): Promise<void> {
        await this.application.listen(NestBootstrapApplication.PORT);
    }
}

NestBootstrapApplication.getInstance();
