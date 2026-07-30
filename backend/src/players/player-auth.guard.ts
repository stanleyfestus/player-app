import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Same shape as the admin guard, but it insists the token's role is
// 'player'. This is what stops an admin token (or a forged/expired one)
// from being used to read someone's "my profile" route, and — just as
// importantly — stops a *player's* token from ever being accepted on an
// admin-only route, since that guard checks the opposite role.
@Injectable()
export class PlayerAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Missing token');

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify(token);
      if (payload.role !== 'player') {
        throw new UnauthorizedException('Not a player token');
      }
      // Downstream handlers read request.player.sub to know WHICH player
      // is making the request — this is how "give me only my own profile"
      // is enforced, instead of trusting an id the client could send.
      request.player = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
