import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
//Guard es un middleware que protege las rutas, por ende si el guard falla no pasa al controller
export class JwtAuthGuard extends AuthGuard('jwt'){}