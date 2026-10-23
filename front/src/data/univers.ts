import { IMAGES } from '@/data/images';

export type UniversId = 'campus' | 'pro' | 'galia' | 'teams';

export type Accent = 'orange' | 'blue' | 'gold' | 'purple';

export interface Univers {
  id: UniversId;
  name: string;
  label: string;
  tagline: string;
  description: string;
  route: string;
  accent: Accent;
  icon: string;
  image: string;
  highlights: string[];
  cta: string;
}

export const UNIVERS: Univers[] = [
  {
    id: 'campus',
    name: 'Expernet Campus',
    label: 'Alternance',
    tagline: 'Bac+2 à Bac+5 en alternance',
    description:
      "Diplômes d'État et titres RNCP en informatique et marketing digital, en contrat d'apprentissage à La Réunion et à Mayotte.",
    route: '/campus',
    accent: 'orange',
    icon: '🎓',
    image: IMAGES.homeCampus,
    highlights: ['0 € de frais de scolarité', 'Diplômes RNCP & titres d’État', '250+ entreprises partenaires'],
    cta: 'Découvrir le Campus',
  },
  {
    id: 'pro',
    name: 'Expernet Pro',
    label: 'Formation continue',
    tagline: 'CPF, salariés & entreprises',
    description:
      'Certifications éditeurs et parcours courts pour monter en compétences, se reconvertir ou faire monter une équipe entière.',
    route: '/expernet-pro',
    accent: 'blue',
    icon: '💼',
    image: IMAGES.homePro,
    highlights: ['Éligible CPF', 'Sessions de 3 à 5 jours', 'Présentiel & distanciel'],
    cta: 'Voir Expernet Pro',
  },
  {
    id: 'galia',
    name: 'GALIA',
    label: 'Espace apprenant',
    tagline: 'La plateforme LMS des apprenants',
    description:
      'Cours, ressources, planning, rendus et attestations : tout le parcours pédagogique réuni dans un seul espace.',
    route: '/galia',
    accent: 'gold',
    icon: '📚',
    image: IMAGES.homeGalia,
    highlights: ['Cours & ressources', 'Suivi de progression', 'Attestations en ligne'],
    cta: 'Accéder à GALIA',
  },
  {
    id: 'teams',
    name: 'Teams',
    label: 'Espace collaboratif',
    tagline: 'Classes virtuelles & projets',
    description:
      'Classes virtuelles, tutorat, projets en équipe et échanges avec les formateurs au sein de notre espace Microsoft Teams.',
    route: '/teams',
    accent: 'purple',
    icon: '🤝',
    image: IMAGES.homeTeams,
    highlights: ['Classes virtuelles', 'Projets en équipe', 'Tutorat en ligne'],
    cta: 'Rejoindre Teams',
  },
];

export const getUnivers = (id: UniversId): Univers => {
  const univers = UNIVERS.find((item) => item.id === id);
  if (!univers) {
    throw new Error(`Univers inconnu : ${id}`);
  }
  return univers;
};
