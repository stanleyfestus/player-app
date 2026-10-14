import { Injectable,  Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

     this.logger.log(`Admin login attempt: ${email}`);
    if (!adminEmail || !adminPasswordHash) {
      this.logger.error('ADMIN_EMAIL or ADMIN_PASSWORD_HASH is not set');

      throw new UnauthorizedException('Admin account not configured');
    }
    if (email !== adminEmail) {
      this.logger.warn(`Login failed: check email ${email}`);

      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, adminPasswordHash);
    if (!valid) {
      this.logger.warn(`Login failed: check password for ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    this.logger.log(`Login OK: ${email}`);
    const token = this.jwtService.sign({ role: 'admin', email });
    return { accessToken: token };
  }
}
