import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './game/network/redis-io.adapter';
import { INestBootstrapApplication } from './common/interfaces/nest-bootstrap-application.interface';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as passport from 'passport';
import { urlencoded, json } from 'express';
import * as cookieParser from 'cookie-parser';

const RedisStore = connectRedis(session);

export class NestBootstrapApplication extends INestBootstrapApplication {
    private static INSTANCE: NestBootstrapApplication;
    private application: NestExpressApplication;

    private static PORT = 3000;
    private static REDIS_HOST =
        process.platform === 'linux' ? 'redis' : 'localhost';
    private static REDIS_PORT = 6379;

    private static CONFIG: ConfigService;

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

    async initWithStickySession(
        app: NestExpressApplication,
    ): Promise<NestBootstrapApplication> {
        const redisStoreMiddleware = createClient({
            socket: {
                host: NestBootstrapApplication.REDIS_HOST,
                port: NestBootstrapApplication.REDIS_PORT,
            },
            legacyMode: true,
        });

        redisStoreMiddleware.connect().catch(console.error);

        app.use(
            session({
                secret: NestBootstrapApplication.CONFIG.getOrThrow(
                    'APP_SECRET',
                ),
                resave: false,
                saveUninitialized: false,
                store: new RedisStore({ client: redisStoreMiddleware }),
                cookie: {
                    httpOnly: true,
                    signed: true,
                    sameSite: 'none',
                    secure: process.env.NODE_ENV === 'production',
                },
            }),
        );

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(json({ limit: '50mb' }));
        app.use(urlencoded({ extended: true, limit: '50mb' }));
        app.use(cookieParser());

        return this;
    }

    async initialize() {
        this.enableSuperErrorHandling();

        this.application = await NestFactory.create<NestExpressApplication>(
            AppModule,
        );

        NestBootstrapApplication.CONFIG = <ConfigService>(
            await this.application.resolve<ConfigService>(ConfigService)
        );

        this.enableCors();
        await this.enableWebsocket(this.application);
        await this.initWithStickySession(this.application);
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
