import { ConfigService } from '@nestjs/config';

export type TEnvironmentFile = {
    JWT_SECRET: string;
    JWT_SECRET_EXPIRATION_TIME: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
    APP_SECRET: string;
};

export type MyConfigService = ConfigService<
    {
        JWT_SECRET: string;
        JWT_SECRET_EXPIRATION_TIME: string;
        JWT_REFRESH_TOKEN_SECRET: string;
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: string;
        APP_SECRET: string;
    },
    true
>;
