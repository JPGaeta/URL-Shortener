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
  HttpStatus,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto, UpdateLinkParamsDto } from './dto/update-link.dto';
import { AuthGuard } from '../auth/auth.guard';
import { extractTokenFromHeader } from '../utils/auth.utils';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { Request } from 'express';
import { TJwtToken } from '../types/auth.types';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DeleteLinkParamsDto } from './dto/delete-link.dto';
import { apiResponse } from '../utils/response.utils';

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new link',
    description: `Create a new link. If you are logged in, the link will be associated with your account
      
      NOTE: This endpoint is documented with JWT authentication due to Swagger's limitations in supporting optional authentication.
      Although the authentication is optional for this endpoint, it is mandatory for subsequent routes to access the data.`,
  })
  @ApiCreatedResponse({ description: 'Return the URL created' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @HttpCode(HttpStatus.CREATED)
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

    return apiResponse(HttpStatus.CREATED, linkCreated, [
      { message: 'URL created', property: 'url' },
    ]);
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
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/user')
  async findByUser(@Req() request: Request) {
    const user = request['user'] as TJwtToken;

    const userLinks = await this.linksService.findByUser(user.userId);

    return apiResponse(HttpStatus.OK, userLinks);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a link',
    description: 'Update a link by ID',
  })
  @ApiOkResponse({ description: 'Return the complete link' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiForbiddenResponse({
    description: "Tried to update a link that doesn't belong to user",
  })
  @ApiNotFoundResponse({ description: 'Link not found' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Req() request: Request,
    @Param() params: UpdateLinkParamsDto,
    @Body() updateLinkDto: UpdateLinkDto,
  ) {
    const user = request['user'] as TJwtToken;

    const userUpdated = await this.linksService.update(
      params.id,
      user.userId,
      updateLinkDto,
    );

    return apiResponse(HttpStatus.OK, userUpdated, [
      { message: 'Link updated', property: 'link' },
    ]);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a link',
    description: 'Delete a link by ID',
  })
  @ApiNoContentResponse({ description: 'Sucess to delete user link' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiForbiddenResponse({
    description: "Tried to delete a link that doesn't belong to user",
  })
  @ApiNotFoundResponse({ description: 'Link not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Req() request: Request, @Param() params: DeleteLinkParamsDto) {
    const user = request['user'] as TJwtToken;

    await this.linksService.remove(params.id, user.userId);

    return apiResponse(HttpStatus.NO_CONTENT);
  }
}
