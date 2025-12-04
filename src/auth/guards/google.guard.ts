import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }

  // Este método permite que Nest devuelva el redirect de Google
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      // Retorna null si aún no hay user (primer redirect)
      return null;
    }
    return user;
  }
}
