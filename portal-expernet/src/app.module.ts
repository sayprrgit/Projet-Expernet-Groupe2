import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CanauxModule } from './canaux/canaux.module.js';
import { FormationsModule } from './formations/formations.module.js';
import { PlanningModule } from './planning/planning.module.js';
import { AuthModule } from './auth/auth.module.js';
import { GaliaModule } from './galia/galia.module.js';

@Module({
  imports: [PrismaModule, CanauxModule, FormationsModule, PlanningModule, AuthModule, GaliaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
