import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard.js';
import type { AuthenticatedUser } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { DocumentsService } from './documents.service.js';
import type { FichierTeleverse, TeleversementDto } from './documents.service.js';

const TAILLE_MAX = 10 * 1024 * 1024; // 10 Mo

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: "Liste des documents visibles par l'utilisateur connecté" })
  @ApiQuery({ name: 'promotionId', required: false })
  @ApiQuery({ name: 'canalId', required: false })
  lister(
    @CurrentUser() user: AuthenticatedUser,
    @Query('promotionId') promotionId?: string,
    @Query('canalId') canalId?: string,
  ) {
    return this.documents.lister(user, promotionId, canalId);
  }

  @Post()
  @ApiOperation({ summary: 'Déposer un document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'titre'],
      properties: {
        file: { type: 'string', format: 'binary' },
        titre: { type: 'string' },
        promotionId: { type: 'integer' },
        canalId: { type: 'integer' },
        visiblePar: { type: 'string', example: 'ADMIN,FORMATEUR,ETUDIANT' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: TAILLE_MAX } }))
  televerser(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() fichier: FichierTeleverse | undefined,
    @Body() dto: TeleversementDto,
  ) {
    return this.documents.televerser(user, fichier, dto);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Télécharger un document' })
  async telecharger(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { chemin, nomFichier } = await this.documents.cheminPourTelechargement(user, id);
    res.download(chemin, nomFichier);
  }
}
