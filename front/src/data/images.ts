import type { Formation } from '@/types/formation';

/**
 * Visuels issus des sites officiels Expernet / Expernet Campus.
 * Un visuel unique par emplacement pour éviter les répétitions.
 */
export const IMAGES = {
  // Logos
  logoMarkWhite: '/images/logo-expernet-mark-white.png',
  logoMarkBlue: '/images/logo-expernet.png',
  logoCampus: '/images/logo-campus.png',
  qualiopi: '/images/qualiopi.png',
  qualiopiWide: '/images/qualiopi-2.png',
  rncp: '/images/badge-rncp.png',

  // Accueil
  heroHome: '/images/photo-students.jpg',
  homeCampus: '/images/campus-building.jpg',
  homePro: '/images/pro-outils.webp',
  homeGalia: '/images/photo-ia-bureautique.png',
  homeTeams: '/images/teams-collab.webp',
  homeBand: '/images/campus-articles.jpg',
  homeCampusPhoto: '/images/photo-centre.png',

  // Catalogue formations
  heroFormations: '/images/campus-informatique.jpg',
  catalogueBand: '/images/photo-blog-2.webp',

  // Campus
  heroCampus: '/images/campus-graphiste.jpg',
  campusPhoto: '/images/campus-esd-bac5.jpg',
  campusCursus: '/images/campus-technicien.jpg',

  // Pro
  heroPro: '/images/photo-pro-365.jpg',
  proCyber: '/images/campus-hacking.jpg',
  proDesign: '/images/photo-design.png',
  proAdmin: '/images/photo-zero-trust.webp',

  // GALIA
  heroGalia: '/images/photo-ia.png',
  galiaPhoto: '/images/photo-api-ia.png',

  // Teams
  heroTeams: '/images/photo-copilot.webp',
  teamsPhoto: '/images/photo-blog-4.webp',

  // À propos
  heroAbout: '/images/photo-consultante-about.jpg',
  aboutTeam: '/images/photo-team.png',

  // Planning
  heroPlanning: '/images/campus-marketing.jpg',
  planningBand: '/images/photo-blog-7.webp',

  // Candidature
  heroCandidature: '/images/photo-blog-9.webp',
} as const;

export const CATEGORY_IMAGES: Record<Formation['category'], string> = {
  dev: '/images/campus-cda.jpg',
  reseaux: '/images/campus-reseau.jpg',
  marketing: '/images/campus-chef-projet-digital.jpg',
  management: '/images/campus-chef-projet.jpg',
  data: '/images/photo-blog-2025.webp',
};

export interface PartnerLogo {
  name: string;
  image: string;
}

export const PARTNER_LOGOS: PartnerLogo[] = [
  { name: 'ENI', image: '/images/partner-eni.png' },
  { name: 'IPI France', image: '/images/partner-ipi.png' },
  { name: 'ESD Cybersecurity Academy', image: '/images/partner-esd.png' },
  { name: 'Digital Campus', image: '/images/partner-digital-campus.png' },
  { name: 'Digital Réunion', image: '/images/partner-digital-reunion.png' },
  { name: 'Région Réunion', image: '/images/partner-region.png' },
  { name: 'FPF', image: '/images/partner-ffp.png' },
];
