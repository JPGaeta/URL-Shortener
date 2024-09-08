import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { LinksService } from '../links/links.service';
import { LinksModule } from '../links/links.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;
  let linksService: LinksService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), UserModule, AuthModule, LinksModule],
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
    linksService = app.get<LinksService>(LinksService);
  });

  it('Should be defined', () => {
    expect(appController).toBeDefined();
    expect(linksService).toBeDefined();
  });

  describe('defaultRedirect', () => {
    it('Should return an object with url property set to /docs', async () => {
      expect(await appController.defaultRedirect()).toEqual({ url: '/docs' });
    });
  });

  describe('redirect', () => {
    it('Should return an object with url property set to /docs if link is not found', async () => {
      jest.spyOn(linksService, 'findLinkByShortUrl').mockResolvedValue(null);
      expect(await appController.redirect('shortUrl')).toEqual({
        url: '/docs',
      });
    });

    it('Should return an object with url property set to link.url if link is found', async () => {
      const link = { id: 'id', url: 'url', url_short: 'shortUrl' };
      jest
        .spyOn(linksService, 'findLinkByShortUrl')
        .mockResolvedValue(link as any);
      jest
        .spyOn(linksService, 'incrementLinkClicks')
        .mockResolvedValue(undefined);
      expect(await appController.redirect('shortUrl')).toEqual({
        url: link.url,
      });
    });
  });
});
