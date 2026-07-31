import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { PlayerLoginDto } from './dto/player-login.dto';
import { PlayerResponseDto } from './dto/player-response.dto';
import { AccessTokenResponseDto } from '../common/dto/access-token-response.dto';
import { PlayerAuthGuard } from './player-auth.guard';

// Note: there is deliberately no public "list all players" route here
// anymore. Admin already has GET /admin/players (in AdminController) for
// that — reusing it instead of adding a second near-identical endpoint
// avoids having two routes that do the same thing with different auth,
// which is exactly the kind of thing that's easy to accidentally leave
// unguarded later.
@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Post()
  @ApiCreatedResponse({ type: PlayerResponseDto })
  register(@Body() dto: CreatePlayerDto): Promise<PlayerResponseDto> {
    return this.playersService.create(dto);
  }

  @Post('login')
  @ApiOkResponse({ type: AccessTokenResponseDto })
  login(@Body() dto: PlayerLoginDto): Promise<AccessTokenResponseDto> {
    return this.playersService.login(dto.email, dto.password);
  }

  @UseGuards(PlayerAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOkResponse({ type: PlayerResponseDto })
  me(@Req() req: any): Promise<PlayerResponseDto> {
    // req.player was set by PlayerAuthGuard from the verified token — the
    // id in the URL is never trusted for "get my profile" routes, only
    // the id baked into the token the player logged in with.
    return this.playersService.findOwnProfile(req.player.sub);
  }
}
