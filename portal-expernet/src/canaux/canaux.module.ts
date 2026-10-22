import { Module } from '@nestjs/common';
import { CanauxController } from './canaux.controller.js';

@Module({
  controllers: [CanauxController],
})
export class CanauxModule {}
