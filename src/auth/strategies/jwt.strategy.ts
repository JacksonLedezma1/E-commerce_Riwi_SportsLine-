import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
//esta estrategia valida el access token
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(config: ConfigService){

        const secret = config.get<string>('JWT_SECRET');
    
        if (!secret) {
            throw new Error('JWT_SECRET is not defined in the environment configuration');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        });
    }

    async validate(payload: any){
        return payload; //Payload returns {sub: userId, email, role} que se inyecta en el req.user
    }
}