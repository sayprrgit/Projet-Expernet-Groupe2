import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: "Vérifie que l'API est en ligne" })
  @ApiResponse({ status: 200, description: 'Message de confirmation' })
  getHello(): string {
    return this.appService.getHello();
  }
}
