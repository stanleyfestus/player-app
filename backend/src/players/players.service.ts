import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';

// Fields we NEVER want to send back to the browser, even by accident.
// Every method below runs its result through this before returning.
function sanitize<T extends { passwordHash?: string }>(player: T) {
  const { passwordHash, ...rest } = player;
  return rest;
}

@Injectable()
export class PlayersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(dto: CreatePlayerDto) {
    const existing = await this.prisma.player.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const { password, ...rest } = dto;
    const passwordHash = await bcrypt.hash(password, 10);

    const player = await this.prisma.player.create({
      data: { ...rest, passwordHash },
    });
    return sanitize(player);
  }

  // Used by the admin-only GET /admin/players route (AdminController).
  // There is no public equivalent — the player directory is admin-only.
  async findAll(status?: string) {
    const players = await this.prisma.player.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return players.map(sanitize);
  }

  async findOwnProfile(id: string) {
    const player = await this.prisma.player.findUnique({ where: { id } });
    if (!player) throw new NotFoundException('Player not found');
    return sanitize(player);
  }

  async updateStatus(id: string, status: string) {
    const player = await this.prisma.player.findUnique({ where: { id } });
    if (!player) throw new NotFoundException('Player not found');
    const updated = await this.prisma.player.update({
      where: { id },
      data: { status },
    });
    return sanitize(updated);
  }

  // Deliberately the SAME error for "no such email" and "wrong password" —
  // telling an attacker which one was wrong is a small but real information
  // leak (it confirms whether an email is registered at all).
  async login(email: string, password: string) {
    const player = await this.prisma.player.findUnique({ where: { email } });
    if (!player) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, player.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.jwtService.sign({
      role: 'player',
      sub: player.id,
      email: player.email,
    });
    return { accessToken };
  }
}
