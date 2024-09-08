import { Controller, Get, Param, Redirect } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LinksService } from '../links/links.service';

@ApiTags('Redirect')
@Controller('')
export class AppController {
  constructor(private readonly linksService: LinksService) {}

  @ApiExcludeEndpoint()
  @Get()
  async defaultRedirect() {
    return {
      message:
        'Welcome to the URL shortener API. Please check the documentation at /docs',
    };
  }

  @ApiOperation({
    summary: 'Redirect to the destination URL',
    description: `Redirect to the destination URL based on the short URL and add a click to the link.
    
    NOTE: This endpoint doesn't work if tested on Swagger UI, because it's a redirect endpoint.
    Please try it out by the browser.
    `,
  })
  @ApiOkResponse({ description: 'Redirect to the destination URL' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Redirect()
  @Get('/:shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string) {
    const link = await this.linksService.findLinkByShortUrl(shortUrl);

    if (link) {
      await this.linksService.incrementLinkClicks(link.id);
      return { url: link.url };
    }

    return { url: '/docs' };
  }
}
