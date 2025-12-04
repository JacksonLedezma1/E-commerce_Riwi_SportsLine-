import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptionsWithRequest } from 'passport-jwt';

@Injectable()
//Estrategia para refrescar el
export class refreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(config: ConfigService){
        super(<StrategyOptionsWithRequest>{
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_REFRESH_SECRET'),
            passReqToCallback: true,
        });
    }

    validate( req: Request, payload: any){
        const token = req.get('authorization')?.replace('Bearer','').trim();

        return { ...payload, refreshToken: token };
    }
}