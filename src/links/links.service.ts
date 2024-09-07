import {
  Injectable,
  UnauthorizedException,
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
      where: { id },
    });
  }

  async create(
    createLinkDto: CreateLinkDto,
    userId: string | null,
  ): Promise<Link> {
    const id: string = uuidv7();
    const shortUrlCode: string = nanoid(6);

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
      throw new UnauthorizedException();
    }

    if (!this.findOne(id)) {
      throw new NotFoundException();
    }

    const updatedLink = await this.prismaService.link.update({
      where: { id: id },
      data: { url: updateLinkDto.url },
    });

    return updatedLink;
  }

  async remove(id: string, userId: string) {
    if (!(await this.isOwner(userId, id))) {
      throw new UnauthorizedException();
    }

    if (!this.findOne(id)) {
      throw new NotFoundException();
    }

    return await this.prismaService.link.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async isOwner(userId: string, linkId: string) {
    const link = await this.findOne(linkId);
    return link.userId === userId;
  }
}
