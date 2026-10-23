export interface Formation {
  id: string;
  title: string;
  slug: string;
  category: 'dev' | 'reseaux' | 'marketing' | 'management' | 'data';
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
  campus: ('Le Port' | 'Distanciel')[];
  shortDescription: string;
  prerequisites: string[];
  objectives: string[];
  admissionModalities: string[];
  careerOutcomes: string[];
  certifyingPartner: string;
  startingDates: string[];
  badge?: string;
}

export interface FormationFilters {
  search: string;
  category: string;
  level: string;
  type: string;
  cpfOnly: boolean;
  campus: string;
}

export interface CandidatureFormInput {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  codePostal: string;
  formationId: string;
  typeDemarche: 'campus' | 'pro' | 'info';
  statutActuel: string;
  message: string;
  rgpdConsent: boolean;
}

export interface CandidatureResponse {
  success: boolean;
  reference: string;
  message: string;
  candidature?: CandidatureFormInput & { id: string; createdAt: string };
}
