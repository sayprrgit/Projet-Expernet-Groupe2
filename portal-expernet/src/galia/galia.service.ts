import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Role } from '../generated/prisma/client.js';
import type { Prisma } from '../generated/prisma/client.js';

const SAFE_USER_SELECT = {
  id: true,
  email: true,
  nom: true,
  prenom: true,
  role: true,
  telephone: true,
  adresse: true,
  ville: true,
  codePostal: true,
  mfaEnabled: true,
  createdAt: true,
  updatedAt: true,
} as const;

function round(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function niveauPour(valeur: number): 'ACQUIS' | 'EN_COURS' | 'NON_ACQUIS' {
  if (valeur >= 14) return 'ACQUIS';
  if (valeur >= 10) return 'EN_COURS';
  return 'NON_ACQUIS';
}

function empreintePresence(sessionId: number, etudiantId: number): string {
  return createHash('sha256').update(`presence|${sessionId}|${etudiantId}`).digest('hex');
}

@Injectable()
export class GaliaService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────── Étudiant ───────────────────────────

  private async promotionIdsForEtudiant(etudiantId: number): Promise<number[]> {
    const inscriptions = await this.prisma.inscription.findMany({
      where: { etudiantId },
      select: { promotionId: true },
    });
    return inscriptions.map((i) => i.promotionId);
  }

  async getMaPromotion(etudiantId: number) {
    const inscription = await this.prisma.inscription.findFirst({
      where: { etudiantId },
      include: {
        promotion: {
          include: {
            formation: true,
            formateur: { select: SAFE_USER_SELECT },
          },
        },
      },
      orderBy: { id: 'asc' },
    });
    return inscription?.promotion ?? null;
  }

  async getEmploiDuTemps(etudiantId: number) {
    const promotionIds = await this.promotionIdsForEtudiant(etudiantId);
    if (!promotionIds.length) return [];

    return this.prisma.session.findMany({
      where: { promotionId: { in: promotionIds } },
      include: {
        promotion: {
          include: {
            formation: true,
            formateur: { select: SAFE_USER_SELECT },
          },
        },
      },
      orderBy: { debut: 'asc' },
    });
  }

  private noteDto(evaluation: any) {
    return {
      id: evaluation.id,
      etudiantId: evaluation.etudiantId,
      examenId: evaluation.examenId,
      competenceId: evaluation.competenceId,
      valeur: evaluation.valeur,
      appreciation: evaluation.commentaire ?? null,
      niveau: evaluation.niveau,
      createdAt: evaluation.createdAt,
      updatedAt: evaluation.updatedAt,
      etudiant: evaluation.etudiant ?? undefined,
      examen: evaluation.examen ?? undefined,
      competence: evaluation.competence ?? undefined,
    };
  }

  private emargementDto(emargement: any) {
    return { ...emargement, present: true };
  }

  async getMesNotes(etudiantId: number) {
    const evaluations = await this.prisma.evaluation.findMany({
      where: { etudiantId, valeur: { not: null } },
      include: { examen: true, competence: true },
      orderBy: { updatedAt: 'desc' },
    });
    return evaluations.map((e) => this.noteDto(e));
  }

  async getMaProgression(etudiantId: number) {
    const evaluations = await this.prisma.evaluation.findMany({
      where: { etudiantId },
      include: { competence: true, examen: true },
      orderBy: { updatedAt: 'desc' },
    });

    const latestByCompetence = new Map<number, (typeof evaluations)[number]>();
    for (const evaluation of evaluations) {
      if (!latestByCompetence.has(evaluation.competenceId)) {
        latestByCompetence.set(evaluation.competenceId, evaluation);
      }
    }

    const competences = [...latestByCompetence.values()].map((evaluation) => ({
      id: evaluation.competence.id,
      code: evaluation.competence.code,
      libelle: evaluation.competence.libelle,
      niveau: evaluation.niveau,
      valeur: evaluation.valeur,
      examen: evaluation.examen?.intitule ?? null,
    }));

    return {
      competences,
      acquis: competences.filter((c) => c.niveau === 'ACQUIS').length,
      enCours: competences.filter((c) => c.niveau === 'EN_COURS').length,
      nonAcquis: competences.filter((c) => c.niveau === 'NON_ACQUIS').length,
      moyenne:
        evaluations.filter((e) => e.valeur !== null).length > 0
          ? round(
              evaluations
                .filter((e) => e.valeur !== null)
                .reduce((sum, e) => sum + (e.valeur ?? 0), 0) /
                evaluations.filter((e) => e.valeur !== null).length,
            )
          : null,
    };
  }

  async getAssiduite(etudiantId: number) {
    const promotionIds = await this.promotionIdsForEtudiant(etudiantId);
    if (!promotionIds.length) {
      return { totalSessions: 0, presences: 0, absences: 0, tauxPresence: null };
    }

    const now = new Date();
    const sessions = await this.prisma.session.findMany({
      where: { promotionId: { in: promotionIds }, fin: { lt: now } },
      select: { id: true },
    });
    const sessionIds = sessions.map((s) => s.id);

    const presences = sessionIds.length
      ? await this.prisma.emargement.count({
          where: { etudiantId, sessionId: { in: sessionIds } },
        })
      : 0;

    const totalSessions = sessionIds.length;
    return {
      totalSessions,
      presences,
      absences: Math.max(0, totalSessions - presences),
      tauxPresence: totalSessions ? round((presences / totalSessions) * 100) : null,
    };
  }

  async getMesAbsences(etudiantId: number) {
    const promotionIds = await this.promotionIdsForEtudiant(etudiantId);
    if (!promotionIds.length) return [];

    const now = new Date();
    const sessions = await this.prisma.session.findMany({
      where: { promotionId: { in: promotionIds }, fin: { lt: now } },
      include: { promotion: { include: { formation: true } } },
      orderBy: { debut: 'desc' },
    });

    const signed = await this.prisma.emargement.findMany({
      where: { etudiantId, sessionId: { in: sessions.map((s) => s.id) } },
      select: { sessionId: true },
    });
    const signedSessionIds = new Set(signed.map((s) => s.sessionId));

    return sessions
      .filter((session) => !signedSessionIds.has(session.id))
      .map((session) => ({
        id: `absence-${session.id}`,
        etudiantId,
        sessionId: session.id,
        justifiee: false,
        motif: null,
        createdAt: session.fin,
        session,
      }));
  }

  // ─────────────────────────── Formateur ───────────────────────────

  private async getPromotionAccessible(promotionId: number, userId: number, role: Role) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id: promotionId },
      include: { formation: true },
    });
    if (!promotion) throw new NotFoundException('Promotion introuvable.');
    if (role !== 'ADMIN' && promotion.formateurId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas le formateur de cette promotion.");
    }
    return promotion;
  }

  async getPromotionsFormateur(userId: number, role: Role) {
    const where: Prisma.PromotionWhereInput = role === 'ADMIN' ? {} : { formateurId: userId };
    return this.prisma.promotion.findMany({
      where,
      include: {
        formation: true,
        formateur: { select: SAFE_USER_SELECT },
        _count: { select: { inscriptions: true, sessions: true } },
      },
      orderBy: { dateDebut: 'desc' },
    });
  }

  private async promotionStudentIds(promotionId: number): Promise<number[]> {
    const inscriptions = await this.prisma.inscription.findMany({
      where: { promotionId },
      select: { etudiantId: true },
    });
    return inscriptions.map((i) => i.etudiantId);
  }

  async getEtudiantsPromotion(promotionId: number, userId: number, role: Role) {
    await this.getPromotionAccessible(promotionId, userId, role);

    const inscriptions = await this.prisma.inscription.findMany({
      where: { promotionId },
      include: { etudiant: { select: SAFE_USER_SELECT } },
      orderBy: { id: 'asc' },
    });
    const etudiantIds = inscriptions.map((i) => i.etudiantId);
    if (!etudiantIds.length) return [];

    const now = new Date();
    const sessions = await this.prisma.session.findMany({
      where: { promotionId, fin: { lt: now } },
      select: { id: true },
    });
    const sessionIds = sessions.map((s) => s.id);

    const emargements = sessionIds.length
      ? await this.prisma.emargement.findMany({
          where: { sessionId: { in: sessionIds }, etudiantId: { in: etudiantIds } },
          select: { etudiantId: true },
        })
      : [];

    const evaluations = await this.prisma.evaluation.findMany({
      where: { etudiantId: { in: etudiantIds } },
      select: { etudiantId: true, valeur: true, niveau: true },
    });

    return inscriptions.map(({ etudiant }) => {
      const presences = emargements.filter((e) => e.etudiantId === etudiant.id).length;
      const notes = evaluations.filter(
        (e) => e.etudiantId === etudiant.id && e.valeur !== null,
      );
      const mine = evaluations.filter((e) => e.etudiantId === etudiant.id);
      return {
        ...etudiant,
        totalSessions: sessionIds.length,
        presences,
        absences: Math.max(0, sessionIds.length - presences),
        tauxPresence: sessionIds.length ? round((presences / sessionIds.length) * 100) : null,
        moyenne: notes.length
          ? round(notes.reduce((sum, n) => sum + (n.valeur ?? 0), 0) / notes.length)
          : null,
        notesCount: notes.length,
        progression: {
          acquis: mine.filter((e) => e.niveau === 'ACQUIS').length,
          enCours: mine.filter((e) => e.niveau === 'EN_COURS').length,
          nonAcquis: mine.filter((e) => e.niveau === 'NON_ACQUIS').length,
        },
      };
    });
  }

  async getSessionsPromotion(promotionId: number, userId: number, role: Role) {
    await this.getPromotionAccessible(promotionId, userId, role);
    const sessions = await this.prisma.session.findMany({
      where: { promotionId },
      include: {
        emargements: { include: { etudiant: { select: SAFE_USER_SELECT } } },
      },
      orderBy: { debut: 'desc' },
    });
    return sessions.map((session) => ({
      ...session,
      emargements: session.emargements.map((e) => this.emargementDto(e)),
    }));
  }

  async getEmargementsSession(sessionId: number, userId: number, role: Role) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session introuvable.');
    await this.getPromotionAccessible(session.promotionId, userId, role);

    const emargements = await this.prisma.emargement.findMany({
      where: { sessionId },
      include: { etudiant: { select: SAFE_USER_SELECT } },
      orderBy: { signeLe: 'asc' },
    });
    return emargements.map((e) => this.emargementDto(e));
  }

  async setPresence(
    sessionId: number,
    etudiantId: number,
    present: boolean,
    userId: number,
    role: Role,
  ) {
    const session = await this.prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) throw new NotFoundException('Session introuvable.');
    await this.getPromotionAccessible(session.promotionId, userId, role);

    const inscription = await this.prisma.inscription.findUnique({
      where: { promotionId_etudiantId: { promotionId: session.promotionId, etudiantId } },
    });
    if (!inscription) {
      throw new BadRequestException("Cet étudiant n'est pas inscrit à cette promotion.");
    }

    if (present) {
      const now = new Date();
      await this.prisma.emargement.upsert({
        where: { sessionId_etudiantId: { sessionId, etudiantId } },
        update: {},
        create: {
          sessionId,
          etudiantId,
          signature: 'presence-formateur',
          signeLe: now,
          empreinte: empreintePresence(sessionId, etudiantId),
        },
      });
    } else {
      await this.prisma.emargement.deleteMany({ where: { sessionId, etudiantId } });
    }

    return { sessionId, etudiantId, present };
  }

  async getNotesPromotion(promotionId: number, userId: number, role: Role) {
    await this.getPromotionAccessible(promotionId, userId, role);
    const etudiantIds = await this.promotionStudentIds(promotionId);
    if (!etudiantIds.length) return [];

    const evaluations = await this.prisma.evaluation.findMany({
      where: { etudiantId: { in: etudiantIds }, valeur: { not: null } },
      include: {
        etudiant: { select: SAFE_USER_SELECT },
        examen: true,
        competence: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return evaluations.map((e) => this.noteDto(e));
  }

  async getExamensPromotion(promotionId: number, userId: number, role: Role) {
    await this.getPromotionAccessible(promotionId, userId, role);
    return this.prisma.examen.findMany({
      where: { promotionId },
      orderBy: { dateExamen: 'asc' },
    });
  }

  async getCompetencesPromotion(promotionId: number, userId: number, role: Role) {
    const promotion = await this.getPromotionAccessible(promotionId, userId, role);
    return this.prisma.competence.findMany({
      where: { formationId: promotion.formationId },
      orderBy: { code: 'asc' },
    });
  }

  async saisirNote(
    dto: {
      etudiantId: number;
      examenId: number;
      competenceId: number;
      valeur: number;
      appreciation?: string;
    },
    userId: number,
    role: Role,
  ) {
    if (!Number.isFinite(dto.valeur) || dto.valeur < 0 || dto.valeur > 20) {
      throw new BadRequestException('La note doit être comprise entre 0 et 20.');
    }

    const examen = await this.prisma.examen.findUnique({ where: { id: dto.examenId } });
    if (!examen) throw new NotFoundException('Examen introuvable.');
    const promotion = await this.getPromotionAccessible(examen.promotionId, userId, role);

    const inscription = await this.prisma.inscription.findUnique({
      where: {
        promotionId_etudiantId: {
          promotionId: promotion.id,
          etudiantId: dto.etudiantId,
        },
      },
    });
    if (!inscription) {
      throw new BadRequestException("Cet étudiant n'est pas inscrit à cette promotion.");
    }

    const competence = await this.prisma.competence.findUnique({
      where: { id: dto.competenceId },
    });
    if (!competence || competence.formationId !== promotion.formationId) {
      throw new BadRequestException("Cette compétence n'appartient pas à la formation.");
    }

    const niveau = niveauPour(dto.valeur);
    const evaluation = await this.prisma.evaluation.upsert({
      where: {
        examenId_etudiantId_competenceId: {
          examenId: dto.examenId,
          etudiantId: dto.etudiantId,
          competenceId: dto.competenceId,
        },
      },
      update: { valeur: dto.valeur, niveau, commentaire: dto.appreciation ?? null },
      create: {
        examenId: dto.examenId,
        etudiantId: dto.etudiantId,
        competenceId: dto.competenceId,
        valeur: dto.valeur,
        niveau,
        commentaire: dto.appreciation ?? null,
      },
      include: {
        etudiant: { select: SAFE_USER_SELECT },
        examen: true,
        competence: true,
      },
    });
    return this.noteDto(evaluation);
  }

  async getStatsPromotion(promotionId: number, userId: number, role: Role) {
    await this.getPromotionAccessible(promotionId, userId, role);

    const etudiantIds = await this.promotionStudentIds(promotionId);
    const effectif = etudiantIds.length;

    const now = new Date();
    const sessions = await this.prisma.session.findMany({
      where: { promotionId, fin: { lt: now } },
      select: { id: true },
    });
    const sessionIds = sessions.map((s) => s.id);

    const emargements = sessionIds.length
      ? await this.prisma.emargement.findMany({
          where: { sessionId: { in: sessionIds }, etudiantId: { in: etudiantIds } },
          select: { etudiantId: true },
        })
      : [];

    const evaluations = await this.prisma.evaluation.findMany({
      where: { etudiantId: { in: etudiantIds }, valeur: { not: null } },
      select: { etudiantId: true, valeur: true },
    });

    const attendu = effectif * sessionIds.length;
    const presences = emargements.length;
    const moyenneGenerale = evaluations.length
      ? round(evaluations.reduce((sum, e) => sum + (e.valeur ?? 0), 0) / evaluations.length)
      : null;

    const moyennesParEtudiant = new Map<number, number[]>();
    for (const evaluation of evaluations) {
      const list = moyennesParEtudiant.get(evaluation.etudiantId) ?? [];
      list.push(evaluation.valeur ?? 0);
      moyennesParEtudiant.set(evaluation.etudiantId, list);
    }
    const reussite = [...moyennesParEtudiant.values()].filter(
      (notes) => notes.reduce((a, b) => a + b, 0) / notes.length >= 10,
    ).length;

    return {
      effectif,
      sessionsTerminees: sessionIds.length,
      presences,
      absences: Math.max(0, attendu - presences),
      tauxPresence: attendu ? round((presences / attendu) * 100) : null,
      tauxAbsence: attendu ? round(((attendu - presences) / attendu) * 100) : null,
      moyenneGenerale,
      tauxReussite: moyennesParEtudiant.size
        ? round((reussite / moyennesParEtudiant.size) * 100)
        : null,
    };
  }

  async getFormateurOverview(userId: number, role: Role) {
    const promotions = await this.getPromotionsFormateur(userId, role);
    const promotionIds = promotions.map((p) => p.id);

    const inscriptions = promotionIds.length
      ? await this.prisma.inscription.findMany({
          where: { promotionId: { in: promotionIds } },
          select: { etudiantId: true },
        })
      : [];

    let effectif = 0;
    let tauxPresence = 0;
    let moyenne = 0;
    let count = 0;

    for (const promotion of promotionIds) {
      const stats = await this.getStatsPromotion(promotion, userId, role);
      effectif += stats.effectif;
      if (stats.tauxPresence !== null) {
        tauxPresence += stats.tauxPresence;
        count += 1;
      }
      if (stats.moyenneGenerale !== null) {
        moyenne += stats.moyenneGenerale;
      }
    }

    return {
      promotions: promotions.length,
      etudiants: new Set(inscriptions.map((i) => i.etudiantId)).size,
      effectifTotal: effectif,
      tauxPresenceMoyen: count ? round(tauxPresence / count) : null,
      moyenneGenerale: promotions.length ? round(moyenne / promotions.length) : null,
    };
  }

  // ─────────────────────────── Admin ───────────────────────────

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        ...SAFE_USER_SELECT,
        _count: { select: { inscriptions: true, promotionsEnseignees: true } },
      },
      orderBy: [{ role: 'asc' }, { nom: 'asc' }],
    });
  }

  async createUser(dto: {
    email: string;
    password: string;
    nom: string;
    prenom: string;
    role?: Role;
    telephone?: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
  }) {
    if (!dto.email || !dto.password || !dto.nom || !dto.prenom) {
      throw new BadRequestException('Email, mot de passe, nom et prénom sont obligatoires.');
    }
    if (dto.password.length < 8) {
      throw new BadRequestException('Le mot de passe doit contenir au moins 8 caractères.');
    }

    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    if (exists) throw new BadRequestException('Cet email est déjà utilisé.');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: {
        email: dto.email.trim().toLowerCase(),
        passwordHash,
        nom: dto.nom,
        prenom: dto.prenom,
        role: dto.role ?? 'ETUDIANT',
        telephone: dto.telephone,
        adresse: dto.adresse,
        ville: dto.ville,
        codePostal: dto.codePostal,
      },
      select: SAFE_USER_SELECT,
    });
  }

  async updateUser(
    id: number,
    dto: {
      email?: string;
      password?: string;
      nom?: string;
      prenom?: string;
      role?: Role;
      telephone?: string;
      adresse?: string;
      ville?: string;
      codePostal?: string;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');

    const data: Prisma.UserUpdateInput = {
      email: dto.email?.trim().toLowerCase(),
      nom: dto.nom,
      prenom: dto.prenom,
      role: dto.role,
      telephone: dto.telephone,
      adresse: dto.adresse,
      ville: dto.ville,
      codePostal: dto.codePostal,
    };
    if (dto.password) {
      if (dto.password.length < 8) {
        throw new BadRequestException('Le mot de passe doit contenir au moins 8 caractères.');
      }
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({ where: { id }, data, select: SAFE_USER_SELECT });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    try {
      await this.prisma.user.delete({ where: { id } });
      return { success: true, id };
    } catch {
      throw new BadRequestException(
        'Impossible de supprimer cet utilisateur : il est rattaché à des promotions ou des données pédagogiques.',
      );
    }
  }

  async getAdminStats() {
    const [totalEtudiants, totalFormateurs, totalAdmins, totalPromotions, totalFormations] =
      await Promise.all([
        this.prisma.user.count({ where: { role: 'ETUDIANT' } }),
        this.prisma.user.count({ where: { role: 'FORMATEUR' } }),
        this.prisma.user.count({ where: { role: 'ADMIN' } }),
        this.prisma.promotion.count(),
        this.prisma.formation.count(),
      ]);

    const now = new Date();
    const sessions = await this.prisma.session.findMany({
      where: { fin: { lt: now } },
      select: { id: true, promotion: { select: { inscriptions: { select: { id: true } } } } },
    });
    const emargements = sessions.length
      ? await this.prisma.emargement.count({
          where: { sessionId: { in: sessions.map((s) => s.id) } },
        })
      : 0;
    const attendu = sessions.reduce((sum, s) => sum + s.promotion.inscriptions.length, 0);

    const evaluations = await this.prisma.evaluation.findMany({
      where: { valeur: { not: null } },
      select: { valeur: true },
    });

    const candidatures = await this.prisma.candidature.groupBy({
      by: ['statut'],
      _count: { _all: true },
    });

    return {
      totalEtudiants,
      totalFormateurs,
      totalAdmins,
      totalPromotions,
      totalFormations,
      tauxPresenceGlobal: attendu ? round((emargements / attendu) * 100) : null,
      moyenneGenerale: evaluations.length
        ? round(evaluations.reduce((sum, e) => sum + (e.valeur ?? 0), 0) / evaluations.length)
        : null,
      candidatures: {
        total: candidatures.reduce((sum, c) => sum + c._count._all, 0),
        enAttente:
          candidatures.find((c) => c.statut === 'EN_ATTENTE')?._count._all ?? 0,
        acceptees: candidatures.find((c) => c.statut === 'ACCEPTEE')?._count._all ?? 0,
        refusees: candidatures.find((c) => c.statut === 'REFUSEE')?._count._all ?? 0,
      },
    };
  }

  async getCandidaturesAdmin() {
    return this.prisma.candidature.findMany({
      include: { formation: { select: { titre: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateCandidatureStatut(
    id: number,
    statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE',
  ) {
    if (!['EN_ATTENTE', 'ACCEPTEE', 'REFUSEE'].includes(statut)) {
      throw new BadRequestException('Statut de candidature invalide.');
    }
    return this.prisma.candidature.update({ where: { id }, data: { statut } });
  }
}
