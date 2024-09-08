import { Test, TestingModule } from '@nestjs/testing';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { JwtService } from '@nestjs/jwt';
import { Link } from '@prisma/client';
import { Request } from 'express';
import { PrismaModule } from '../database/prisma.module';

const link: Link = {
  id: 'link1',
  url: 'teste.com',
  url_short: 'aNj9s',
  clicks: 0,
  userId: '1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockRequestWithUser = {
  user: {
    userId: '1',
  },
  headers: {
    authorization: 'Bearer teste-0123',
  },
};

describe('LinksController', () => {
  let controller: LinksController;
  let linksService: LinksService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [LinksController],
      providers: [LinksService, JwtService],
    }).compile();

    controller = module.get<LinksController>(LinksController);
    linksService = module.get<LinksService>(LinksService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(linksService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('Create', () => {
    it('Should create a new link with bearer authentication', async () => {
      const createLinkDto = {
        url: 'https://teste.com',
        url_short: 'aNj9s',
      };

      const mockRequest = {
        headers: {
          authorization: 'Bearer teste-0123',
        },
      };

      jest.spyOn(linksService, 'create').mockResolvedValue(link);
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId: '1' });

      expect(
        await controller.create(mockRequest as Request, createLinkDto),
      ).toStrictEqual({ url: `${process.env.BASE_DOMAIN}/${link.url_short}` });
    });

    it('Should be return a new link without authentication', async () => {
      const createLinkDto = {
        url: 'https://teste.com',
        url_short: 'aNj9s',
      };

      const mockRequest = {
        headers: {},
      };

      jest.spyOn(linksService, 'create').mockResolvedValue(link);

      expect(
        await controller.create(mockRequest as Request, createLinkDto),
      ).toStrictEqual({ url: `${process.env.BASE_DOMAIN}/${link.url_short}` });
    });
  });

  describe('Get by user Id', () => {
    it('Should return all links from a user', async () => {
      jest.spyOn(linksService, 'findByUser').mockResolvedValue([link]);

      expect(
        await controller.findByUser(mockRequestWithUser as any),
      ).toStrictEqual([link]);
    });

    it('Should return an empty array when user does not have links', async () => {
      jest.spyOn(linksService, 'findByUser').mockResolvedValue([]);

      expect(
        await controller.findByUser(mockRequestWithUser as any),
      ).toStrictEqual([]);
    });
  });

  describe('Update', () => {
    it('Should update a link', async () => {
      const updateLinkDto = {
        url: 'teste.com',
      };

      jest.spyOn(linksService, 'update').mockResolvedValue(link);

      expect(
        await controller.update(
          mockRequestWithUser as any,
          { id: link.id },
          updateLinkDto,
        ),
      ).toEqual(link);
    });
  });

  describe('Remove', () => {
    it('Should remove a link', async () => {
      const spy = jest.spyOn(linksService, 'remove').mockResolvedValue();

      await controller.remove(mockRequestWithUser as any, { id: link.id });

      expect(spy).toHaveBeenCalledWith(
        link.id,
        mockRequestWithUser.user.userId,
      );
    });
  });
});
