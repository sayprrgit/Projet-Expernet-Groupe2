import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FormationsModule } from './formations/formations.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CanauxModule } from './canaux/canaux.module.js';

@Module({
  imports: [FormationsModule,PrismaModule, CanauxModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
