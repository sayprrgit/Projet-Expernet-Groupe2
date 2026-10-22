import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FormationsModule } from './formations/formations.module.js';

@Module({
  imports: [FormationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
