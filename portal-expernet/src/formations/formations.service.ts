import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { NiveauFormation, Prisma, TypeFormation } from '../generated/prisma/client.js';
import { CreateCandidatureDto } from './dto/candidature.dto.js';

export interface FormationFilters {
  search?: string;
  category?: string;
  level?: string;
  type?: string;
  cpfOnly?: boolean;
  campus?: string;
}

// ───────── Cartographie entre l'API publique (contrat front) et la base ─────────

type FormationLevel = 'bac+2' | 'bac+3' | 'bac+5' | 'certification';

const NIVEAU_TO_API: Record<NiveauFormation, FormationLevel> = {
  [NiveauFormation.BAC_PLUS_2]: 'bac+2',
  [NiveauFormation.BAC_PLUS_3]: 'bac+3',
  [NiveauFormation.BAC_PLUS_5]: 'bac+5',
  [NiveauFormation.CERTIFICATION]: 'certification',
};

const NIVEAU_FROM_API: Record<string, NiveauFormation> = {
  'bac+2': NiveauFormation.BAC_PLUS_2,
  'bac+3': NiveauFormation.BAC_PLUS_3,
  'bac+5': NiveauFormation.BAC_PLUS_5,
  certification: NiveauFormation.CERTIFICATION,
};

const TYPE_FROM_API: Record<string, TypeFormation> = {
  campus: TypeFormation.CAMPUS,
  pro: TypeFormation.PRO,
};

type FormationRow = Prisma.FormationGetPayload<{ include: { filiere: true } }>;

export interface FormationDto {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryLabel: string;
  type: 'campus' | 'pro';
  typeLabel: string;
  level: 'bac+2' | 'bac+3' | 'bac+5' | 'certification';
  levelLabel: string;
  rncpCode?: string;
  cpfCode?: string;
  duration: string;
  pace: string;
  isCpfEligible: boolean;
  isAlternance: boolean;
  campus: string[];
  shortDescription: string;
  prerequisites: string[];
  objectives: string[];
  admissionModalities: string[];
  careerOutcomes: string[];
  certifyingPartner: string;
  startingDates: string[];
  badge?: string;
}

function toFormationDto(row: FormationRow): FormationDto {
  const isCampus = row.type === TypeFormation.CAMPUS;
  const typeLabel = isCampus
    ? 'Expernet Campus (Alternance)'
    : row.eligibleCpf
      ? 'Expernet Pro (Formation Continue & CPF)'
      : 'Expernet Pro (Formation Continue)';

  return {
    id: row.slug,
    title: row.titre,
    slug: row.slug,
    category: row.filiere.slug,
    categoryLabel: row.libelle,
    type: isCampus ? 'campus' : 'pro',
    typeLabel,
    level: NIVEAU_TO_API[row.niveau],
    levelLabel: row.libelleNiveau,
    rncpCode: row.rncpCode ?? undefined,
    cpfCode: row.cpfCode ?? undefined,
    duration: row.duree,
    pace: row.rythme,
    isCpfEligible: row.eligibleCpf,
    isAlternance: row.alternance,
    campus: row.lieux,
    shortDescription: row.resume,
    prerequisites: row.prerequis,
    objectives: row.objectifs,
    admissionModalities: row.modalitesAcces,
    careerOutcomes: row.debouches,
    certifyingPartner: row.certificateur,
    startingDates: row.prochainesSessions,
    badge: row.badge ?? undefined,
  };
}

@Injectable()
export class FormationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: FormationFilters): Promise<{ total: number; data: FormationDto[] }> {
    const where: Prisma.FormationWhereInput = { publiee: true };

    if (filters?.category && filters.category !== 'all') {
      where.filiere = { slug: filters.category };
    }
    if (filters?.level && filters.level !== 'all') {
      where.niveau = NIVEAU_FROM_API[filters.level];
    }
    if (filters?.type && filters.type !== 'all') {
      where.type = TYPE_FROM_API[filters.type];
    }
    if (filters?.cpfOnly) {
      where.eligibleCpf = true;
    }
    if (filters?.campus && filters.campus !== 'all') {
      where.lieux = { has: filters.campus };
    }
    if (filters?.search) {
      const q = filters.search.trim();
      if (q) {
        where.OR = [
          { titre: { contains: q, mode: 'insensitive' } },
          { resume: { contains: q, mode: 'insensitive' } },
          { certificateur: { contains: q, mode: 'insensitive' } },
          { rncpCode: { contains: q, mode: 'insensitive' } },
          { filiere: { nom: { contains: q, mode: 'insensitive' } } },
        ];
      }
    }

    const rows = await this.prisma.formation.findMany({
      where,
      include: { filiere: true },
      orderBy: { id: 'asc' },
    });

    return {
      total: rows.length,
      data: rows.map(toFormationDto),
    };
  }

  async findOne(idOrSlug: string): Promise<FormationDto> {
    const or: Prisma.FormationWhereInput[] = [{ slug: idOrSlug }];
    const numericId = Number.parseInt(idOrSlug, 10);
    if (Number.isFinite(numericId)) {
      or.push({ id: numericId });
    }

    const row = await this.prisma.formation.findFirst({
      where: { OR: or },
      include: { filiere: true },
    });

    if (!row) {
      throw new NotFoundException(`Formation introuvable avec l'identifiant ${idOrSlug}`);
    }
    return toFormationDto(row);
  }

  async getCategoriesSummary() {
    const filieres = await this.prisma.filiere.findMany({
      include: { formations: { where: { publiee: true } } },
      orderBy: { id: 'asc' },
    });

    const totalFormations = filieres.reduce((total, f) => total + f.formations.length, 0);

    return {
      categories: [
        { id: 'all', label: 'Toutes les filières', count: totalFormations },
        ...filieres.map((f) => ({ id: f.slug, label: f.nom, count: f.formations.length })),
      ],
      levels: [
        { id: 'all', label: 'Tous les niveaux' },
        { id: 'bac+2', label: 'Bac+2 (Niveau 5 RNCP)' },
        { id: 'bac+3', label: 'Bac+3 (Niveau 6 RNCP)' },
        { id: 'bac+5', label: 'Bac+5 (Niveau 7 RNCP)' },
        { id: 'certification', label: 'Certifications professionnelles' },
      ],
      types: [
        { id: 'all', label: 'Toutes les offres' },
        { id: 'campus', label: 'Expernet Campus (Alternance)' },
        { id: 'pro', label: 'Expernet Pro (Formation continue & Reconversion)' },
      ],
      stats: {
        totalFormations,
        insertionTaux: '92%',
        anneesExperience: '+20 ans à La Réunion',
        diplomesCertifies: '100% Titres RNCP & Diplômes d’État',
      },
    };
  }

  async createCandidature(dto: CreateCandidatureDto) {
    // La formation est optionnelle (démarche « info » sans formation précise)
    let formationId: number | null = null;
    if (dto.formationId) {
      const or: Prisma.FormationWhereInput[] = [{ slug: dto.formationId }];
      const numericId = Number.parseInt(dto.formationId, 10);
      if (Number.isFinite(numericId)) {
        or.push({ id: numericId });
      }
      const formation = await this.prisma.formation.findFirst({ where: { OR: or } });
      if (!formation) {
        throw new NotFoundException(`Formation inconnue : ${dto.formationId}`);
      }
      formationId = formation.id;
    }

    // Référence publique de candidature, unique
    let reference = this.generateReference();
    while (await this.prisma.candidature.findUnique({ where: { reference } })) {
      reference = this.generateReference();
    }

    const record = await this.prisma.candidature.create({
      data: {
        reference,
        formationId,
        nom: dto.nom,
        prenom: dto.prenom,
        email: dto.email,
        telephone: dto.telephone,
        codePostal: dto.codePostal,
        typeDemarche: dto.typeDemarche,
        statutActuel: dto.statutActuel,
        motivation: dto.message ?? '',
        rgpdConsent: dto.rgpdConsent,
      },
    });

    return {
      success: true,
      reference: record.reference,
      message:
        'Votre candidature a bien été enregistrée. Un conseiller pédagogique Expernet vous recontactera sous 48h.',
      candidature: {
        ...dto,
        id: record.reference,
        createdAt: record.createdAt.toISOString(),
      },
    };
  }

  async findAllCandidatures() {
    return this.prisma.candidature.findMany({
      include: {
        formation: { select: { id: true, slug: true, titre: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private generateReference(): string {
    return 'EXP-' + Math.floor(100000 + Math.random() * 900000);
  }
}
