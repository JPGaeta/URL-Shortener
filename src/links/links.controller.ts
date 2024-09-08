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
  HttpCode,
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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({
    summary: 'Create a new link',
    description:
      'Create a new link, if you are logged in (with JWT), the link will be associated with your account',
  })
  @ApiCreatedResponse({ description: 'Return the URL created' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @HttpCode(201)
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

    return { url: responseURL };
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all links created by the user',
    description: 'Get all links created by the user based on the JWT token',
  })
  @ApiOkResponse({ description: 'Return all links created by the user' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiUnauthorizedResponse({
    description: 'Need to pass a valid bearer JWT token',
  })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Get('/user')
  findByUser(@Req() request: Request) {
    const user = request['user'] as TJwtToken;

    return this.linksService.findByUser(user.userId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a link',
    description: 'Update a link by ID',
  })
  @ApiOkResponse({ description: 'Return the complete link' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiUnauthorizedResponse({
    description: "Tried to update a link that doesn't belong to user",
  })
  @ApiNotFoundResponse({ description: 'Link not found' })
  @HttpCode(200)
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

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a link',
    description: 'Delete a link by ID',
  })
  @ApiNoContentResponse({ description: 'Sucess to delete user link' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiUnauthorizedResponse({
    description: "Tried to delete a link that doesn't belong to user",
  })
  @ApiNotFoundResponse({ description: 'Link not found' })
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    const user = request['user'] as TJwtToken;

    return this.linksService.remove(id, user.userId);
  }
}
