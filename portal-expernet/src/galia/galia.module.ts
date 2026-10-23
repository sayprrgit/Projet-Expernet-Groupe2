import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { GaliaController } from './galia.controller.js';
import { GaliaService } from './galia.service.js';

@Module({
  imports: [AuthModule],
  controllers: [GaliaController],
  providers: [GaliaService],
  exports: [GaliaService],
})
export class GaliaModule {}
