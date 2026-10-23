import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  Role,
  NiveauRncp,
  NiveauFormation,
  TypeFormation,
  StatutCandidature,
  NiveauAcquisition,
  RoleJury,
  PlanningType,
} from '../src/generated/prisma/client.js';
import bcrypt from 'bcrypt';
import { createHash } from 'crypto';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function empreinte(sessionId: number, etudiantId: number, date: Date, signature: string) {
  return createHash('sha256')
    .update(`${sessionId}|${etudiantId}|${date.toISOString()}|${signature}`)
    .digest('hex');
}

async function main() {
  // Nettoyage (ordre inverse des dépendances) : à n'utiliser qu'en développement
  await prisma.planningEvent.deleteMany();
  await prisma.message.deleteMany();
  await prisma.document.deleteMany();
  await prisma.canal.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.juryMembre.deleteMany();
  await prisma.competence.deleteMany();
  await prisma.examen.deleteMany();
  await prisma.attestation.deleteMany();
  await prisma.emargement.deleteMany();
  await prisma.session.deleteMany();
  await prisma.inscription.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.candidature.deleteMany();
  await prisma.formation.deleteMany();
  await prisma.filiere.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // ───────── Utilisateurs (admin, formateurs, étudiants) ─────────
  const marie = await prisma.user.create({
    data: {
      email: 'marie.payet@expernet.re',
      passwordHash,
      nom: 'Payet',
      prenom: 'Marie',
      role: Role.ADMIN,
      telephone: '0692 45 67 89',
      adresse: '12 rue de la Marine',
      ville: 'Saint-Denis',
      codePostal: '97400',
      mfaEnabled: true,
    },
  });
  const laetitia = await prisma.user.create({
    data: {
      email: 'laetitia.laurence-nicosia@expernet.re',
      passwordHash,
      nom: 'Laurence-Nicosia',
      prenom: 'Laetitia',
      role: Role.ADMIN,
      telephone: '0693 12 34 56',
      adresse: '8 chemin des Manguiers',
      ville: 'Saint-Gilles',
      codePostal: '97400',
      mfaEnabled: true,
    },
  });
  const hoarau = await prisma.user.create({
    data: {
      email: 'jean.hoarau@expernet.re',
      passwordHash,
      nom: 'Hoarau',
      prenom: 'Jean',
      role: Role.FORMATEUR,
      telephone: '0692 98 76 54',
      adresse: 'Local 528, Parc 2000',
      ville: 'Le Port',
      codePostal: '97420',
      mfaEnabled: true,
    },
  });
  const menicoce = await prisma.user.create({
    data: {
      email: 'sophie.menicoce@expernet.re',
      passwordHash,
      nom: 'Menicoce',
      prenom: 'Sophie',
      role: Role.FORMATEUR,
      telephone: '0693 45 67 89',
      adresse: 'Local 528, Parc 2000',
      ville: 'Le Port',
      codePostal: '97420',
    },
  });
  const beauregard = await prisma.user.create({
    data: {
      email: 'marc.beauregard@expernet.re',
      passwordHash,
      nom: 'Beauregard',
      prenom: 'Marc',
      role: Role.FORMATEUR,
      telephone: '0692 33 22 11',
      adresse: 'Local 528, Parc 2000',
      ville: 'Le Port',
      codePostal: '97420',
    },
  });

  const etudiants = await Promise.all(
    [
      { email: 'lynho.rasoamanana@exemple.re', nom: 'Rasoamanana', prenom: 'Lynho', ville: 'Saint-Denis', codePostal: '97400' },
      { email: 'sarah.grondin@exemple.re', nom: 'Grondin', prenom: 'Sarah', ville: 'Saint-Paul', codePostal: '97460' },
      { email: 'jules.belair@exemple.re', nom: 'Belair', prenom: 'Jules', ville: 'Le Port', codePostal: '97420' },
      { email: 'amelie.st-pierre@exemple.re', nom: 'Saint-Pierre', prenom: 'Amélie', ville: 'Saint-Pierre', codePostal: '97410' },
      { email: 'hugo.norbert@exemple.re', nom: 'Norbert', prenom: 'Hugo', ville: 'Saint-Denis', codePostal: '97400' },
      { email: 'nina.fertit@exemple.re', nom: 'Fertit', prenom: 'Nina', ville: 'Saint-Paul', codePostal: '97460' },
      { email: 'kevin.dorr@exemple.re', nom: 'Dorr', prenom: 'Kevin', ville: 'Saint-Denis', codePostal: '97400' },
      { email: 'clara.périne@exemple.re', nom: 'Périne', prenom: 'Clara', ville: 'Saint-Gilles', codePostal: '97400' },
      { email: 'yanis.lamothe@exemple.re', nom: 'Lamothe', prenom: 'Yanis', ville: 'Le Port', codePostal: '97420' },
    ].map((data) =>
      prisma.user.create({
        data: {
          email: data.email,
          passwordHash,
          nom: data.nom,
          prenom: data.prenom,
          role: Role.ETUDIANT,
          telephone: '0693 00 00 00',
          ville: data.ville,
          codePostal: data.codePostal,
        },
      }),
    ),
  );
  const [lynho, sarah, jules, amelie, hugo, nina, kevin, clara, yanis] = etudiants;

  // ───────── Filières ─────────
  const dev = await prisma.filiere.create({
    data: { nom: 'Développement Web & Logiciel', slug: 'dev' },
  });
  const reseaux = await prisma.filiere.create({
    data: { nom: 'Systèmes, Réseaux & Cybersécurité', slug: 'reseaux' },
  });
  const marketing = await prisma.filiere.create({
    data: { nom: 'Marketing Digital & Communication', slug: 'marketing' },
  });
  const management = await prisma.filiere.create({
    data: { nom: 'Gestion de projet & Management', slug: 'management' },
  });
  const data = await prisma.filiere.create({
    data: { nom: 'Data & Intelligence Artificielle', slug: 'data' },
  });

  // ───────── Catalogue des formations ─────────
  const formationsSeed = [
    {
      slug: 'bts-sio-sisr',
      titre: 'BTS SIO - SISR (Solutions d’Infrastructure, Systèmes et Réseaux)',
      filiereId: reseaux.id,
      libelle: 'Systèmes & Réseaux',
      libelleNiveau: 'Bac +2 • Diplôme d’État',
      type: TypeFormation.CAMPUS,
      niveau: NiveauFormation.BAC_PLUS_2,
      niveauRncp: NiveauRncp.NIVEAU_5,
      rncpCode: 'RNCP38364',
      cpfCode: 'CPF-38364',
      eligibleCpf: true,
      alternance: true,
      duree: '2 ans (1 350 heures)',
      dureeHeures: 1350,
      rythme: '1 semaine en cours / 2 semaines en entreprise',
      lieux: ['Le Port'],
      resume: 'Apprenez à installer, administrer et sécuriser les parcs informatiques, serveurs et équipements réseaux des entreprises réunionnaises.',
      prerequis: [
        'Titulaire d’un Baccalauréat (Général, STI2D, STMG, Bac Pro SN ou équivalent)',
        'Intérêt prononcé pour le matériel informatique, les réseaux et le système',
        'Rigueur, esprit logique et sens du service',
      ],
      objectifs: [
        'Installer, configurer et interconnecter des équipements réseaux (commutateurs, routeurs)',
        'Déployer et administrer des serveurs Windows Server et Linux en environnement virtualisé',
        'Superviser les réseaux et assurer la politique de sauvegarde et de sécurité',
        'Assister les utilisateurs et gérer les incidents d’exploitation',
      ],
      modalitesAcces: [
        'Dossier de candidature en ligne sur expernet-campus.re',
        'Tests de positionnement (logique, culture numérique, anglais)',
        'Entretien individuel de motivation avec l’équipe pédagogique',
        'Job-dating et mise en relation directe avec les entreprises partenaires d’Expernet',
      ],
      debouches: [
        'Technicien Systèmes et Réseaux',
        'Administrateur Réseaux Junior',
        'Technicien Support & Helpdesk N2/N3',
        'Poursuite en Bac+4 Administrateur Système et Réseau (ENI)',
      ],
      certificateur: 'Diplôme d’État - Ministère de l’Enseignement Supérieur',
      prochainesSessions: ['Septembre 2026', 'Octobre 2026'],
      badge: '100% Alternance • 0€ de frais',
      metaDescription: 'BTS SIO SISR en alternance à La Réunion : diplômez-vous technicien systèmes et réseaux.',
      publiee: true,
    },
    {
      slug: 'bts-sio-slam',
      titre: 'BTS SIO - SLAM (Solutions Logicielles et Applications Métiers)',
      filiereId: dev.id,
      libelle: 'Développement Web & Logiciel',
      libelleNiveau: 'Bac +2 • Diplôme d’État',
      type: TypeFormation.CAMPUS,
      niveau: NiveauFormation.BAC_PLUS_2,
      niveauRncp: NiveauRncp.NIVEAU_5,
      rncpCode: 'RNCP38363',
      cpfCode: 'CPF-38363',
      eligibleCpf: true,
      alternance: true,
      duree: '2 ans (1 350 heures)',
      dureeHeures: 1350,
      rythme: '1 semaine en cours / 2 semaines en entreprise',
      lieux: ['Le Port'],
      resume: 'Devenez développeur d’applications web, mobiles et logicielles d’entreprise au cœur de la tech à La Réunion.',
      prerequis: [
        'Titulaire d’un Baccalauréat (toutes séries)',
        'Curiosité pour la programmation, l’algorithmie et les technologies web',
        'Bon esprit d’analyse et de résolution de problèmes',
      ],
      objectifs: [
        'Concevoir et développer des solutions applicatives web et mobiles modernes',
        'Créer et gérer des bases de données relationnelles SQL et NoSQL',
        'Intégrer les bonnes pratiques de sécurité logicielle et de tests automatisés',
        'Collaborer avec Git et les méthodologies Agiles (Scrum)',
      ],
      modalitesAcces: [
        'Dépôt du dossier de candidature en ligne',
        'Évaluation en logique, algorithmie et culture web',
        'Entretien d’orientation et aide à la recherche de contrat d’apprentissage',
      ],
      debouches: [
        'Développeur Web & Mobile',
        'Développeur d’applications métier',
        'Intégrateur Web',
        'Poursuite en Bac+4 Concepteur Développeur d’Applications (ENI)',
      ],
      certificateur: 'Diplôme d’État - Ministère de l’Enseignement Supérieur',
      prochainesSessions: ['Septembre 2026', 'Octobre 2026'],
      badge: 'Alternance rémunérée',
      metaDescription: 'BTS SIO SLAM en alternance à La Réunion : devenez développeur web et mobile.',
      publiee: true,
    },
    {
      slug: 'bac2-graphiste-multimedia',
      titre: 'Graphiste, Multimédia & Intelligence Artificielle',
      filiereId: marketing.id,
      libelle: 'Design & Communication Visuelle',
      libelleNiveau: 'Bac +2 • Titre RNCP Niveau 5',
      type: TypeFormation.CAMPUS,
      niveau: NiveauFormation.BAC_PLUS_2,
      niveauRncp: NiveauRncp.NIVEAU_5,
      rncpCode: 'RNCP37250',
      eligibleCpf: true,
      alternance: true,
      duree: '2 ans (1 200 heures)',
      dureeHeures: 1200,
      rythme: '1 semaine en cours / 2 semaines en entreprise',
      lieux: ['Le Port'],
      resume: 'Apprenez à créer une identité visuelle complète, maîtriser les couleurs, typographies, la suite Adobe et intégrer les outils d’IA générative.',
      prerequis: [
        'Titulaire d’un Baccalauréat',
        'Sensibilité graphique, créativité et appétence pour l’image et le digital',
        'Portfolio ou réalisations personnelles bienvenus',
      ],
      objectifs: [
        'Créer une identité visuelle cohérente et concevoir un brand book / charte graphique',
        'Maîtriser Photoshop, Illustrator, InDesign, Figma et After Effects',
        'Générer des concepts visuels innovants assistés par l’IA (Midjourney, Firefly)',
        'Décliner des supports print et digitaux pour les marques réunionnaises',
      ],
      modalitesAcces: [
        'Dossier artistique / Book et entretien de motivation',
        'Test pratique de créativité visuelle',
      ],
      debouches: [
        'Graphiste Multimédia',
        'Designer Graphique & Web',
        'Infographiste Print & Web',
        'Assistant Directeur Artistique',
      ],
      certificateur: 'Titre certifié par l’État - Niveau 5 RNCP',
      prochainesSessions: ['Septembre 2026'],
      badge: 'Créa & IA Générative',
      metaDescription: 'Titre Bac+2 graphiste multimédia et IA générative en alternance à La Réunion.',
      publiee: true,
    },
    {
      slug: 'bac4-administrateur-systeme-reseau',
      titre: 'Administrateur Système et Réseau (ASR) - Partenariat ENI',
      filiereId: reseaux.id,
      libelle: 'Systèmes & Réseaux',
      libelleNiveau: 'Bac +4 • Titre RNCP Niveau 6 (ENI)',
      type: TypeFormation.CAMPUS,
      niveau: NiveauFormation.BAC_PLUS_3,
      niveauRncp: NiveauRncp.NIVEAU_6,
      rncpCode: 'RNCP36440',
      eligibleCpf: true,
      alternance: true,
      duree: '2 ans (ou 1 an passerelle Bac+3)',
      dureeHeures: 1000,
      rythme: '1 semaine en cours / 3 semaines en entreprise',
      lieux: ['Le Port'],
      resume: 'Formation d’excellence en partenariat avec l’école ENI pour concevoir, sécuriser et administrer les infrastructures Cloud et systèmes hybrides.',
      prerequis: [
        'Titulaire d’un Bac+2 en informatique (BTS SIO SISR, DUT/BUT Réseaux, Titre Pro TSSR)',
        'Maîtrise des fondamentaux réseaux TCP/IP, Linux et Active Directory',
      ],
      objectifs: [
        'Concevoir et administrer des infrastructures Cloud hybrides (Microsoft Azure / AWS)',
        'Automatiser le déploiement et la configuration système avec PowerShell et Ansible',
        'Mettre en œuvre la sécurité périmétrique, les accès VPN et la haute disponibilité',
        'Gérer les projets d’évolution d’infrastructure réseau d’entreprise',
      ],
      modalitesAcces: [
        'Candidature en ligne sur dossier technique',
        'QCM technique officiel ENI et entretien d’orientation',
      ],
      debouches: [
        'Administrateur Systèmes et Réseaux',
        'Ingénieur Support Système',
        'Consultant Infrastructure Cloud Junior',
      ],
      certificateur: 'Titre RNCP Niveau 6 (Bac+4) - Partenariat École ENI',
      prochainesSessions: ['Octobre 2026'],
      badge: 'Partenariat Officiel ENI',
      metaDescription: 'Bac+4 Administrateur Système et Réseau en partenariat ENI, en alternance à La Réunion.',
      publiee: true,
    },
    {
      slug: 'bac4-concepteur-developpeur-applications',
      titre: 'Concepteur Développeur d’Applications (CDA) - Partenariat ENI',
      filiereId: dev.id,
      libelle: 'Développement Web & Logiciel',
      libelleNiveau: 'Bac +4 • Titre RNCP Niveau 6 (ENI)',
      type: TypeFormation.CAMPUS,
      niveau: NiveauFormation.BAC_PLUS_3,
      niveauRncp: NiveauRncp.NIVEAU_6,
      rncpCode: 'RNCP37873',
      eligibleCpf: true,
      alternance: true,
      duree: '2 ans (ou 1 an passerelle Bac+3)',
      dureeHeures: 1000,
      rythme: '1 semaine en cours / 3 semaines en entreprise',
      lieux: ['Le Port'],
      resume: 'Développez des architectures logicielles n-tiers, des applications web & mobiles avec les technologies les plus demandées (Java, React, Node, SQL).',
      prerequis: [
        'Titulaire d’un Bac+2 informatique (BTS SIO SLAM, DUT Informatique, Titre Pro DWWM)',
        'Bases solides en programmation orientée objet et bases de données',
      ],
      objectifs: [
        'Concevoir des architectures applicatives sécurisées en micro-services',
        'Développer des interfaces riches (React, Vue.js, TypeScript)',
        'Concevoir des API REST robustes et intégrer les pipelines DevOps Docker',
        'Piloter le cycle de vie applicatif avec les méthodes agiles Scrum',
      ],
      modalitesAcces: [
        'Dépôt de portfolio GitHub et CV',
        'Évaluation technique en programmation et grand entretien',
      ],
      debouches: [
        'Concepteur Développeur d’Applications',
        'Développeur Full-Stack',
        'Lead Developer Junior',
        'Ingénieur d’Études et Développement',
      ],
      certificateur: 'Titre RNCP Niveau 6 (Bac+4) - Partenariat École ENI',
      prochainesSessions: ['Octobre 2026'],
      badge: 'Partenariat Officiel ENI',
      metaDescription: 'Bac+4 Concepteur Développeur d’Applications en partenariat ENI, en alternance à La Réunion.',
      publiee: true,
    },
    {
      slug: 'bachelor-chef-de-projet-digital',
      titre: 'Bachelor Chef de Projet Digital - Partenariat Digital Campus',
      filiereId: marketing.id,
      libelle: 'Marketing Digital & E-Commerce',
      libelleNiveau: 'Bac +3 • Titre RNCP Niveau 6',
      type: TypeFormation.CAMPUS,
      niveau: NiveauFormation.BAC_PLUS_3,
      niveauRncp: NiveauRncp.NIVEAU_6,
      rncpCode: 'RNCP36340',
      eligibleCpf: true,
      alternance: true,
      duree: '1 an (500 heures)',
      dureeHeures: 500,
      rythme: '1 semaine en cours / 3 semaines en entreprise',
      lieux: ['Le Port'],
      resume: 'Spécialisez-vous en stratégie webmarketing, référencement SEO/SEA, acquisition de trafic, social media et gestion de projet e-commerce.',
      prerequis: [
        'Titulaire d’un Bac+2 (BTS Com, MCO, SAM, Graphisme, DUT TC, etc.)',
        'Excellente culture web, qualités rédactionnelles et créativité',
      ],
      objectifs: [
        'Élaborer et piloter une stratégie marketing digital multicanale à La Réunion',
        'Optimiser la visibilité des marques via le SEO, Google Ads et Meta Ads',
        'Manager les réseaux sociaux et produire des contenus engageants assistés par l’IA',
        'Mesurer et analyser les KPI de performance avec Google Analytics 4',
      ],
      modalitesAcces: [
        'Dossier de candidature et book/projets digitaux',
        'Test de culture générale digitale et entretien de motivation',
      ],
      debouches: [
        'Chef de Projet Digital',
        'Traffic Manager & Spécialiste SEO',
        'Social Media Manager',
        'Responsable E-commerce',
      ],
      certificateur: 'Titre RNCP Niveau 6 - Partenariat Digital Campus',
      prochainesSessions: ['Septembre 2026'],
      badge: 'Réseau Digital Campus',
      metaDescription: 'Bachelor Chef de Projet Digital en alternance à La Réunion avec le réseau Digital Campus.',
      publiee: true,
    },
    {
      slug: 'bac5-hacking-cybersecurite',
      titre: 'Hacking et Cybersécurité - Partenariat ESD (Cybersecurity Academy)',
      filiereId: reseaux.id,
      libelle: 'Cybersécurité & Hacking',
      libelleNiveau: 'Bac +5 • Titre RNCP Niveau 7 (ESD)',
      type: TypeFormation.CAMPUS,
      niveau: NiveauFormation.BAC_PLUS_5,
      niveauRncp: NiveauRncp.NIVEAU_7,
      rncpCode: 'RNCP35282',
      eligibleCpf: true,
      alternance: true,
      duree: '2 ans (1 000 heures)',
      dureeHeures: 1000,
      rythme: '1 semaine en cours / 3 semaines en entreprise',
      lieux: ['Le Port'],
      resume: 'Devenez expert en cybersécurité offensive (Ethical Hacking, pentest) et défensive (SOC, analyse forensique, gouvernance ISO 27001).',
      prerequis: [
        'Bac+3 ou Bac+4 validé en informatique, réseaux ou cybersécurité',
        'Bonnes compétences en systèmes Linux/Windows, scripting et réseaux',
        'Sens rigoureux de l’éthique et de la confidentialité',
      ],
      objectifs: [
        'Mener des audits offensifs (tests d’intrusion web, réseaux, Active Directory)',
        'Détecter et contrer les cyberattaques avancées (SIEM, EDR, Threat Hunting)',
        'Définir et déployer la PSSI selon les référentiels de l’ANSSI et ISO 27001',
        'Gérer les cellules de crise cyber et la remédiation après incident',
      ],
      modalitesAcces: [
        'Dossier technique et épreuve de Hacking / Scénario cyber',
        'Grand oral devant un jury d’experts en sécurité',
      ],
      debouches: [
        'Pentesteur / Hacker Éthique',
        'Analyste SOC / Ingénieur Détection Incident',
        'Consultant en Cybersécurité',
        'Responsable de la Sécurité des SI (RSSI)',
      ],
      certificateur: 'Titre RNCP Niveau 7 - Partenariat ESD Cybersecurity Academy',
      prochainesSessions: ['Octobre 2026'],
      badge: 'Cybersecurity Academy',
      metaDescription: 'Bac+5 Hacking et Cybersécurité en alternance à La Réunion avec ESD Cybersecurity Academy.',
      publiee: true,
    },
    {
      slug: 'bac5-directeur-projet-informatique',
      titre: 'Directeur de Projet Informatique (DPI) - Partenariat IPI',
      filiereId: management.id,
      libelle: 'Management IT & Direction de Projet',
      libelleNiveau: 'Bac +5 • Titre RNCP Niveau 7 (IPI)',
      type: TypeFormation.CAMPUS,
      niveau: NiveauFormation.BAC_PLUS_5,
      niveauRncp: NiveauRncp.NIVEAU_7,
      rncpCode: 'RNCP35185',
      eligibleCpf: true,
      alternance: true,
      duree: '2 ans (960 heures)',
      dureeHeures: 960,
      rythme: '1 semaine en cours / 3 semaines en entreprise',
      lieux: ['Le Port'],
      resume: 'Pilotez la transformation numérique des entreprises réunionnaises, le budget des systèmes d’information et la conduite d’équipes tech.',
      prerequis: [
        'Titulaire d’un Bac+3 ou Bac+4 en informatique, gestion ou sciences de l’ingénieur',
        'Leadership naturel, capacité de vision stratégique et aisance relationnelle',
      ],
      objectifs: [
        'Piloter des projets IT complexes avec les méthodes Agiles à l’échelle (Scrum, SAFe)',
        'Définir les orientations architecturales et la gouvernance des SI',
        'Gérer les budgets technologiques, les contrats prestataires et le ROI',
        'Manager les équipes d’ingénieurs et conduire le changement organisationnel',
      ],
      modalitesAcces: [
        'Étude du parcours académique et professionnel',
        'Cas pratique managérial et entretien de sélection IPI',
      ],
      debouches: [
        'Directeur de Projet Informatique',
        'DSI / Directeur des Systèmes d’Information Junior',
        'Product Owner / Product Manager Senior',
        'Consultant en Transformation Numérique',
      ],
      certificateur: 'Titre RNCP Niveau 7 - Partenariat IPI',
      prochainesSessions: ['Octobre 2026'],
      badge: 'Partenariat IPI France',
      metaDescription: 'Bac+5 Directeur de Projet Informatique en alternance à La Réunion en partenariat IPI.',
      publiee: true,
    },
    {
      slug: 'bac5-expert-strategie-digitale',
      titre: 'Expert en Stratégie Digitale & Brand Content - Partenariat Digital Campus',
      filiereId: marketing.id,
      libelle: 'Stratégie Digitale & IA',
      libelleNiveau: 'Bac +5 • Titre RNCP Niveau 7',
      type: TypeFormation.CAMPUS,
      niveau: NiveauFormation.BAC_PLUS_5,
      niveauRncp: NiveauRncp.NIVEAU_7,
      rncpCode: 'RNCP36140',
      eligibleCpf: true,
      alternance: true,
      duree: '2 ans (960 heures)',
      dureeHeures: 960,
      rythme: '1 semaine en cours / 3 semaines en entreprise',
      lieux: ['Le Port'],
      resume: 'Pilotez les stratégies de marque digitale, le brand content, la transformation par l’IA et la communication d’influence à La Réunion.',
      prerequis: [
        'Bac+3 validé en communication, marketing ou digital',
        'Excellente culture des tendances, esprit de synthèse et vision business',
      ],
      objectifs: [
        'Définir et déployer la stratégie de marque et de brand content omnicanale',
        'Intégrer les technologies d’IA générative dans les processus de production créative',
        'Gérer les budgets marketing, les relations agences et influenceurs',
        'Diriger des équipes créatives et piloter la performance de marque',
      ],
      modalitesAcces: [
        'Dossier de candidature et présentation d’une étude de cas',
        'Grand entretien devant jury professionnel Digital Campus',
      ],
      debouches: [
        'Brand Content Manager',
        'Directeur Marketing Digital',
        'Directeur de Clientèle Agence Web',
        'Consultant Stratégie de Marque',
      ],
      certificateur: 'Titre RNCP Niveau 7 - Partenariat Digital Campus',
      prochainesSessions: ['Octobre 2026'],
      badge: 'Digital Campus Réseau',
      metaDescription: 'Bac+5 Expert en Stratégie Digitale & Brand Content en alternance à La Réunion.',
      publiee: true,
    },
    {
      slug: 'pro-windows-server-powershell',
      titre: 'Administration Windows Server 2022 & Automatisation PowerShell v7',
      filiereId: reseaux.id,
      libelle: 'Systèmes & Réseaux',
      libelleNiveau: 'Formation Certifiante Éditeur',
      type: TypeFormation.PRO,
      niveau: NiveauFormation.CERTIFICATION,
      eligibleCpf: false,
      alternance: false,
      duree: '5 jours (35 heures)',
      dureeHeures: 35,
      rythme: 'Temps plein présentiel ou distanciel',
      lieux: ['Le Port', 'Distanciel'],
      resume: 'Maîtrisez le déploiement et la gestion d’Active Directory, DNS, DHCP, GPO et automatisez les tâches système avec des scripts PowerShell v7.',
      prerequis: ['Bonnes connaissances de l’environnement Windows et notions de base en réseau'],
      objectifs: [
        'Installer, configurer et dépanner Windows Server 2022',
        'Administrer les objets Active Directory Domain Services (AD DS)',
        'Déployer des stratégies de groupe (GPO) sécurisées',
        'Écrire des scripts PowerShell v7 réutilisables pour automatiser les tâches',
      ],
      modalitesAcces: ['Convention de formation entreprise ou prise en charge OPCO'],
      debouches: [
        'Administrateur Système Windows',
        'Technicien d’Exploitation Senior',
        'Spécialiste Support N3',
      ],
      certificateur: 'Attestation Officielle Expernet avec formateur certifié Microsoft',
      prochainesSessions: ['Session chaque mois'],
      badge: 'Formation Pratique Entreprise',
      metaDescription: 'Formation Windows Server 2022 et PowerShell v7 à La Réunion ou en distanciel.',
      publiee: true,
    },
    {
      slug: 'pro-microsoft-365-copilot',
      titre: 'Centre d’Administration Microsoft 365 & Copilot IA en Entreprise',
      filiereId: management.id,
      libelle: 'Cloud Microsoft & IA',
      libelleNiveau: 'Formation Certifiante • Éligible CPF',
      type: TypeFormation.PRO,
      niveau: NiveauFormation.CERTIFICATION,
      cpfCode: 'CPF-M365-COP',
      eligibleCpf: true,
      alternance: false,
      duree: '3 jours (21 heures)',
      dureeHeures: 21,
      rythme: 'Temps plein intensif',
      lieux: ['Le Port', 'Distanciel'],
      resume: 'Prenez en main la gestion des licences Microsoft 365, Teams, SharePoint, la sécurité Entra ID et le déploiement de Copilot IA.',
      prerequis: ['Pratique régulière des outils bureautiques et notions d’administration de base'],
      objectifs: [
        'Gérer les utilisateurs, boîtes partagées et licences dans le centre d’administration',
        'Sécuriser les accès avec l’authentification multifacteur (MFA) et Entra ID',
        'Configurer les espaces collaboratifs SharePoint et Teams',
        'Intégrer Copilot IA dans Word, Excel, PowerPoint et Outlook pour booster la productivité',
      ],
      modalitesAcces: [
        'Inscription directe sur MonCompteFormation (CPF) ou plan de développement entreprise',
      ],
      debouches: [
        'Administrateur Microsoft 365',
        'Référent Outils Collaboratifs & IA',
        'Coordinateur Digital PME',
      ],
      certificateur: 'Certificat de Compétences Professionnelles Expernet',
      prochainesSessions: ['Sessions bi-mensuelles'],
      badge: '100% Éligible CPF',
      metaDescription: 'Formation Microsoft 365 et Copilot IA éligible CPF, à La Réunion ou en distanciel.',
      publiee: true,
    },
    {
      slug: 'pro-cyber-hygiene-rgpd',
      titre: 'Cybersécurité : Hygiène Informatique, Protection des Données & RGPD',
      filiereId: reseaux.id,
      libelle: 'Cybersécurité & Conformité',
      libelleNiveau: 'Référentiel ANSSI • Éligible CPF',
      type: TypeFormation.PRO,
      niveau: NiveauFormation.CERTIFICATION,
      cpfCode: 'CPF-CYB-974',
      eligibleCpf: true,
      alternance: false,
      duree: '3 jours (21 heures)',
      dureeHeures: 21,
      rythme: 'En présentiel ou intra-entreprise',
      lieux: ['Le Port'],
      resume: 'Sensibilisez et formez vos collaborateurs aux cybermenaces réunionnaises (phishing, rançongiciels, faux ordres de virement) et à la conformité RGPD.',
      prerequis: [
        'Aucun prérequis technique nécessaire : accessible à tout collaborateur ou dirigeant',
      ],
      objectifs: [
        'Identifier les pièges de l’ingénierie sociale et les vecteurs d’attaques par email',
        'Appliquer les règles d’hygiène informatique préconisées par l’ANSSI',
        'Mettre en conformité les registres de traitement des données personnelles (RGPD)',
        'Définir la procédure d’alerte et de réaction en cas d’attaque',
      ],
      modalitesAcces: ['Inscription via CPF, OPCO ou convention entreprise'],
      debouches: [
        'Référent Cybersécurité Interne',
        'Délégué à la Protection des Données (DPO)',
        'Responsable Qualité & Conformité',
      ],
      certificateur: 'Attestation Expernet conforme aux recommandations ANSSI',
      prochainesSessions: ['Sessions permanentes'],
      badge: 'Indispensable Entreprises 974',
      metaDescription: 'Sensibilisation cybersécurité et RGPD éligible CPF pour les entreprises réunionnaises.',
      publiee: true,
    },
    {
      slug: 'pro-excel-avance-tosa',
      titre: 'Excel Avancé & Analyse de Données - Certification TOSA Officielle',
      filiereId: management.id,
      libelle: 'Bureautique & Data',
      libelleNiveau: 'Certification TOSA Officielle',
      type: TypeFormation.PRO,
      niveau: NiveauFormation.CERTIFICATION,
      cpfCode: 'CPF-TOSA-XLS',
      eligibleCpf: true,
      alternance: false,
      duree: '4 jours (28 heures)',
      dureeHeures: 28,
      rythme: 'Temps plein ou modules fractionnés',
      lieux: ['Le Port', 'Distanciel'],
      resume: 'Maîtrisez les fonctions complexes d’Excel (RECHERCHEX, tableaux croisés dynamiques, Power Query, macros) avec passage de l’examen TOSA.',
      prerequis: ['Connaissance des fonctions de base d’Excel (calculs simples, mise en forme)'],
      objectifs: [
        'Construire des tableaux de bord dynamiques et percutants',
        'Maîtriser les formules logiques et de recherche avancées (RECHERCHEX, INDEX/EQUIV)',
        'Importer et nettoyer des volumes de données avec Power Query',
        'Obtenir un score maximal à la certification TOSA reconnue par les recruteurs',
      ],
      modalitesAcces: ['Inscription 100% en ligne sur MonCompteFormation (CPF)'],
      debouches: [
        'Contrôleur de Gestion',
        'Assistant(e) de Direction & Gestion',
        'Analyste Données / Opérations',
      ],
      certificateur: 'Certification Internationale TOSA (Isograd)',
      prochainesSessions: ['Session chaque semaine'],
      badge: 'Financement 100% CPF',
      metaDescription: 'Excel avancé et certification TOSA éligible CPF, à La Réunion ou en distanciel.',
      publiee: true,
    },
  ];

  for (const formation of formationsSeed) {
    await prisma.formation.create({ data: formation });
  }

  const bySlug = (slug: string) => prisma.formation.findUniqueOrThrow({ where: { slug } });
  const sioSisr = await bySlug('bts-sio-sisr');
  const sioSlam = await bySlug('bts-sio-slam');
  const cda = await bySlug('bac4-concepteur-developpeur-applications');
  const m365 = await bySlug('pro-microsoft-365-copilot');
  const hacking = await bySlug('bac5-hacking-cybersecurite');

  // ───────── Candidatures (issues du formulaire public) ─────────
  await prisma.candidature.createMany({
    data: [
      {
        reference: 'EXP-482913',
        formationId: sioSlam.id,
        nom: 'Boisrouge',
        prenom: 'Alexandre',
        email: 'a.boisrouge@exemple.re',
        telephone: '+262692112233',
        codePostal: '97420',
        typeDemarche: 'campus',
        statutActuel: 'lyceen',
        motivation: 'Passionné par le développement web depuis le lycée, je souhaite décrocher mon contrat d’apprentissage dès la rentrée.',
        rgpdConsent: true,
        statut: StatutCandidature.ACCEPTEE,
        createdAt: new Date('2026-09-20T10:15:00+04:00'),
      },
      {
        reference: 'EXP-573024',
        formationId: m365.id,
        nom: 'Charpentier',
        prenom: 'Élise',
        email: 'e.charpentier@exemple.re',
        telephone: '0693 44 55 66',
        codePostal: '97400',
        typeDemarche: 'pro',
        statutActuel: 'salarie',
        motivation: 'Mon entreprise souhaite former sa référente Microsoft 365 avant le déploiement de Copilot en janvier.',
        rgpdConsent: true,
        statut: StatutCandidature.EN_ATTENTE,
        createdAt: new Date('2026-10-18T14:32:00+04:00'),
      },
      {
        reference: 'EXP-661207',
        formationId: hacking.id,
        nom: 'Rakotoarisoa',
        prenom: 'Miora',
        email: 'm.rakotoarisoa@exemple.re',
        telephone: '+262692987654',
        codePostal: '97410',
        typeDemarche: 'campus',
        statutActuel: 'reconversion',
        motivation: 'BTS SIO SISR en poche et 3 ans de support N2, je veux me spécialiser en cybersécurité offensive.',
        rgpdConsent: true,
        statut: StatutCandidature.EN_ATTENTE,
        createdAt: new Date('2026-10-21T09:47:00+04:00'),
      },
      {
        reference: 'EXP-704558',
        formationId: null,
        nom: 'David',
        prenom: 'Thomas',
        email: 't.david@exemple.re',
        telephone: '0692 30 40 50',
        codePostal: '97460',
        typeDemarche: 'info',
        statutActuel: 'etudiant',
        motivation: 'Je cherche des informations sur les passerelles Bac+3 après un BUT Informatique.',
        rgpdConsent: true,
        statut: StatutCandidature.EN_ATTENTE,
        createdAt: new Date('2026-10-22T16:05:00+04:00'),
      },
    ],
  });

  // ───────── Promotions & inscriptions ─────────
  const promoSisr = await prisma.promotion.create({
    data: {
      nom: 'BTS SIO SISR 2026-2027',
      formationId: sioSisr.id,
      formateurId: hoarau.id,
      dateDebut: new Date('2026-09-07'),
      dateFin: new Date('2028-07-01'),
    },
  });
  const promoSlam = await prisma.promotion.create({
    data: {
      nom: 'BTS SIO SLAM 2026-2027',
      formationId: sioSlam.id,
      formateurId: menicoce.id,
      dateDebut: new Date('2026-09-07'),
      dateFin: new Date('2028-07-01'),
    },
  });
  const promoCda = await prisma.promotion.create({
    data: {
      nom: 'CDA 2026-2027',
      formationId: cda.id,
      formateurId: menicoce.id,
      dateDebut: new Date('2026-10-19'),
      dateFin: new Date('2027-07-02'),
    },
  });

  await prisma.inscription.createMany({
    data: [
      { promotionId: promoSisr.id, etudiantId: lynho.id },
      { promotionId: promoSisr.id, etudiantId: sarah.id },
      { promotionId: promoSisr.id, etudiantId: jules.id },
      { promotionId: promoSisr.id, etudiantId: amelie.id },
      { promotionId: promoSlam.id, etudiantId: hugo.id },
      { promotionId: promoSlam.id, etudiantId: nina.id },
      { promotionId: promoSlam.id, etudiantId: kevin.id },
      { promotionId: promoCda.id, etudiantId: clara.id },
      { promotionId: promoCda.id, etudiantId: yanis.id },
    ],
  });

  // ───────── Sessions & émargements ─────────
  const sessionCda1 = await prisma.session.create({
    data: {
      promotionId: promoCda.id,
      titre: 'Algorithmique et PHP',
      debut: new Date('2026-10-22T08:30:00+04:00'),
      fin: new Date('2026-10-22T12:30:00+04:00'),
    },
  });
  const sessionCda2 = await prisma.session.create({
    data: {
      promotionId: promoCda.id,
      titre: 'Bases de données',
      debut: new Date('2026-10-22T13:30:00+04:00'),
      fin: new Date('2026-10-22T17:30:00+04:00'),
    },
  });
  await prisma.session.createMany({
    data: [
      {
        promotionId: promoCda.id,
        titre: 'Micro-services & API REST',
        debut: new Date('2026-10-29T09:00:00+04:00'),
        fin: new Date('2026-10-29T12:00:00+04:00'),
      },
      {
        promotionId: promoSisr.id,
        titre: 'Réseaux : commutation et VLAN',
        debut: new Date('2026-10-28T08:30:00+04:00'),
        fin: new Date('2026-10-28T12:30:00+04:00'),
      },
      {
        promotionId: promoSisr.id,
        titre: 'Windows Server 2022 : déploiement',
        debut: new Date('2026-11-04T13:30:00+04:00'),
        fin: new Date('2026-11-04T17:30:00+04:00'),
      },
      {
        promotionId: promoSlam.id,
        titre: 'Django & tests automatisés',
        debut: new Date('2026-11-05T09:00:00+04:00'),
        fin: new Date('2026-11-05T12:00:00+04:00'),
      },
    ],
  });

  // Émargements de la session 1 (les deux étudiants de la promo CDA ont signé)
  const signaturePlaceholder = 'data:image/png;base64,iVBORw0KGgo='; // à remplacer par une vraie signature
  for (const session of [sessionCda1, sessionCda2]) {
    for (const [etudiant, heure] of [
      [clara, '2026-10-22T08:41:12+04:00'],
      [yanis, '2026-10-22T08:44:57+04:00'],
    ] as const) {
      const signeLe = new Date(
        session.id === sessionCda2.id
          ? '2026-10-22T13:35:00+04:00'
          : heure,
      );
      await prisma.emargement.create({
        data: {
          sessionId: session.id,
          etudiantId: etudiant.id,
          signature: signaturePlaceholder,
          signeLe,
          adresseIp: '127.0.0.1',
          empreinte: empreinte(session.id, etudiant.id, signeLe, signaturePlaceholder),
        },
      });
    }
  }

  // ───────── Compétences, examens, jurys, évaluations ─────────
  const cdaC1 = await prisma.competence.create({
    data: { formationId: cda.id, code: 'C1', libelle: 'Développer une application sécurisée' },
  });
  const cdaC2 = await prisma.competence.create({
    data: { formationId: cda.id, code: 'C2', libelle: 'Concevoir une base de données' },
  });
  const cdaC3 = await prisma.competence.create({
    data: { formationId: cda.id, code: 'C3', libelle: 'Piloter un projet avec les méthodes agiles' },
  });
  await prisma.competence.createMany({
    data: [
      { formationId: sioSisr.id, code: 'R1', libelle: 'Installer et configurer des équipements réseaux' },
      { formationId: sioSisr.id, code: 'R2', libelle: 'Administrer des serveurs Windows et Linux' },
    ],
  });

  const examenCda = await prisma.examen.create({
    data: {
      promotionId: promoCda.id,
      intitule: 'Soutenance finale CDA',
      dateExamen: new Date('2027-06-25T09:00:00+04:00'),
      salle: 'B12',
    },
  });
  await prisma.examen.create({
    data: {
      promotionId: promoSisr.id,
      intitule: 'Épreuves professionnelles BTS SISR',
      dateExamen: new Date('2028-06-13T08:30:00+04:00'),
      salle: 'A3',
    },
  });

  await prisma.juryMembre.createMany({
    data: [
      { examenId: examenCda.id, userId: marie.id, roleJury: RoleJury.PRESIDENT },
      { examenId: examenCda.id, userId: menicoce.id, roleJury: RoleJury.MEMBRE },
    ],
  });

  await prisma.evaluation.createMany({
    data: [
      {
        examenId: examenCda.id,
        etudiantId: clara.id,
        competenceId: cdaC1.id,
        niveau: NiveauAcquisition.ACQUIS,
        commentaire: 'Bonne maîtrise de la sécurité applicative',
      },
      {
        examenId: examenCda.id,
        etudiantId: clara.id,
        competenceId: cdaC2.id,
        niveau: NiveauAcquisition.EN_COURS,
        commentaire: 'Normalisation à revoir',
      },
      {
        examenId: examenCda.id,
        etudiantId: clara.id,
        competenceId: cdaC3.id,
        niveau: NiveauAcquisition.ACQUIS,
      },
      {
        examenId: examenCda.id,
        etudiantId: yanis.id,
        competenceId: cdaC1.id,
        niveau: NiveauAcquisition.EN_COURS,
        commentaire: 'Tests automatisés à consolider',
      },
      {
        examenId: examenCda.id,
        etudiantId: yanis.id,
        competenceId: cdaC2.id,
        niveau: NiveauAcquisition.NON_ACQUIS,
        commentaire: 'À revoir avant la session de rattrapage',
      },
      {
        examenId: examenCda.id,
        etudiantId: yanis.id,
        competenceId: cdaC3.id,
        niveau: NiveauAcquisition.ACQUIS,
      },
    ],
  });

  // ───────── Collaboration : canaux, messages, documents ─────────
  const general = await prisma.canal.create({ data: { nom: 'général' } });
  const annoncesCda = await prisma.canal.create({
    data: { nom: 'annonces', promotionId: promoCda.id },
  });
  const annoncesSisr = await prisma.canal.create({
    data: { nom: 'annonces', promotionId: promoSisr.id },
  });
  const annoncesSlam = await prisma.canal.create({
    data: { nom: 'annonces', promotionId: promoSlam.id },
  });

  const bienvenue = await prisma.message.create({
    data: {
      canalId: annoncesCda.id,
      auteurId: menicoce.id,
      contenu: 'Bienvenue dans la promotion CDA 2026-2027 ! Les sessions commencent ce jeudi à 9h.',
    },
  });
  await prisma.message.create({
    data: {
      canalId: annoncesSisr.id,
      auteurId: hoarau.id,
      contenu: 'Rappel : la session « Réseaux : commutation et VLAN » a lieu le 28 octobre à 8h30, salle B10.',
    },
  });
  const planningSemaine = await prisma.message.create({
    data: {
      canalId: general.id,
      auteurId: marie.id,
      contenu: 'Le planning de la semaine est disponible sur le portail.',
    },
  });
  await prisma.message.createMany({
    data: [
      {
        canalId: annoncesCda.id,
        auteurId: clara.id,
        contenu: 'Merci, content d’être là !',
        parentId: bienvenue.id,
      },
      {
        canalId: general.id,
        auteurId: hugo.id,
        contenu: 'Merci Marie, bien reçu 👍',
        parentId: planningSemaine.id,
      },
    ],
  });

  await prisma.document.create({
    data: {
      titre: 'Consignes du projet Expernet',
      nomFichier: 'consignes-projet.pdf',
      cheminStockage: 'uploads/demo/consignes-projet.pdf',
      typeMime: 'application/pdf',
      tailleOctets: 120_000,
      auteurId: menicoce.id,
      promotionId: promoCda.id,
      canalId: annoncesCda.id,
    },
  });
  await prisma.document.create({
    data: {
      titre: 'Planning des évaluations 2027',
      nomFichier: 'planning-evaluations-2027.pdf',
      cheminStockage: 'uploads/demo/planning-evaluations-2027.pdf',
      typeMime: 'application/pdf',
      tailleOctets: 85_000,
      auteurId: marie.id,
      canalId: general.id,
    },
  });

  // ───────── Agenda public (planning du site) ─────────
  await prisma.planningEvent.createMany({
    data: [
      {
        titre: 'Rentrée BTS SIO 1re année',
        type: PlanningType.FORMATION,
        date: new Date('2026-09-07'),
        heure: '08h30',
        site: 'Le Port',
        description: 'Accueil des alternants SISR et SLAM, remise des plannings et rencontre des tuteurs.',
        lienLabel: 'Voir le BTS SIO',
        lienUrl: '/formations?type=campus',
      },
      {
        titre: 'Rentrée Bachelors & Mastères',
        type: PlanningType.FORMATION,
        date: new Date('2026-09-14'),
        heure: '09h00',
        site: 'Le Port',
        description: 'Journée d’intégration des cursus Bac+3 et Bac+5 en alternance.',
        lienLabel: 'Voir les formations Campus',
        lienUrl: '/formations?type=campus',
      },
      {
        titre: 'Session Windows Server 2022 & PowerShell v7',
        type: PlanningType.FORMATION,
        date: new Date('2026-10-12'),
        dateFin: new Date('2026-10-16'),
        heure: '09h00 - 17h00',
        site: 'Le Port ou distanciel',
        description: '5 jours pour administrer un parc Windows Server et automatiser les tâches récurrentes.',
        lienLabel: 'Détails de la session',
        lienUrl: '/formations?type=pro',
      },
      {
        titre: 'Atelier « Décrocher son alternance »',
        type: PlanningType.ATELIER,
        date: new Date('2026-10-28'),
        heure: '14h00 - 16h00',
        site: 'Le Port',
        description: 'CV, lettre de motivation et préparation d’entretien avec l’équipe développement alternance.',
        lienLabel: 'Je prépare ma candidature',
        lienUrl: '/candidature',
      },
      {
        titre: 'Session Microsoft 365 & Copilot',
        type: PlanningType.FORMATION,
        date: new Date('2026-11-04'),
        dateFin: new Date('2026-11-06'),
        heure: '09h00 - 17h00',
        site: 'Le Port ou distanciel',
        description: '3 jours pour exploiter Teams, SharePoint et l’IA Copilot au quotidien.',
        lienLabel: 'Voir Expernet Pro',
        lienUrl: '/expernet-pro',
      },
      {
        titre: 'Journée portes ouvertes — Campus Le Port',
        type: PlanningType.EVENEMENT,
        date: new Date('2026-11-18'),
        heure: '09h00 - 17h00',
        site: 'Le Port',
        description: 'Rencontre avec les formateurs, visite des locaux et échanges avec les alternants.',
        lienLabel: 'Je réserve ma place',
        lienUrl: '/candidature',
      },
      {
        titre: 'Job dating alternance',
        type: PlanningType.EVENEMENT,
        date: new Date('2026-12-02'),
        heure: '13h30 - 18h00',
        site: 'Le Port',
        description: 'Rencontrez plus de 30 entreprises réunionnaises qui recrutent des alternants.',
        lienLabel: 'Déposer un dossier',
        lienUrl: '/candidature',
      },
      {
        titre: 'Session Excel — certification TOSA',
        type: PlanningType.FORMATION,
        date: new Date('2026-12-09'),
        dateFin: new Date('2026-12-11'),
        heure: '09h00 - 17h00',
        site: 'Le Port',
        description: 'Montée en compétences sur Excel et passage de la certification TOSA.',
        lienLabel: 'Voir la formation',
        lienUrl: '/formations?type=pro',
      },
      {
        titre: 'Atelier CV & entretien',
        type: PlanningType.ATELIER,
        date: new Date('2027-01-13'),
        heure: '14h00 - 17h00',
        site: 'Le Port',
        description: 'Atelier pratique animé par les conseillères en formation du Campus Le Port.',
        lienLabel: 'Je participe',
        lienUrl: '/candidature',
      },
      {
        titre: 'Session Cybersécurité — bonnes pratiques ANSSI',
        type: PlanningType.FORMATION,
        date: new Date('2027-02-03'),
        dateFin: new Date('2027-02-05'),
        heure: '09h00 - 17h00',
        site: 'Le Port ou intra-entreprise',
        description: 'Sensibilisation et hygiène numérique pour les équipes et les décideurs.',
        lienLabel: 'Voir Expernet Pro',
        lienUrl: '/expernet-pro',
      },
      {
        titre: 'Journée portes ouvertes — Campus Le Port',
        type: PlanningType.EVENEMENT,
        date: new Date('2027-03-10'),
        heure: '09h00 - 17h00',
        site: 'Le Port',
        description: 'Présentation des cursus, ateliers découverte et témoignages d’anciens.',
        lienLabel: 'Je réserve ma place',
        lienUrl: '/candidature',
      },
      {
        titre: 'Examens blancs BTS SIO',
        type: PlanningType.EXAMEN,
        date: new Date('2027-04-07'),
        dateFin: new Date('2027-04-09'),
        heure: '08h30 - 12h30',
        site: 'Le Port',
        description: 'Mise en situation sur les épreuves professionnelles et les projets SISR/SLAM.',
      },
      {
        titre: 'Speed recruiting alternance',
        type: PlanningType.EVENEMENT,
        date: new Date('2027-05-12'),
        heure: '13h30 - 18h00',
        site: 'Le Port',
        description: 'Entretiens express avec les entreprises partenaires pour la rentrée 2027.',
        lienLabel: 'Déposer un dossier',
        lienUrl: '/candidature',
      },
      {
        titre: 'Épreuves écrites BTS SIO',
        type: PlanningType.EXAMEN,
        date: new Date('2027-06-09'),
        dateFin: new Date('2027-06-11'),
        site: 'Le Port',
        description: 'Épreuves nationales du BTS Services informatiques aux organisations.',
      },
      {
        titre: 'Jury de certification',
        type: PlanningType.EXAMEN,
        date: new Date('2027-07-06'),
        dateFin: new Date('2027-07-08'),
        site: 'Le Port',
        description: 'Passage devant le jury pour les titres RNCP et les certificats professionnels.',
      },
      {
        titre: 'Rentrée 2027-2028',
        type: PlanningType.FORMATION,
        date: new Date('2027-09-06'),
        heure: '08h30',
        site: 'Le Port',
        description: 'Accueil des nouvelles promotions du Campus et des sessions Expernet Pro.',
        lienLabel: 'Candidater',
        lienUrl: '/candidature',
      },
    ],
  });

  console.log('Base remplie avec les données de démonstration.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
