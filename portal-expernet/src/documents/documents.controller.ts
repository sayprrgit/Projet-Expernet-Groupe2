import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { DocumentsService } from './documents.service.js';
import type { FichierTeleverse, TeleversementDto } from './documents.service.js';

const TAILLE_MAX = 10 * 1024 * 1024; // 10 Mo

@ApiTags('documents')
@ApiHeader({
  name: 'x-user-id',
  description: "Identifiant de l'utilisateur (temporaire, remplacé par le JWT quand le module auth sera prêt)",
  required: true,
})
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: "Liste des documents visibles par l'utilisateur" })
  @ApiQuery({ name: 'promotionId', required: false })
  @ApiQuery({ name: 'canalId', required: false })
  async lister(
    @Headers('x-user-id') userId: string | undefined,
    @Query('promotionId') promotionId?: string,
    @Query('canalId') canalId?: string,
  ) {
    const user = await this.documents.utilisateurDepuis(userId);
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
  async televerser(
    @Headers('x-user-id') userId: string | undefined,
    @UploadedFile() fichier: FichierTeleverse | undefined,
    @Body() dto: TeleversementDto,
  ) {
    const user = await this.documents.utilisateurDepuis(userId);
    return this.documents.televerser(user, fichier, dto);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Télécharger un document' })
  async telecharger(
    @Headers('x-user-id') userId: string | undefined,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const user = await this.documents.utilisateurDepuis(userId);
    const { chemin, nomFichier } = await this.documents.cheminPourTelechargement(user, id);
    res.download(chemin, nomFichier);
  }
}
