import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('canaux')
export class CanauxController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  lister() {
    return this.prisma.canal.findMany({
      select: { id: true, nom: true, promotionId: true },
      orderBy: { id: 'asc' },
    });
  }
}
