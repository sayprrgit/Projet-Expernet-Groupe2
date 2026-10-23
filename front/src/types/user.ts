export type Role = 'ADMIN' | 'FORMATEUR' | 'ETUDIANT';

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  telephone?: string | null;
  adresse?: string | null;
  ville?: string | null;
  codePostal?: string | null;
  mfaEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Formation {
  id: number;
  titre: string;
  slug: string;
  filiereId: number;
  libelle: string;
  libelleNiveau: string;
  type: 'CAMPUS' | 'PRO';
  niveau: 'BAC_PLUS_2' | 'BAC_PLUS_3' | 'BAC_PLUS_5' | 'CERTIFICATION';
}

export interface Promotion {
  id: number;
  nom: string;
  formationId: number;
  formateurId: number;
  dateDebut: string;
  dateFin: string;
  formation?: Formation;
  formateur?: User;
  _count?: { inscriptions: number; sessions: number };
}

export interface Session {
  id: number;
  promotionId: number;
  titre: string;
  debut: string;
  fin: string;
  promotion?: Promotion;
  emargements?: Emargement[];
}

export interface Emargement {
  id: number;
  sessionId: number;
  etudiantId: number;
  signature: string;
  signeLe: string;
  adresseIp?: string | null;
  empreinte: string;
  present: boolean;
  etudiant?: User;
}

export interface Competence {
  id: number;
  formationId: number;
  code: string;
  libelle: string;
}

export interface Examen {
  id: number;
  promotionId: number;
  intitule: string;
  dateExamen: string;
  salle?: string | null;
}

export type NiveauAcquisition = 'NON_ACQUIS' | 'EN_COURS' | 'ACQUIS';

export interface Note {
  id: number;
  etudiantId: number;
  examenId: number;
  competenceId: number;
  valeur: number;
  appreciation?: string | null;
  niveau: NiveauAcquisition;
  createdAt: string;
  updatedAt: string;
  etudiant?: User;
  examen?: Examen;
  competence?: Competence;
}

export interface ProgressionCompetence {
  id: number;
  code: string;
  libelle: string;
  niveau: NiveauAcquisition;
  valeur: number | null;
  examen: string | null;
}

export interface Progression {
  competences: ProgressionCompetence[];
  acquis: number;
  enCours: number;
  nonAcquis: number;
  moyenne: number | null;
}

export interface Absence {
  id: string;
  etudiantId: number;
  sessionId: number;
  justifiee: boolean;
  motif?: string | null;
  createdAt: string;
  session: Session;
}

export interface Assiduite {
  totalSessions: number;
  presences: number;
  absences: number;
  tauxPresence: number | null;
}

export interface EtudiantStats extends User {
  totalSessions: number;
  presences: number;
  absences: number;
  tauxPresence: number | null;
  moyenne: number | null;
  notesCount: number;
  progression: { acquis: number; enCours: number; nonAcquis: number };
}

export interface PromotionStats {
  effectif: number;
  sessionsTerminees: number;
  presences: number;
  absences: number;
  tauxPresence: number | null;
  tauxAbsence: number | null;
  moyenneGenerale: number | null;
  tauxReussite: number | null;
}

export interface FormateurOverview {
  promotions: number;
  etudiants: number;
  effectifTotal: number;
  tauxPresenceMoyen: number | null;
  moyenneGenerale: number | null;
}

export interface AdminStats {
  totalEtudiants: number;
  totalFormateurs: number;
  totalAdmins: number;
  totalPromotions: number;
  totalFormations: number;
  tauxPresenceGlobal: number | null;
  moyenneGenerale: number | null;
  candidatures: {
    total: number;
    enAttente: number;
    acceptees: number;
    refusees: number;
  };
}

export interface AdminUser extends User {
  _count?: { inscriptions: number; promotionsEnseignees: number };
}

export type StatutCandidature = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';

export interface CandidatureAdmin {
  id: number;
  reference: string;
  formationId?: number | null;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  codePostal: string;
  typeDemarche: string;
  statutActuel: string;
  motivation: string;
  rgpdConsent: boolean;
  statut: StatutCandidature;
  createdAt: string;
  formation?: { titre: string; slug: string } | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}
