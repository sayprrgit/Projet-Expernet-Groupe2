import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard.js';
import type { AuthenticatedUser } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { Roles } from '../auth/roles.decorator.js';
import { GaliaService } from './galia.service.js';

@ApiTags('Galia — Espace privé')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('galia')
export class GaliaController {
  constructor(private readonly galiaService: GaliaService) {}

  // ─────────────── Étudiant ───────────────

  @Get('emploi-du-temps')
  @Roles('ETUDIANT')
  @ApiOperation({ summary: "Emploi du temps de l'étudiant connecté" })
  getEmploiDuTemps(@CurrentUser() user: AuthenticatedUser) {
    return this.galiaService.getEmploiDuTemps(user.id);
  }

  @Get('mes-notes')
  @Roles('ETUDIANT')
  @ApiOperation({ summary: "Notes de l'étudiant connecté" })
  getMesNotes(@CurrentUser() user: AuthenticatedUser) {
    return this.galiaService.getMesNotes(user.id);
  }

  @Get('progression')
  @Roles('ETUDIANT')
  @ApiOperation({ summary: "Progression par compétence de l'étudiant connecté" })
  getMaProgression(@CurrentUser() user: AuthenticatedUser) {
    return this.galiaService.getMaProgression(user.id);
  }

  @Get('assiduite')
  @Roles('ETUDIANT')
  @ApiOperation({ summary: "Assiduité de l'étudiant connecté" })
  getAssiduite(@CurrentUser() user: AuthenticatedUser) {
    return this.galiaService.getAssiduite(user.id);
  }

  @Get('mes-absences')
  @Roles('ETUDIANT')
  @ApiOperation({ summary: "Absences de l'étudiant connecté" })
  getMesAbsences(@CurrentUser() user: AuthenticatedUser) {
    return this.galiaService.getMesAbsences(user.id);
  }

  @Get('ma-promotion')
  @Roles('ETUDIANT')
  @ApiOperation({ summary: "Promotion de l'étudiant connecté" })
  getMaPromotion(@CurrentUser() user: AuthenticatedUser) {
    return this.galiaService.getMaPromotion(user.id);
  }

  // ─────────────── Formateur ───────────────

  @Get('formateur/overview')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: 'Indicateurs globaux du formateur' })
  getFormateurOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.galiaService.getFormateurOverview(user.id, user.role);
  }

  @Get('formateur/promotions')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: 'Promotions suivies par le formateur' })
  getPromotions(@CurrentUser() user: AuthenticatedUser) {
    return this.galiaService.getPromotionsFormateur(user.id, user.role);
  }

  @Get('formateur/promotions/:id/etudiants')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: "Étudiants et statistiques d'une promotion" })
  getEtudiantsPromotion(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.galiaService.getEtudiantsPromotion(id, user.id, user.role);
  }

  @Get('formateur/promotions/:id/sessions')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: "Sessions d'une promotion" })
  getSessionsPromotion(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.galiaService.getSessionsPromotion(id, user.id, user.role);
  }

  @Get('formateur/promotions/:id/notes')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: "Notes d'une promotion" })
  getNotesPromotion(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.galiaService.getNotesPromotion(id, user.id, user.role);
  }

  @Get('formateur/promotions/:id/examens')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: "Examens d'une promotion" })
  getExamensPromotion(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.galiaService.getExamensPromotion(id, user.id, user.role);
  }

  @Get('formateur/promotions/:id/competences')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: "Compétences évaluables d'une promotion" })
  getCompetencesPromotion(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.galiaService.getCompetencesPromotion(id, user.id, user.role);
  }

  @Get('formateur/promotions/:id/stats')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: "Statistiques d'assiduité et de réussite d'une promotion" })
  getStatsPromotion(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.galiaService.getStatsPromotion(id, user.id, user.role);
  }

  @Get('formateur/sessions/:id/emargements')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: "Émargements d'une session" })
  getEmargementsSession(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.galiaService.getEmargementsSession(id, user.id, user.role);
  }

  @Post('formateur/sessions/:id/emargements')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: 'Marquer un étudiant présent ou absent' })
  setPresence(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { etudiantId: number; present: boolean },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.galiaService.setPresence(
      id,
      Number(body.etudiantId),
      Boolean(body.present),
      user.id,
      user.role,
    );
  }

  @Post('formateur/notes')
  @Roles('FORMATEUR', 'ADMIN')
  @ApiOperation({ summary: 'Saisir ou modifier une note' })
  saisirNote(
    @Body()
    body: {
      etudiantId: number;
      examenId: number;
      competenceId: number;
      valeur: number;
      appreciation?: string;
    },
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.galiaService.saisirNote(
      {
        etudiantId: Number(body.etudiantId),
        examenId: Number(body.examenId),
        competenceId: Number(body.competenceId),
        valeur: Number(body.valeur),
        appreciation: body.appreciation,
      },
      user.id,
      user.role,
    );
  }

  // ─────────────── Admin ───────────────

  @Get('admin/users')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Liste des utilisateurs' })
  getAllUsers() {
    return this.galiaService.getAllUsers();
  }

  @Post('admin/users')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Créer un utilisateur' })
  createUser(@Body() body: any) {
    return this.galiaService.createUser(body);
  }

  @Patch('admin/users/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Modifier un utilisateur' })
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.galiaService.updateUser(id, body);
  }

  @Delete('admin/users/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.galiaService.deleteUser(id);
  }

  @Get('admin/stats')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Indicateurs globaux du centre' })
  getAdminStats() {
    return this.galiaService.getAdminStats();
  }

  @Get('admin/candidatures')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Toutes les candidatures' })
  getCandidatures() {
    return this.galiaService.getCandidaturesAdmin();
  }

  @Patch('admin/candidatures/:id')
  @Roles('ADMIN')
  @ApiOperation({ summary: "Changer le statut d'une candidature" })
  updateCandidature(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE' },
  ) {
    return this.galiaService.updateCandidatureStatut(id, body.statut);
  }
}
