export type PlanningKind = 'formation' | 'evenement' | 'atelier' | 'examen';

export interface PlanningEntry {
  id: string;
  title: string;
  kind: PlanningKind;
  date: string;
  endDate?: string;
  time?: string;
  site: string;
  description: string;
  link?: { label: string; to: string };
}

export const PLANNING_KIND_LABELS: Record<PlanningKind, string> = {
  formation: 'Formation',
  evenement: 'Événement',
  atelier: 'Atelier',
  examen: 'Examen',
};

export const PLANNING_ENTRIES: PlanningEntry[] = [
  {
    id: 'rentree-bts-sio-2026',
    title: 'Rentrée BTS SIO 1re année',
    kind: 'formation',
    date: '2026-09-07',
    time: '08h30',
    site: 'Le Port',
    description: 'Accueil des alternants SISR et SLAM, remise des plannings et rencontre des tuteurs.',
    link: { label: 'Voir le BTS SIO', to: '/formations?type=campus' },
  },
  {
    id: 'rentree-bachelors-2026',
    title: 'Rentrée Bachelors & Mastères',
    kind: 'formation',
    date: '2026-09-14',
    time: '09h00',
    site: 'Le Port',
    description: 'Journée d’intégration des cursus Bac+3 et Bac+5 en alternance.',
    link: { label: 'Voir les formations Campus', to: '/formations?type=campus' },
  },
  {
    id: 'session-windows-powershell-oct',
    title: 'Session Windows Server 2022 & PowerShell v7',
    kind: 'formation',
    date: '2026-10-12',
    endDate: '2026-10-16',
    time: '09h00 - 17h00',
    site: 'Le Port ou distanciel',
    description: '5 jours pour administrer un parc Windows Server et automatiser les tâches récurrentes.',
    link: { label: 'Détails de la session', to: '/formations?type=pro' },
  },
  {
    id: 'atelier-alternance-oct',
    title: 'Atelier « Décrocher son alternance »',
    kind: 'atelier',
    date: '2026-10-28',
    time: '14h00 - 16h00',
    site: 'Le Port',
    description: 'CV, lettre de motivation et préparation d’entretien avec l’équipe développement alternance.',
    link: { label: 'Je prépare ma candidature', to: '/candidature' },
  },
  {
    id: 'session-m365-copilot-nov',
    title: 'Session Microsoft 365 & Copilot',
    kind: 'formation',
    date: '2026-11-04',
    endDate: '2026-11-06',
    time: '09h00 - 17h00',
    site: 'Le Port ou distanciel',
    description: '3 jours pour exploiter Teams, SharePoint et l’IA Copilot au quotidien.',
    link: { label: 'Voir Expernet Pro', to: '/expernet-pro' },
  },
  {
    id: 'jpo-nord-nov',
    title: 'Journée portes ouvertes — Campus Le Port',
    kind: 'evenement',
    date: '2026-11-18',
    time: '09h00 - 17h00',
    site: 'Le Port',
    description: 'Rencontre avec les formateurs, visite des locaux et échanges avec les alternants.',
    link: { label: 'Je réserve ma place', to: '/candidature' },
  },
  {
    id: 'job-dating-dec',
    title: 'Job dating alternance',
    kind: 'evenement',
    date: '2026-12-02',
    time: '13h30 - 18h00',
    site: 'Le Port',
    description: 'Rencontrez plus de 30 entreprises réunionnaises qui recrutent des alternants.',
    link: { label: 'Déposer un dossier', to: '/candidature' },
  },
  {
    id: 'session-excel-tosa-dec',
    title: 'Session Excel — certification TOSA',
    kind: 'formation',
    date: '2026-12-09',
    endDate: '2026-12-11',
    time: '09h00 - 17h00',
    site: 'Le Port',
    description: 'Montée en compétences sur Excel et passage de la certification TOSA.',
    link: { label: 'Voir la formation', to: '/formations?type=pro' },
  },
  {
    id: 'atelier-cv-sud-janv',
    title: 'Atelier CV & entretien',
    kind: 'atelier',
    date: '2027-01-13',
    time: '14h00 - 17h00',
    site: 'Le Port',
    description: 'Atelier pratique animé par les conseillères en formation du Campus Le Port.',
    link: { label: 'Je participe', to: '/candidature' },
  },
  {
    id: 'session-cyber-fev',
    title: 'Session Cybersécurité — bonnes pratiques ANSSI',
    kind: 'formation',
    date: '2027-02-03',
    endDate: '2027-02-05',
    time: '09h00 - 17h00',
    site: 'Le Port ou intra-entreprise',
    description: 'Sensibilisation et hygiène numérique pour les équipes et les décideurs.',
    link: { label: 'Voir Expernet Pro', to: '/expernet-pro' },
  },
  {
    id: 'jpo-sud-mars',
    title: 'Journée portes ouvertes — Campus Le Port',
    kind: 'evenement',
    date: '2027-03-10',
    time: '09h00 - 17h00',
    site: 'Le Port',
    description: 'Présentation des cursus, ateliers découverte et témoignages d’anciens.',
    link: { label: 'Je réserve ma place', to: '/candidature' },
  },
  {
    id: 'examens-blancs-avril',
    title: 'Examens blancs BTS SIO',
    kind: 'examen',
    date: '2027-04-07',
    endDate: '2027-04-09',
    time: '08h30 - 12h30',
    site: 'Le Port',
    description: 'Mise en situation sur les épreuves professionnelles et les projets SISR/SLAM.',
  },
  {
    id: 'speed-recruiting-mai',
    title: 'Speed recruiting alternance',
    kind: 'evenement',
    date: '2027-05-12',
    time: '13h30 - 18h00',
    site: 'Le Port',
    description: 'Entretiens express avec les entreprises partenaires pour la rentrée 2027.',
    link: { label: 'Déposer un dossier', to: '/candidature' },
  },
  {
    id: 'epreuves-bts-juin',
    title: 'Épreuves écrites BTS SIO',
    kind: 'examen',
    date: '2027-06-09',
    endDate: '2027-06-11',
    site: 'Le Port',
    description: 'Épreuves nationales du BTS Services informatiques aux organisations.',
  },
  {
    id: 'jury-certification-juil',
    title: 'Jury de certification',
    kind: 'examen',
    date: '2027-07-06',
    endDate: '2027-07-08',
    site: 'Le Port',
    description: 'Passage devant le jury pour les titres RNCP et les certificats professionnels.',
  },
  {
    id: 'rentree-2027',
    title: 'Rentrée 2027-2028',
    kind: 'formation',
    date: '2027-09-06',
    time: '08h30',
    site: 'Le Port',
    description: 'Accueil des nouvelles promotions du Campus et des sessions Expernet Pro.',
    link: { label: 'Candidater', to: '/candidature' },
  },
];

export const PLANNING_SITES = [
  'Tous les sites',
  'Le Port',
  'Distanciel',
];
