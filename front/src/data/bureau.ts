export interface BureauMember {
  name: string;
  role: string;
  scope: string;
  quote?: string;
}

export const BUREAU_MEMBERS: BureauMember[] = [
  {
    name: 'Marc-Henri Ravaux',
    role: 'Directeur Général',
    scope: 'Direction',
    quote:
      'Contribuer au développement du territoire réunionnais en proposant des diplômes de qualité, en phase avec les besoins en compétences de nos entreprises.',
  },
  {
    name: 'Maxime Courbet',
    role: 'Directeur Exploitation Réunion & Mayotte',
    scope: 'Direction',
    quote: 'Les relations humaines et le partage des savoirs sont les clés de la réussite.',
  },
  {
    name: 'Samy Chiva',
    role: 'Responsable Développement Alternance',
    scope: 'Entreprises',
    quote: "Certains veulent que ça arrive, d'autres aimeraient que ça arrive et quelques-uns font que ça arrive.",
  },
  {
    name: 'Christie Toolsymootoo',
    role: 'Responsable Service Coordination Pédagogique',
    scope: 'Pédagogie',
    quote: "Le succès n'est pas final, l'échec n'est pas fatal. C'est le courage de continuer qui compte.",
  },
  {
    name: 'Laetitia Laurence-Nicosia',
    role: 'Responsable Administrative & Financière',
    scope: 'Administration',
    quote: "La persévérance, c'est ce qui rend l'impossible possible, le possible probable et le probable réalisé.",
  },
  {
    name: 'Emma Nerina',
    role: 'Conseillère en formation',
    scope: 'Accompagnement',
    quote: "Choisissez un travail que vous aimez et vous n'aurez jamais à travailler un seul jour de votre vie.",
  },
  {
    name: 'Pauline Corre',
    role: 'Chargée de communication',
    scope: 'Communication',
    quote: "La créativité consiste à voir ce que tout le monde voit et à penser ce que personne d'autre ne pense.",
  },
  {
    name: 'Murielle Chamand',
    role: 'Assistante Administrative & Commerciale',
    scope: 'Accueil & handicap',
    quote: 'La vie est un défi à relever, un bonheur à mériter, une aventure à tenter.',
  },
  {
    name: 'Hanais Ahmed',
    role: 'Conseillère en formation Mayotte',
    scope: 'Mayotte',
    quote: 'La persévérance et le travail finissent toujours par payer.',
  },
];

export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
}

export const CAMPUS_HISTORY: HistoryEvent[] = [
  {
    year: '2002',
    title: 'Naissance d’Expernet',
    description:
      "Expernet démarre comme organisme de formation spécialisé dans l'informatique et le marketing digital à La Réunion.",
  },
  {
    year: '2017',
    title: 'Création du Campus Expernet',
    description:
      "Sous l'impulsion de Marc-Henri Ravaux, le Campus ouvre ses portes avec une ambition claire : former les talents tech du territoire en alternance.",
  },
  {
    year: '2020',
    title: 'Ouverture à Mayotte',
    description:
      "Le Campus étend son offre au-delà de La Réunion et accompagne les apprenants mahorais sur les cursus informatiques.",
  },
  {
    year: '2024',
    title: 'Cybersécurité & intelligence artificielle',
    description:
      "De nouveaux cursus Bac+2 à Bac+5 intègrent la cybersécurité, l'IA générative et la data pour répondre aux besoins des entreprises.",
  },
  {
    year: '2026',
    title: 'Un portail unifié',
    description:
      "Expernet, Expernet Campus, GALIA et Teams se réunissent dans un même portail pour simplifier le parcours de chaque apprenant.",
  },
];

export interface CampusSite {
  name: string;
  city: string;
  address: string;
  phone: string;
  note: string;
}

export const CAMPUS_SITES: CampusSite[] = [
  {
    name: 'Campus Le Port',
    city: 'Le Port',
    address: 'Local 528, Parc 2000, 3 avenue Théodore Drouhet, 97420 Le Port',
    phone: '0262 21 90 45',
    note: 'Siège & pôle alternance',
  },
  {
    name: 'Campus Nord',
    city: 'Sainte-Clotilde',
    address: '2 rue Émile Hugot, Parc Technologique Universitaire, 97490 Sainte-Clotilde',
    phone: '0262 29 40 20',
    note: 'Cursus informatique & marketing',
  },
  {
    name: 'Campus Sud',
    city: 'Saint-Pierre',
    address: "Pôle d'activités Sud Ouest, 97410 Saint-Pierre",
    phone: '0262 21 90 45',
    note: 'Alternance & formation continue',
  },
];

export const PARTNERS = ['ENI', 'IPI France', 'ESD Cybersecurity Academy', 'Digital Campus', 'Microsoft', 'Qualiopi'];
