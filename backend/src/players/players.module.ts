import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { PlayerAuthGuard } from './player-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [PlayersController],
  providers: [PlayersService, PlayerAuthGuard],
  exports: [PlayersService],
})
export class PlayersModule {}
