import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { MyConfigService } from 'src/common/environment.template';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        configService: MyConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    if (req?.cookies?.access_token) {
                        return req?.cookies?.access_token;
                    }

                    return null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        return { user: payload.user, role: payload.role };
    }
}
