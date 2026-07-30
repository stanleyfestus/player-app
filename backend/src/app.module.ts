import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PlayersModule } from './players/players.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, PlayersModule, AdminModule],
})
export class AppModule {}
