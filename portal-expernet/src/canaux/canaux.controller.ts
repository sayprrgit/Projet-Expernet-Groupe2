import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { UtilisateurConnecte } from '../auth/auth.types.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { UtilisateurActuel } from '../auth/utilisateur-actuel.decorator.js';
import { CanauxService } from './canaux.service.js';
import type { NouveauMessageDto } from './canaux.service.js';

@ApiTags('Canaux')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('canaux')
export class CanauxController {
  constructor(private readonly canaux: CanauxService) {}

  @Get()
  @ApiOperation({ summary: "Canaux accessibles à l'utilisateur connecté" })
  lister(@UtilisateurActuel() user: UtilisateurConnecte) {
    return this.canaux.lister(user);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: "Historique des messages d'un canal (200 derniers)" })
  messages(@UtilisateurActuel() user: UtilisateurConnecte, @Param('id', ParseIntPipe) id: number) {
    return this.canaux.messages(user, id);
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Envoyer un message (parentId pour répondre dans un fil)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['contenu'],
      properties: {
        contenu: { type: 'string', example: 'Bonjour à tous !' },
        parentId: { type: 'integer', nullable: true },
      },
    },
  })
  envoyer(
    @UtilisateurActuel() user: UtilisateurConnecte,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: NouveauMessageDto,
  ) {
    return this.canaux.envoyer(user, id, dto ?? {});
  }
}
