import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
