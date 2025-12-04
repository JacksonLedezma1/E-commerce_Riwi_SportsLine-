import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
//esta estrategia valida el access token
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_ACCESS!, //llave secreta para validar el token
        });
    }
    //Esto es lo que se inyecta luego en el @GetUser() decorator
    async validate(payload: any){
        return payload; //lo que retorna se guarda en request.user
    }
}

//NO se conecta a BD, solo valida el token