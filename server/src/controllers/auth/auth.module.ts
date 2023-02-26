import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';

function isDelvelopment(): boolean {
    return process.env.NODE_ENV !== 'production';
}

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: isDelvelopment()
                ? process.platform === 'darwin'
                    ? '.mac.env'
                    : '.development.env'
                : '.env',
            isGlobal: true,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
