import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { FormationsService } from './formations.service.js';
import { CreateCandidatureDto } from './dto/candidature.dto.js';

@ApiTags('Formations & Candidatures')
@Controller('formations')
export class FormationsController {
  constructor(private readonly formationsService: FormationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Recherche et liste des formations avec filtres à facettes',
    description: 'Renvoie les formations Expernet et Expernet Campus filtrées par recherche, filière, niveau, type et éligibilité CPF.',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Recherche texte libre' })
  @ApiQuery({ name: 'category', required: false, description: 'Filière (dev, reseaux, marketing, data, management)' })
  @ApiQuery({ name: 'level', required: false, description: 'Niveau (bac+2, bac+3, bac+5, certification)' })
  @ApiQuery({ name: 'type', required: false, description: 'Type d’offre (campus, pro)' })
  @ApiQuery({ name: 'cpfOnly', required: false, type: Boolean, description: 'Filtrer sur les formations éligibles CPF' })
  @ApiQuery({ name: 'campus', required: false, description: 'Campus (Le Port)' })
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('type') type?: string,
    @Query('cpfOnly') cpfOnly?: string,
    @Query('campus') campus?: string,
  ) {
    return this.formationsService.findAll({
      search,
      category,
      level,
      type,
      cpfOnly: cpfOnly === 'true',
      campus,
    });
  }

  @Get('meta/categories')
  @ApiOperation({ summary: 'Résumé des filières, niveaux et statistiques' })
  getCategories() {
    return this.formationsService.getCategoriesSummary();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir la fiche descriptive complète d’une formation' })
  @ApiParam({ name: 'id', description: 'ID ou slug de la formation' })
  @ApiResponse({ status: 200, description: 'Fiche descriptive détaillée' })
  @ApiResponse({ status: 404, description: 'Formation introuvable' })
  findOne(@Param('id') id: string) {
    return this.formationsService.findOne(id);
  }

  @Post('candidature')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Soumettre une candidature ou demande de contact',
    description: 'Enregistre la candidature avec validation stricte des champs.',
  })
  @ApiResponse({ status: 201, description: 'Candidature reçue avec numéro de référence' })
  createCandidature(@Body() dto: CreateCandidatureDto) {
    return this.formationsService.createCandidature(dto);
  }
}
