import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlanningService, PlanningEntryDto } from './planning.service.js';

@ApiTags('Planning')
@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Get()
  @ApiOperation({
    summary: 'Agenda public du centre',
    description: 'Rentrées, sessions Expernet Pro, journées portes ouvertes, ateliers et examens, classés par date.',
  })
  @ApiResponse({ status: 200, description: 'Liste des rendez-vous à venir et passés' })
  findAll(): Promise<PlanningEntryDto[]> {
    return this.planningService.findAll();
  }
}
