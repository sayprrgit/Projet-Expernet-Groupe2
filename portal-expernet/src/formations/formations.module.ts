import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { FormationsController } from './formations.controller.js';
import { FormationsService } from './formations.service.js';

@Module({
  imports: [AuthModule],
  controllers: [FormationsController],
  providers: [FormationsService],
  exports: [FormationsService],
})
export class FormationsModule {}
