import { Module } from '@nestjs/common';
import { CanauxController } from './canaux.controller.js';
import { CanauxService } from './canaux.service.js';

@Module({
  controllers: [CanauxController],
  providers: [CanauxService],
})
export class CanauxModule {}
