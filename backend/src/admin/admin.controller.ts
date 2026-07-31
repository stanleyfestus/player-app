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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { LoginDto } from './dto/login.dto';
import { AdminAuthGuard } from './auth.guard';
import { PlayersService } from '../players/players.service';
import { UpdatePlayerStatusDto } from '../players/dto/update-player-status.dto';
import { PlayerResponseDto } from '../players/dto/player-response.dto';
import { AccessTokenResponseDto } from '../common/dto/access-token-response.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private playersService: PlayersService,
  ) {}

  @Post('login')
  @ApiOkResponse({ type: AccessTokenResponseDto })
  login(@Body() dto: LoginDto): Promise<AccessTokenResponseDto> {
    return this.adminService.login(dto.email, dto.password);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Get('players')
  @ApiOkResponse({ type: [PlayerResponseDto] })
  listPlayers(@Query('status') status?: string): Promise<PlayerResponseDto[]> {
    return this.playersService.findAll(status);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @Patch('players/:id/status')
  @ApiOkResponse({ type: PlayerResponseDto })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePlayerStatusDto,
  ): Promise<PlayerResponseDto> {
    return this.playersService.updateStatus(id, dto.status);
  }
}
