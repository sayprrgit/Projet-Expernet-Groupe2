import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import type { IdentifiantsDto } from './auth.service.js';
import type { UtilisateurConnecte } from './auth.types.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { UtilisateurActuel } from './utilisateur-actuel.decorator.js';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Connexion : renvoie un jeton JWT (valable 8 h) et le profil' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'motDePasse'],
      properties: {
        email: { type: 'string', example: 'lynho@exemple.re' },
        motDePasse: { type: 'string', example: 'Password123!' },
      },
    },
  })
  connexion(@Body() dto: IdentifiantsDto) {
    return this.auth.connexion(dto ?? {});
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Profil de l'utilisateur connecté" })
  profil(@UtilisateurActuel() utilisateur: UtilisateurConnecte) {
    return this.auth.profil(utilisateur.id);
  }
}
