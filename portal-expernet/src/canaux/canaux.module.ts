import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { CanauxController } from './canaux.controller.js';
import { CanauxService } from './canaux.service.js';

@Module({
  imports: [AuthModule],
  controllers: [CanauxController],
  providers: [CanauxService],
})
export class CanauxModule {}
