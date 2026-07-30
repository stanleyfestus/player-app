import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';
import { AdminAuthGuard } from './auth.guard';
import { PlayersService } from '../players/players.service';
import { UpdatePlayerStatusDto } from '../players/dto/update-player-status.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private playersService: PlayersService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.adminService.login(dto.email, dto.password);
  }

  @UseGuards(AdminAuthGuard)
  @Get('players')
  listPlayers(@Query('status') status?: string) {
    return this.playersService.findAll(status);
  }

  @UseGuards(AdminAuthGuard)
  @Patch('players/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePlayerStatusDto) {
    return this.playersService.updateStatus(id, dto.status);
  }
}
