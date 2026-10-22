import { Injectable, NotFoundException } from '@nestjs/common';
import { MOCK_FORMATIONS, Formation } from './formations.data.js';
import { CreateCandidatureDto } from './dto/candidature.dto.js';

export interface CandidatureRecord extends CreateCandidatureDto {
  id: string;
  createdAt: string;
  status: 'recue' | 'en_cours' | 'validee';
}

@Injectable()
export class FormationsService {
  private formations: Formation[] = [...MOCK_FORMATIONS];
  private candidatures: CandidatureRecord[] = [];

  findAll(filters?: {
    search?: string;
    category?: string;
    level?: string;
    type?: string;
    cpfOnly?: boolean;
    campus?: string;
  }): { total: number; data: Formation[] } {
    let result = [...this.formations];

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          f.shortDescription.toLowerCase().includes(q) ||
          f.categoryLabel.toLowerCase().includes(q) ||
          f.careerOutcomes.some((c) => c.toLowerCase().includes(q)) ||
          (f.rncpCode && f.rncpCode.toLowerCase().includes(q)),
      );
    }

    if (filters?.category && filters.category !== 'all') {
      result = result.filter((f) => f.category === filters.category);
    }

    if (filters?.level && filters.level !== 'all') {
      result = result.filter((f) => f.level === filters.level);
    }

    if (filters?.type && filters.type !== 'all') {
      result = result.filter((f) => f.type === filters.type);
    }

    if (filters?.cpfOnly) {
      result = result.filter((f) => f.isCpfEligible === true);
    }

    if (filters?.campus && filters.campus !== 'all') {
      result = result.filter((f) => f.campus.includes(filters.campus as any));
    }

    return {
      total: result.length,
      data: result,
    };
  }

  findOne(idOrSlug: string): Formation {
    const formation = this.formations.find(
      (f) => f.id === idOrSlug || f.slug === idOrSlug,
    );
    if (!formation) {
      throw new NotFoundException(`Formation introuvable avec l'identifiant ${idOrSlug}`);
    }
    return formation;
  }

  getCategoriesSummary() {
    return {
      categories: [
        { id: 'all', label: 'Toutes les filières', count: this.formations.length },
        { id: 'dev', label: 'Développement Web & Logiciel', count: this.formations.filter((f) => f.category === 'dev').length },
        { id: 'reseaux', label: 'Systèmes, Réseaux & Cybersécurité', count: this.formations.filter((f) => f.category === 'reseaux').length },
        { id: 'marketing', label: 'Marketing Digital & Communication', count: this.formations.filter((f) => f.category === 'marketing').length },
        { id: 'data', label: 'Data & Intelligence Artificielle', count: this.formations.filter((f) => f.category === 'data').length },
        { id: 'management', label: 'Gestion de projet & Management', count: this.formations.filter((f) => f.category === 'management').length },
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
        totalFormations: this.formations.length,
        insertionTaux: '92%',
        anneesExperience: '+20 ans à La Réunion',
        diplomesCertifies: '100% Titres RNCP & Diplômes d’État',
      },
    };
  }

  createCandidature(dto: CreateCandidatureDto) {
    const record: CandidatureRecord = {
      ...dto,
      id: 'EXP-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString(),
      status: 'recue',
    };
    this.candidatures.push(record);

    return {
      success: true,
      reference: record.id,
      message: 'Votre candidature a bien été enregistrée. Un conseiller pédagogique Expernet vous recontactera sous 48h.',
      candidature: record,
    };
  }

  findAllCandidatures() {
    return this.candidatures;
  }
}
