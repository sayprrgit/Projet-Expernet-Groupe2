import axios from 'axios';
import type {
  Formation,
  FormationFilters,
  CandidatureFormInput,
  CandidatureResponse,
} from '@/types/formation';
import type {
  Absence,
  AdminStats,
  AdminUser,
  Assiduite,
  CandidatureAdmin,
  Competence,
  Emargement,
  EtudiantStats,
  Examen,
  FormateurOverview,
  LoginResponse,
  Note,
  Progression,
  Promotion,
  PromotionStats,
  Role,
  Session,
  User,
} from '@/types/user';
import type { PlanningEntry } from '@/data/planning';
import { MOCK_FORMATIONS } from './formationsData';
import { PLANNING_ENTRIES } from '@/data/planning';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('auth:logout'));
    }
    return Promise.reject(error);
  },
);

export const apiService = {
  // ───────── Auth ─────────
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  // ───────── Formations (public) ─────────
  async getFormations(
    filters?: Partial<FormationFilters>,
  ): Promise<{ total: number; data: Formation[] }> {
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

      return { total: list.length, data: list };
    }
  },

  async getPlanning(): Promise<PlanningEntry[]> {
    try {
      const response = await apiClient.get<PlanningEntry[]>('/planning');
      return response.data;
    } catch (err) {
      console.info('Backend API non disponible, utilisation du planning local :', err);
      return [...PLANNING_ENTRIES];
    }
  },

  async getFormationById(idOrSlug: string): Promise<Formation | undefined> {
    try {
      const response = await apiClient.get(`/formations/${idOrSlug}`);
      return response.data;
    } catch {
      return MOCK_FORMATIONS.find((f) => f.id === idOrSlug || f.slug === idOrSlug);
    }
  },

  async submitCandidature(input: CandidatureFormInput): Promise<CandidatureResponse> {
    try {
      const response = await apiClient.post<CandidatureResponse>(
        '/formations/candidature',
        input,
      );
      return response.data;
    } catch {
      await new Promise((res) => setTimeout(res, 500));
      const reference = 'EXP-' + Math.floor(100000 + Math.random() * 900000);
      return {
        success: true,
        reference,
        message:
          'Votre candidature a bien été enregistrée (mode mock). Un conseiller Expernet prendra contact avec vous sous 48h.',
        candidature: { ...input, id: reference, createdAt: new Date().toISOString() },
      };
    }
  },

  // ───────── Galia — Étudiant ─────────
  async getMonEmploiDuTemps(): Promise<Session[]> {
    const response = await apiClient.get<Session[]>('/galia/emploi-du-temps');
    return response.data;
  },

  async getMesNotes(): Promise<Note[]> {
    const response = await apiClient.get<Note[]>('/galia/mes-notes');
    return response.data;
  },

  async getMaProgression(): Promise<Progression> {
    const response = await apiClient.get<Progression>('/galia/progression');
    return response.data;
  },

  async getMonAssiduite(): Promise<Assiduite> {
    const response = await apiClient.get<Assiduite>('/galia/assiduite');
    return response.data;
  },

  async getMesAbsences(): Promise<Absence[]> {
    const response = await apiClient.get<Absence[]>('/galia/mes-absences');
    return response.data;
  },

  async getMaPromotion(): Promise<Promotion | null> {
    const response = await apiClient.get<Promotion | null>('/galia/ma-promotion');
    return response.data;
  },

  // ───────── Galia — Formateur ─────────
  async getFormateurOverview(): Promise<FormateurOverview> {
    const response = await apiClient.get<FormateurOverview>('/galia/formateur/overview');
    return response.data;
  },

  async getMesPromotions(): Promise<Promotion[]> {
    const response = await apiClient.get<Promotion[]>('/galia/formateur/promotions');
    return response.data;
  },

  async getEtudiantsPromotion(promotionId: number): Promise<EtudiantStats[]> {
    const response = await apiClient.get<EtudiantStats[]>(
      `/galia/formateur/promotions/${promotionId}/etudiants`,
    );
    return response.data;
  },

  async getSessionsPromotion(promotionId: number): Promise<Session[]> {
    const response = await apiClient.get<Session[]>(
      `/galia/formateur/promotions/${promotionId}/sessions`,
    );
    return response.data;
  },

  async getEmargementsSession(sessionId: number): Promise<Emargement[]> {
    const response = await apiClient.get<Emargement[]>(
      `/galia/formateur/sessions/${sessionId}/emargements`,
    );
    return response.data;
  },

  async marquerPresence(
    sessionId: number,
    etudiantId: number,
    present: boolean,
  ): Promise<{ sessionId: number; etudiantId: number; present: boolean }> {
    const response = await apiClient.post(`/galia/formateur/sessions/${sessionId}/emargements`, {
      etudiantId,
      present,
    });
    return response.data;
  },

  async getNotesPromotion(promotionId: number): Promise<Note[]> {
    const response = await apiClient.get<Note[]>(
      `/galia/formateur/promotions/${promotionId}/notes`,
    );
    return response.data;
  },

  async getExamensPromotion(promotionId: number): Promise<Examen[]> {
    const response = await apiClient.get<Examen[]>(
      `/galia/formateur/promotions/${promotionId}/examens`,
    );
    return response.data;
  },

  async getCompetencesPromotion(promotionId: number): Promise<Competence[]> {
    const response = await apiClient.get<Competence[]>(
      `/galia/formateur/promotions/${promotionId}/competences`,
    );
    return response.data;
  },

  async saisirNote(data: {
    etudiantId: number;
    examenId: number;
    competenceId: number;
    valeur: number;
    appreciation?: string;
  }): Promise<Note> {
    const response = await apiClient.post<Note>('/galia/formateur/notes', data);
    return response.data;
  },

  async getStatsPromotion(promotionId: number): Promise<PromotionStats> {
    const response = await apiClient.get<PromotionStats>(
      `/galia/formateur/promotions/${promotionId}/stats`,
    );
    return response.data;
  },

  // ───────── Galia — Admin ─────────
  async getAllUsers(): Promise<AdminUser[]> {
    const response = await apiClient.get<AdminUser[]>('/galia/admin/users');
    return response.data;
  },

  async createUser(
    data: Partial<User> & { password: string },
  ): Promise<AdminUser> {
    const response = await apiClient.post<AdminUser>('/galia/admin/users', data);
    return response.data;
  },

  async updateUser(
    id: number,
    data: Partial<User> & { password?: string },
  ): Promise<AdminUser> {
    const response = await apiClient.patch<AdminUser>(`/galia/admin/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/galia/admin/users/${id}`);
  },

  async getGlobalStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>('/galia/admin/stats');
    return response.data;
  },

  async getCandidaturesAdmin(): Promise<CandidatureAdmin[]> {
    const response = await apiClient.get<CandidatureAdmin[]>('/galia/admin/candidatures');
    return response.data;
  },

  async updateCandidatureStatut(
    id: number,
    statut: CandidatureAdmin['statut'],
  ): Promise<CandidatureAdmin> {
    const response = await apiClient.patch<CandidatureAdmin>(
      `/galia/admin/candidatures/${id}`,
      { statut },
    );
    return response.data;
  },
};

export type { Role };
