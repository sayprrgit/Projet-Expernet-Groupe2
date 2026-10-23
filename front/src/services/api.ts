import axios from 'axios';
import type {
  Formation,
  FormationFilters,
  CandidatureFormInput,
  CandidatureResponse,
} from '@/types/formation';
import { MOCK_FORMATIONS } from './formationsData';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  async getFormations(filters?: Partial<FormationFilters>): Promise<{ total: number; data: Formation[] }> {
    try {
      const params: Record<string, any> = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.category && filters.category !== 'all') params.category = filters.category;
      if (filters?.level && filters.level !== 'all') params.level = filters.level;
      if (filters?.type && filters.type !== 'all') params.type = filters.type;
      if (filters?.cpfOnly) params.cpfOnly = 'true';
      if (filters?.campus && filters.campus !== 'all') params.campus = filters.campus;

      const response = await apiClient.get('/formations', { params });
      return response.data;
    } catch (err) {
      // Fallback local mock filtering
      console.info('Backend API non disponible, utilisation du mock local :', err);
      let list = [...MOCK_FORMATIONS];

      if (filters?.search) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(
          (f) =>
            f.title.toLowerCase().includes(q) ||
            f.shortDescription.toLowerCase().includes(q) ||
            f.categoryLabel.toLowerCase().includes(q) ||
            f.careerOutcomes.some((c) => c.toLowerCase().includes(q)) ||
            (f.rncpCode && f.rncpCode.toLowerCase().includes(q)),
        );
      }

      if (filters?.category && filters.category !== 'all') {
        list = list.filter((f) => f.category === filters.category);
      }

      if (filters?.level && filters.level !== 'all') {
        list = list.filter((f) => f.level === filters.level);
      }

      if (filters?.type && filters.type !== 'all') {
        list = list.filter((f) => f.type === filters.type);
      }

      if (filters?.cpfOnly) {
        list = list.filter((f) => f.isCpfEligible === true);
      }

      if (filters?.campus && filters.campus !== 'all') {
        list = list.filter((f) => f.campus.includes(filters.campus as any));
      }

      return {
        total: list.length,
        data: list,
      };
    }
  },

  async getFormationById(idOrSlug: string): Promise<Formation | undefined> {
    try {
      const response = await apiClient.get(`/formations/${idOrSlug}`);
      return response.data;
    } catch (err) {
      return MOCK_FORMATIONS.find((f) => f.id === idOrSlug || f.slug === idOrSlug);
    }
  },

  async submitCandidature(input: CandidatureFormInput): Promise<CandidatureResponse> {
    try {
      const response = await apiClient.post<CandidatureResponse>('/formations/candidature', input);
      return response.data;
    } catch (err) {
      // Fallback mock simulation
      await new Promise((res) => setTimeout(res, 500));
      return {
        success: true,
        reference: 'EXP-' + Math.floor(100000 + Math.random() * 900000),
        message:
          'Votre candidature a bien été enregistrée (mode mock). Un conseiller Expernet prendra contact avec vous sous 48h.',
        candidature: {
          ...input,
          id: 'EXP-' + Math.floor(100000 + Math.random() * 900000),
          createdAt: new Date().toISOString(),
        },
      };
    }
  },
};
