import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { PrismaService } from '../database/prisma.service';
import { Link } from '.prisma/client';
import { v7 as uuidv7 } from 'uuid';
import { nanoid } from 'nanoid';

@Injectable()
export class LinksService {
  constructor(private prismaService: PrismaService) {}

  async findByUser(userId: string): Promise<Link[] | []> {
    const links = await this.prismaService.link.findMany({
      where: { userId, deletedAt: null },
    });
    return links;
  }

  async findOne(id: string): Promise<Link | null> {
    return await this.prismaService.link.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findLinkByShortUrl(shortUrl: string): Promise<Link | null> {
    const link = await this.prismaService.link.findFirst({
      where: { url_short: shortUrl, deletedAt: null },
    });

    if (!link) {
      return null;
    }

    return link;
  }

  async incrementLinkClicks(id: string) {
    await this.prismaService.link.update({
      data: { clicks: { increment: 1 } },
      where: { id, deletedAt: null },
    });
    return;
  }

  async create(
    createLinkDto: CreateLinkDto,
    userId: string | null,
  ): Promise<Link> {
    const id: string = uuidv7();
    let shortUrlCode: string;
    let hasLinkWithSameUrl: Link | null;

    do {
      shortUrlCode = nanoid(6);
      hasLinkWithSameUrl = await this.prismaService.link.findFirst({
        where: { url_short: shortUrlCode },
      });
    } while (hasLinkWithSameUrl);

    return this.prismaService.link.create({
      data: {
        id,
        url: createLinkDto.url,
        url_short: shortUrlCode,
        userId: userId,
      },
    });
  }

  async update(id: string, userId: string, updateLinkDto: UpdateLinkDto) {
    if (!(await this.isOwner(userId, id))) {
      throw new ForbiddenException();
    }

    if (!(await this.findOne(id))) {
      throw new NotFoundException();
    }

    const updatedLink = await this.prismaService.link.update({
      where: { id: id, deletedAt: null },
      data: { url: updateLinkDto.url },
    });

    return updatedLink;
  }

  async remove(id: string, userId: string): Promise<void> {
    if (!(await this.isOwner(userId, id))) {
      throw new ForbiddenException();
    }

    if (!(await this.findOne(id))) {
      throw new NotFoundException();
    }

    await this.prismaService.link.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return;
  }

  private async isOwner(userId: string, linkId: string) {
    const link = await this.prismaService.link.findFirst({
      where: { id: linkId },
    });
    return link?.userId === userId;
  }
}
