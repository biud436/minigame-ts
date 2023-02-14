import { INestApplication } from '@nestjs/common';
import { NestBootstrapApplication } from '../../main';

export abstract class INestBootstrapApplication {
    abstract initialize(): Promise<void>;
    abstract enableWebsocket(app: INestApplication): Promise<void>;
    abstract enableCors(): NestBootstrapApplication;
    abstract listen(): Promise<void>;
}
