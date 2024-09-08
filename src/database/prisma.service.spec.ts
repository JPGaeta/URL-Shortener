import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should call $connect on module init', async () => {
    const connectSpy = jest
      .spyOn(service, '$connect')
      .mockImplementation(() => Promise.resolve());

    await service.onModuleInit();

    expect(connectSpy).toHaveBeenCalled();
  });
});
