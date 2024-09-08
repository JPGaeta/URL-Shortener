import { Test, TestingModule } from '@nestjs/testing';
import { LinksService } from './links.service';
import { PrismaService } from '../database/prisma.service';
import { Link, User } from '@prisma/client';

const user: User = {
  id: '1',
  email: 'test@test.com',
  password: 'password',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

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

describe('LinksService', () => {
  let service: LinksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinksService, PrismaService],
    }).compile();

    service = module.get<LinksService>(LinksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(prismaService).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('Find by user', () => {
    it('Should find links by user id', async () => {
      const result: Link[] = [
        {
          id: 'link1',
          url: 'teste.com',
          url_short: 'aNj9s',
          clicks: 0,
          userId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 'link2',
          url: 'teste.com',
          url_short: 'aNj9s',
          clicks: 0,
          userId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      jest.spyOn(prismaService.link, 'findMany').mockResolvedValue(result);

      expect(await service.findByUser(user.id)).toEqual(result);
    });

    it('Should return a empty array when user does not have links', async () => {
      const result: Link[] = [];

      jest.spyOn(prismaService.link, 'findMany').mockResolvedValue([]);

      expect(await service.findByUser(user.id)).toEqual(result);
    });
  });

  describe('Find one', () => {
    it('Should find one link by id', async () => {
      jest.spyOn(prismaService.link, 'findUnique').mockResolvedValue(link);

      expect(await service.findOne(link.id)).toEqual(link);
    });

    it('Should return null when link does not exist', async () => {
      jest.spyOn(prismaService.link, 'findUnique').mockResolvedValue(null);

      expect(await service.findOne('1')).toBeNull();
    });
  });

  describe('Create', () => {
    it('Should create a link linked with a user', async () => {
      const createLinkDto = {
        url: 'teste.com',
      };

      jest.spyOn(prismaService.link, 'create').mockResolvedValue(link);

      expect(await service.create(createLinkDto, user.id)).toEqual({
        ...link,
        url_short: `${process.env.BASE_DOMAIN}/${link.url_short}`,
      });
    });

    it('Should create a link without a user', async () => {
      const createLinkDto = {
        url: 'teste.com',
      };
      const link: Link = {
        id: 'link1',
        url: 'teste.com',
        url_short: 'aNj9s',
        clicks: 0,
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(prismaService.link, 'create').mockResolvedValue(link);

      expect(await service.create(createLinkDto, null)).toEqual({
        ...link,
        url_short: `${process.env.BASE_DOMAIN}/${link.url_short}`,
      });
    });
  });

  describe('Update', () => {
    it('Should update a link', async () => {
      const updateLinkDto = {
        url: 'teste.com',
      };

      jest.spyOn(prismaService.link, 'update').mockResolvedValue(link);
      jest.spyOn(prismaService.link, 'findUnique').mockResolvedValue(link);

      expect(await service.update(link.id, user.id, updateLinkDto)).toEqual({
        ...link,
        url_short: `${process.env.BASE_DOMAIN}/${link.url_short}`,
      });
    });

    it('Should throw an error if user is not the owner', async () => {
      const updateLinkDto = {
        url: 'teste.com',
      };

      const link: Link = {
        id: 'link2',
        url: 'teste2.com',
        url_short: 'aNj9s',
        clicks: 0,
        userId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(prismaService.link, 'update').mockResolvedValue(link);
      jest.spyOn(prismaService.link, 'findUnique').mockResolvedValue(link);

      await expect(
        service.update(link.id, user.id, updateLinkDto),
      ).rejects.toThrow();
    });

    it('Should throw an error if link does not exist', async () => {
      const updateLinkDto = {
        url: 'teste.com',
      };

      jest.spyOn(prismaService.link, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('1', user.id, updateLinkDto),
      ).rejects.toThrow();
    });
  });

  describe('Remove', () => {
    it('Should remove a link', async () => {
      jest.spyOn(prismaService.link, 'update').mockResolvedValue(link);
      jest.spyOn(prismaService.link, 'findUnique').mockResolvedValue(link);

      await expect(service.remove(link.id, user.id)).resolves.toEqual(
        undefined,
      );
    });

    it('Should throw an error if user is not the owner', async () => {
      const link: Link = {
        id: 'link2',
        url: 'teste.com',
        url_short: 'aNj9s',
        clicks: 0,
        userId: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(prismaService.link, 'update').mockResolvedValue(link);
      jest.spyOn(prismaService.link, 'findUnique').mockResolvedValue(link);

      await expect(service.remove(link.id, user.id)).rejects.toThrow();
    });

    it('Should throw an error if link does not exist', async () => {
      jest.spyOn(prismaService.link, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('1', user.id)).rejects.toThrow();
    });
  });
});
