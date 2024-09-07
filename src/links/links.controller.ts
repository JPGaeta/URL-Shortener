import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { AuthGuard } from '../auth/auth.guard';
import { extractTokenFromHeader } from '../utils/auth.utils';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { Request } from 'express';
import { TJwtToken } from '../types/auth.types';

@Controller('links')
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/create')
  async create(@Req() request: Request, @Body() createLinkDto: CreateLinkDto) {
    let user: TJwtToken | null = null;
    const reqAuth = extractTokenFromHeader(request);

    if (reqAuth) {
      user = await this.jwtService.verifyAsync(reqAuth, {
        secret: jwtConstants.secret,
      });
    }

    const linkCreated = await this.linksService.create(
      createLinkDto,
      user?.userId ?? null,
    );

    const responseURL = `${process.env.BASE_DOMAIN}/${linkCreated.url_short}`;

    return responseURL;
  }

  @UseGuards(AuthGuard)
  @Get()
  findByUser(@Req() request: Request) {
    const user = request['user'] as TJwtToken;

    return this.linksService.findByUser(user.userId);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto,
  ) {
    const user = request['user'] as TJwtToken;

    return this.linksService.update(id, user.userId, updateLinkDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    const user = request['user'] as TJwtToken;

    return this.linksService.remove(id, user.userId);
  }
}
