import type { Formation } from '@/types/formation';

export const MOCK_FORMATIONS: Formation[] = [
  {
    id: 'bts-sio-sisr',
    title: 'BTS SIO - SISR (Solutions d’Infrastructure, Systèmes et Réseaux)',
    slug: 'bts-sio-sisr',
    category: 'reseaux',
    categoryLabel: 'Systèmes & Réseaux',
    type: 'campus',
    typeLabel: 'Expernet Campus (Alternance)',
    level: 'bac+2',
    levelLabel: 'Bac +2 • Diplôme d’État',
    rncpCode: 'RNCP38364',
    cpfCode: 'CPF-38364',
    duration: '2 ans (1 350 heures)',
    pace: '1 semaine en cours / 2 semaines en entreprise',
    isCpfEligible: true,
    isAlternance: true,
    campus: ['Le Port'],
    shortDescription: 'Apprenez à installer, administrer et sécuriser les parcs informatiques, serveurs et équipements réseaux des entreprises réunionnaises.',
    prerequisites: [
      'Titulaire d’un Baccalauréat (Général, STI2D, STMG, Bac Pro SN ou équivalent)',
      'Intérêt prononcé pour le matériel informatique, les réseaux et le système',
      'Rigueur, esprit logique et sens du service'
    ],
    objectives: [
      'Installer, configurer et interconnecter des équipements réseaux (commutateurs, routeurs)',
      'Déployer et administrer des serveurs Windows Server et Linux en environnement virtualisé',
      'Superviser les réseaux et assurer la politique de sauvegarde et de sécurité',
      'Assister les utilisateurs et gérer les incidents d’exploitation'
    ],
    admissionModalities: [
      'Dossier de candidature en ligne sur expernet-campus.re',
      'Tests de positionnement (logique, culture numérique, anglais)',
      'Entretien individuel de motivation avec l’équipe pédagogique',
      'Job-dating et mise en relation directe avec les entreprises partenaires d’Expernet'
    ],
    careerOutcomes: [
      'Technicien Systèmes et Réseaux',
      'Administrateur Réseaux Junior',
      'Technicien Support & Helpdesk N2/N3',
      'Poursuite en Bac+4 Administrateur Système et Réseau (ENI)'
    ],
    certifyingPartner: 'Diplôme d’État - Ministère de l’Enseignement Supérieur',
    startingDates: ['Septembre 2026', 'Octobre 2026'],
    badge: '100% Alternance • 0€ de frais'
  },
  {
    id: 'bts-sio-slam',
    title: 'BTS SIO - SLAM (Solutions Logicielles et Applications Métiers)',
    slug: 'bts-sio-slam',
    category: 'dev',
    categoryLabel: 'Développement Web & Logiciel',
    type: 'campus',
    typeLabel: 'Expernet Campus (Alternance)',
    level: 'bac+2',
    levelLabel: 'Bac +2 • Diplôme d’État',
    rncpCode: 'RNCP38363',
    cpfCode: 'CPF-38363',
    duration: '2 ans (1 350 heures)',
    pace: '1 semaine en cours / 2 semaines en entreprise',
    isCpfEligible: true,
    isAlternance: true,
    campus: ['Le Port'],
    shortDescription: 'Devenez développeur d’applications web, mobiles et logicielles d’entreprise au cœur de la tech à La Réunion.',
    prerequisites: [
      'Titulaire d’un Baccalauréat (toutes séries)',
      'Curiosité pour la programmation, l’algorithmie et les technologies web',
      'Bon esprit d’analyse et de résolution de problèmes'
    ],
    objectives: [
      'Concevoir et développer des solutions applicatives web et mobiles modernes',
      'Créer et gérer des bases de données relationnelles SQL et NoSQL',
      'Intégrer les bonnes pratiques de sécurité logicielle et de tests automatisés',
      'Collaborer avec Git et les méthodologies Agiles (Scrum)'
    ],
    admissionModalities: [
      'Dépôt du dossier de candidature en ligne',
      'Évaluation en logique, algorithmie et culture web',
      'Entretien d’orientation et aide à la recherche de contrat d’apprentissage'
    ],
    careerOutcomes: [
      'Développeur Web & Mobile',
      'Développeur d’applications métier',
      'Intégrateur Web',
      'Poursuite en Bac+4 Concepteur Développeur d’Applications (ENI)'
    ],
    certifyingPartner: 'Diplôme d’État - Ministère de l’Enseignement Supérieur',
    startingDates: ['Septembre 2026', 'Octobre 2026'],
    badge: 'Alternance rémunérée'
  },
  {
    id: 'bac2-graphiste-multimedia',
    title: 'Graphiste, Multimédia & Intelligence Artificielle',
    slug: 'bac2-graphiste-multimedia',
    category: 'marketing',
    categoryLabel: 'Design & Communication Visuelle',
    type: 'campus',
    typeLabel: 'Expernet Campus (Alternance)',
    level: 'bac+2',
    levelLabel: 'Bac +2 • Titre RNCP Niveau 5',
    rncpCode: 'RNCP37250',
    duration: '2 ans (1 200 heures)',
    pace: '1 semaine en cours / 2 semaines en entreprise',
    isCpfEligible: true,
    isAlternance: true,
    campus: ['Le Port'],
    shortDescription: 'Apprenez à créer une identité visuelle complète, maîtriser les couleurs, typographies, la suite Adobe et intégrer les outils d’IA générative.',
    prerequisites: [
      'Titulaire d’un Baccalauréat',
      'Sensibilité graphique, créativité et appétence pour l’image et le digital',
      'Portfolio ou réalisations personnelles bienvenus'
    ],
    objectives: [
      'Créer une identité visuelle cohérente et concevoir un brand book / charte graphique',
      'Maîtriser Photoshop, Illustrator, InDesign, Figma et After Effects',
      'Générer des concepts visuels innovants assistés par l’IA (Midjourney, Firefly)',
      'Décliner des supports print et digitaux pour les marques réunionnaises'
    ],
    admissionModalities: [
      'Dossier artistique / Book et entretien de motivation',
      'Test pratique de créativité visuelle'
    ],
    careerOutcomes: [
      'Graphiste Multimédia',
      'Designer Graphique & Web',
      'Infographiste Print & Web',
      'Assistant Directeur Artistique'
    ],
    certifyingPartner: 'Titre certifié par l’État - Niveau 5 RNCP',
    startingDates: ['Septembre 2026'],
    badge: 'Créa & IA Générative'
  },
  {
    id: 'bac4-administrateur-systeme-reseau',
    title: 'Administrateur Système et Réseau (ASR) - Partenariat ENI',
    slug: 'bac4-administrateur-systeme-reseau',
    category: 'reseaux',
    categoryLabel: 'Systèmes & Réseaux',
    type: 'campus',
    typeLabel: 'Expernet Campus (Alternance)',
    level: 'bac+3',
    levelLabel: 'Bac +4 • Titre RNCP Niveau 6 (ENI)',
    rncpCode: 'RNCP36440',
    duration: '2 ans (ou 1 an passerelle Bac+3)',
    pace: '1 semaine en cours / 3 semaines en entreprise',
    isCpfEligible: true,
    isAlternance: true,
    campus: ['Le Port'],
    shortDescription: 'Formation d’excellence en partenariat avec l’école ENI pour concevoir, sécuriser et administrer les infrastructures Cloud et systèmes hybrides.',
    prerequisites: [
      'Titulaire d’un Bac+2 en informatique (BTS SIO SISR, DUT/BUT Réseaux, Titre Pro TSSR)',
      'Maîtrise des fondamentaux réseaux TCP/IP, Linux et Active Directory'
    ],
    objectives: [
      'Concevoir et administrer des infrastructures Cloud hybrides (Microsoft Azure / AWS)',
      'Automatiser le déploiement et la configuration système avec PowerShell et Ansible',
      'Mettre en œuvre la sécurité périmétrique, les accès VPN et la haute disponibilité',
      'Gérer les projets d’évolution d’infrastructure réseau d’entreprise'
    ],
    admissionModalities: [
      'Candidature en ligne sur dossier technique',
      'QCM technique officiel ENI et entretien d’orientation'
    ],
    careerOutcomes: [
      'Administrateur Systèmes et Réseaux',
      'Ingénieur Support Système',
      'Consultant Infrastructure Cloud Junior'
    ],
    certifyingPartner: 'Titre RNCP Niveau 6 (Bac+4) - Partenariat École ENI',
    startingDates: ['Octobre 2026'],
    badge: 'Partenariat Officiel ENI'
  },
  {
    id: 'bac4-concepteur-developpeur-applications',
    title: 'Concepteur Développeur d’Applications (CDA) - Partenariat ENI',
    slug: 'bac4-concepteur-developpeur-applications',
    category: 'dev',
    categoryLabel: 'Développement Web & Logiciel',
    type: 'campus',
    typeLabel: 'Expernet Campus (Alternance)',
    level: 'bac+3',
    levelLabel: 'Bac +4 • Titre RNCP Niveau 6 (ENI)',
    rncpCode: 'RNCP37873',
    duration: '2 ans (ou 1 an passerelle Bac+3)',
    pace: '1 semaine en cours / 3 semaines en entreprise',
    isCpfEligible: true,
    isAlternance: true,
    campus: ['Le Port'],
    shortDescription: 'Développez des architectures logicielles n-tiers, des applications web & mobiles avec les technologies les plus demandées (Java, React, Node, SQL).',
    prerequisites: [
      'Titulaire d’un Bac+2 informatique (BTS SIO SLAM, DUT Informatique, Titre Pro DWWM)',
      'Bases solides en programmation orientée objet et bases de données'
    ],
    objectives: [
      'Concevoir des architectures applicatives sécurisées en micro-services',
      'Développer des interfaces riches (React, Vue.js, TypeScript)',
      'Concevoir des API REST robustes et intégrer les pipelines DevOps Docker',
      'Piloter le cycle de vie applicatif avec les méthodes agiles Scrum'
    ],
    admissionModalities: [
      'Dépôt de portfolio GitHub et CV',
      'Évaluation technique en programmation et grand entretien'
    ],
    careerOutcomes: [
      'Concepteur Développeur d’Applications',
      'Développeur Full-Stack',
      'Lead Developer Junior',
      'Ingénieur d’Études et Développement'
    ],
    certifyingPartner: 'Titre RNCP Niveau 6 (Bac+4) - Partenariat École ENI',
    startingDates: ['Octobre 2026'],
    badge: 'Partenariat Officiel ENI'
  },
  {
    id: 'bachelor-chef-de-projet-digital',
    title: 'Bachelor Chef de Projet Digital - Partenariat Digital Campus',
    slug: 'bachelor-chef-de-projet-digital',
    category: 'marketing',
    categoryLabel: 'Marketing Digital & E-Commerce',
    type: 'campus',
    typeLabel: 'Expernet Campus (Alternance)',
    level: 'bac+3',
    levelLabel: 'Bac +3 • Titre RNCP Niveau 6',
    rncpCode: 'RNCP36340',
    duration: '1 an (500 heures)',
    pace: '1 semaine en cours / 3 semaines en entreprise',
    isCpfEligible: true,
    isAlternance: true,
    campus: ['Le Port'],
    shortDescription: 'Spécialisez-vous en stratégie webmarketing, référencement SEO/SEA, acquisition de trafic, social media et gestion de projet e-commerce.',
    prerequisites: [
      'Titulaire d’un Bac+2 (BTS Com, MCO, SAM, Graphisme, DUT TC, etc.)',
      'Excellente culture web, qualités rédactionnelles et créativité'
    ],
    objectives: [
      'Élaborer et piloter une stratégie marketing digital multicanale à La Réunion',
      'Optimiser la visibilité des marques via le SEO, Google Ads et Meta Ads',
      'Manager les réseaux sociaux et produire des contenus engageants assistés par l’IA',
      'Mesurer et analyser les KPI de performance avec Google Analytics 4'
    ],
    admissionModalities: [
      'Dossier de candidature et book/projets digitaux',
      'Test de culture générale digitale et entretien de motivation'
    ],
    careerOutcomes: [
      'Chef de Projet Digital',
      'Traffic Manager & Spécialiste SEO',
      'Social Media Manager',
      'Responsable E-commerce'
    ],
    certifyingPartner: 'Titre RNCP Niveau 6 - Partenariat Digital Campus',
    startingDates: ['Septembre 2026'],
    badge: 'Réseau Digital Campus'
  },
  {
    id: 'bac5-hacking-cybersecurite',
    title: 'Hacking et Cybersécurité - Partenariat ESD (Cybersecurity Academy)',
    slug: 'bac5-hacking-cybersecurite',
    category: 'reseaux',
    categoryLabel: 'Cybersécurité & Hacking',
    type: 'campus',
    typeLabel: 'Expernet Campus (Alternance)',
    level: 'bac+5',
    levelLabel: 'Bac +5 • Titre RNCP Niveau 7 (ESD)',
    rncpCode: 'RNCP35282',
    duration: '2 ans (1 000 heures)',
    pace: '1 semaine en cours / 3 semaines en entreprise',
    isCpfEligible: true,
    isAlternance: true,
    campus: ['Le Port'],
    shortDescription: 'Devenez expert en cybersécurité offensive (Ethical Hacking, pentest) et défensive (SOC, analyse forensique, gouvernance ISO 27001).',
    prerequisites: [
      'Bac+3 ou Bac+4 validé en informatique, réseaux ou cybersécurité',
      'Bonnes compétences en systèmes Linux/Windows, scripting et réseaux',
      'Sens rigoureux de l’éthique et de la confidentialité'
    ],
    objectives: [
      'Mener des audits offensifs (tests d’intrusion web, réseaux, Active Directory)',
      'Détecter et contrer les cyberattaques avancées (SIEM, EDR, Threat Hunting)',
      'Définir et déployer la PSSI selon les référentiels de l’ANSSI et ISO 27001',
      'Gérer les cellules de crise cyber et la remédiation après incident'
    ],
    admissionModalities: [
      'Dossier technique et épreuve de Hacking / Scénario cyber',
      'Grand oral devant un jury d’experts en sécurité'
    ],
    careerOutcomes: [
      'Pentesteur / Hacker Éthique',
      'Analyste SOC / Ingénieur Détection Incident',
      'Consultant en Cybersécurité',
      'Responsable de la Sécurité des SI (RSSI)'
    ],
    certifyingPartner: 'Titre RNCP Niveau 7 - Partenariat ESD Cybersecurity Academy',
    startingDates: ['Octobre 2026'],
    badge: 'Cybersecurity Academy'
  },
  {
    id: 'bac5-directeur-projet-informatique',
    title: 'Directeur de Projet Informatique (DPI) - Partenariat IPI',
    slug: 'bac5-directeur-projet-informatique',
    category: 'management',
    categoryLabel: 'Management IT & Direction de Projet',
    type: 'campus',
    typeLabel: 'Expernet Campus (Alternance)',
    level: 'bac+5',
    levelLabel: 'Bac +5 • Titre RNCP Niveau 7 (IPI)',
    rncpCode: 'RNCP35185',
    duration: '2 ans (960 heures)',
    pace: '1 semaine en cours / 3 semaines en entreprise',
    isCpfEligible: true,
    isAlternance: true,
    campus: ['Le Port'],
    shortDescription: 'Pilotez la transformation numérique des entreprises réunionnaises, le budget des systèmes d’information et la conduite d’équipes tech.',
    prerequisites: [
      'Titulaire d’un Bac+3 ou Bac+4 en informatique, gestion ou sciences de l’ingénieur',
      'Leadership naturel, capacité de vision stratégique et aisance relationnelle'
    ],
    objectives: [
      'Piloter des projets IT complexes avec les méthodes Agiles à l’échelle (Scrum, SAFe)',
      'Définir les orientations architecturales et la gouvernance des SI',
      'Gérer les budgets technologiques, les contrats prestataires et le ROI',
      'Manager les équipes d’ingénieurs et conduire le changement organisationnel'
    ],
    admissionModalities: [
      'Étude du parcours académique et professionnel',
      'Cas pratique managérial et entretien de sélection IPI'
    ],
    careerOutcomes: [
      'Directeur de Projet Informatique',
      'DSI / Directeur des Systèmes d’Information Junior',
      'Product Owner / Product Manager Senior',
      'Consultant en Transformation Numérique'
    ],
    certifyingPartner: 'Titre RNCP Niveau 7 - Partenariat IPI',
    startingDates: ['Octobre 2026'],
    badge: 'Partenariat IPI France'
  },
  {
    id: 'bac5-expert-strategie-digitale',
    title: 'Expert en Stratégie Digitale & Brand Content - Partenariat Digital Campus',
    slug: 'bac5-expert-strategie-digitale',
    category: 'marketing',
    categoryLabel: 'Stratégie Digitale & IA',
    type: 'campus',
    typeLabel: 'Expernet Campus (Alternance)',
    level: 'bac+5',
    levelLabel: 'Bac +5 • Titre RNCP Niveau 7',
    rncpCode: 'RNCP36140',
    duration: '2 ans (960 heures)',
    pace: '1 semaine en cours / 3 semaines en entreprise',
    isCpfEligible: true,
    isAlternance: true,
    campus: ['Le Port'],
    shortDescription: 'Pilotez les stratégies de marque digitale, le brand content, la transformation par l’IA et la communication d’influence à La Réunion.',
    prerequisites: [
      'Bac+3 validé en communication, marketing ou digital',
      'Excellente culture des tendances, esprit de synthèse et vision business'
    ],
    objectives: [
      'Définir et déployer la stratégie de marque et de brand content omnicanale',
      'Intégrer les technologies d’IA générative dans les processus de production créative',
      'Gérer les budgets marketing, les relations agences et influenceurs',
      'Diriger des équipes créatives et piloter la performance de marque'
    ],
    admissionModalities: [
      'Dossier de candidature et présentation d’une étude de cas',
      'Grand entretien devant jury professionnel Digital Campus'
    ],
    careerOutcomes: [
      'Brand Content Manager',
      'Directeur Marketing Digital',
      'Directeur de Clientèle Agence Web',
      'Consultant Stratégie de Marque'
    ],
    certifyingPartner: 'Titre RNCP Niveau 7 - Partenariat Digital Campus',
    startingDates: ['Octobre 2026'],
    badge: 'Digital Campus Réseau'
  },
  {
    id: 'pro-windows-server-powershell',
    title: 'Administration Windows Server 2022 & Automatisation PowerShell v7',
    slug: 'pro-windows-server-powershell',
    category: 'reseaux',
    categoryLabel: 'Systèmes & Réseaux',
    type: 'pro',
    typeLabel: 'Expernet Pro (Formation Continue)',
    level: 'certification',
    levelLabel: 'Formation Certifiante Éditeur',
    duration: '5 jours (35 heures)',
    pace: 'Temps plein présentiel ou distanciel',
    isCpfEligible: false,
    isAlternance: false,
    campus: ['Le Port', 'Distanciel'],
    shortDescription: 'Maîtrisez le déploiement et la gestion d’Active Directory, DNS, DHCP, GPO et automatisez les tâches système avec des scripts PowerShell v7.',
    prerequisites: [
      'Bonnes connaissances de l’environnement Windows et notions de base en réseau'
    ],
    objectives: [
      'Installer, configurer et dépanner Windows Server 2022',
      'Administrer les objets Active Directory Domain Services (AD DS)',
      'Déployer des stratégies de groupe (GPO) sécurisées',
      'Écrire des scripts PowerShell v7 réutilisables pour automatiser les tâches'
    ],
    admissionModalities: [
      'Convention de formation entreprise ou prise en charge OPCO'
    ],
    careerOutcomes: [
      'Administrateur Système Windows',
      'Technicien d’Exploitation Senior',
      'Spécialiste Support N3'
    ],
    certifyingPartner: 'Attestation Officielle Expernet avec formateur certifié Microsoft',
    startingDates: ['Session chaque mois'],
    badge: 'Formation Pratique Entreprise'
  },
  {
    id: 'pro-microsoft-365-copilot',
    title: 'Centre d’Administration Microsoft 365 & Copilot IA en Entreprise',
    slug: 'pro-microsoft-365-copilot',
    category: 'management',
    categoryLabel: 'Cloud Microsoft & IA',
    type: 'pro',
    typeLabel: 'Expernet Pro (Formation Continue & CPF)',
    level: 'certification',
    levelLabel: 'Formation Certifiante • Éligible CPF',
    cpfCode: 'CPF-M365-COP',
    duration: '3 jours (21 heures)',
    pace: 'Temps plein intensif',
    isCpfEligible: true,
    isAlternance: false,
    campus: ['Le Port', 'Distanciel'],
    shortDescription: 'Prenez en main la gestion des licences Microsoft 365, Teams, SharePoint, la sécurité Entra ID et le déploiement de Copilot IA.',
    prerequisites: [
      'Pratique régulière des outils bureautiques et notions d’administration de base'
    ],
    objectives: [
      'Gérer les utilisateurs, boîtes partagées et licences dans le centre d’administration',
      'Sécuriser les accès avec l’authentification multifacteur (MFA) et Entra ID',
      'Configurer les espaces collaboratifs SharePoint et Teams',
      'Intégrer Copilot IA dans Word, Excel, PowerPoint et Outlook pour booster la productivité'
    ],
    admissionModalities: [
      'Inscription directe sur MonCompteFormation (CPF) ou plan de développement entreprise'
    ],
    careerOutcomes: [
      'Administrateur Microsoft 365',
      'Référent Outils Collaboratifs & IA',
      'Coordinateur Digital PME'
    ],
    certifyingPartner: 'Certificat de Compétences Professionnelles Expernet',
    startingDates: ['Sessions bi-mensuelles'],
    badge: '100% Éligible CPF'
  },
  {
    id: 'pro-cyber-hygiene-rgpd',
    title: 'Cybersécurité : Hygiène Informatique, Protection des Données & RGPD',
    slug: 'pro-cyber-hygiene-rgpd',
    category: 'reseaux',
    categoryLabel: 'Cybersécurité & Conformité',
    type: 'pro',
    typeLabel: 'Expernet Pro (Formation Continue & CPF)',
    level: 'certification',
    levelLabel: 'Référentiel ANSSI • Éligible CPF',
    cpfCode: 'CPF-CYB-974',
    duration: '3 jours (21 heures)',
    pace: 'En présentiel ou intra-entreprise',
    isCpfEligible: true,
    isAlternance: false,
    campus: ['Le Port'],
    shortDescription: 'Sensibilisez et formez vos collaborateurs aux cybermenaces réunionnaises (phishing, rançongiciels, faux ordres de virement) et à la conformité RGPD.',
    prerequisites: [
      'Aucun prérequis technique nécessaire : accessible à tout collaborateur ou dirigeant'
    ],
    objectives: [
      'Identifier les pièges de l’ingénierie sociale et les vecteurs d’attaques par email',
      'Appliquer les règles d’hygiène informatique préconisées par l’ANSSI',
      'Mettre en conformité les registres de traitement des données personnelles (RGPD)',
      'Définir la procédure d’alerte et de réaction en cas d’attaque'
    ],
    admissionModalities: [
      'Inscription via CPF, OPCO ou convention entreprise'
    ],
    careerOutcomes: [
      'Référent Cybersécurité Interne',
      'Délégué à la Protection des Données (DPO)',
      'Responsable Qualité & Conformité'
    ],
    certifyingPartner: 'Attestation Expernet conforme aux recommandations ANSSI',
    startingDates: ['Sessions permanentes'],
    badge: 'Indispensable Entreprises 974'
  },
  {
    id: 'pro-excel-avance-tosa',
    title: 'Excel Avancé & Analyse de Données - Certification TOSA Officielle',
    slug: 'pro-excel-avance-tosa',
    category: 'management',
    categoryLabel: 'Bureautique & Data',
    type: 'pro',
    typeLabel: 'Expernet Pro (Formation Continue & CPF)',
    level: 'certification',
    levelLabel: 'Certification TOSA Officielle',
    cpfCode: 'CPF-TOSA-XLS',
    duration: '4 jours (28 heures)',
    pace: 'Temps plein ou modules fractionnés',
    isCpfEligible: true,
    isAlternance: false,
    campus: ['Le Port', 'Distanciel'],
    shortDescription: 'Maîtrisez les fonctions complexes d’Excel (RECHERCHEX, tableaux croisés dynamiques, Power Query, macros) avec passage de l’examen TOSA.',
    prerequisites: [
      'Connaissance des fonctions de base d’Excel (calculs simples, mise en forme)'
    ],
    objectives: [
      'Construire des tableaux de bord dynamiques et percutants',
      'Maîtriser les formules logiques et de recherche avancées (RECHERCHEX, INDEX/EQUIV)',
      'Importer et nettoyer des volumes de données avec Power Query',
      'Obtenir un score maximal à la certification TOSA reconnue par les recruteurs'
    ],
    admissionModalities: [
      'Inscription 100% en ligne sur MonCompteFormation (CPF)'
    ],
    careerOutcomes: [
      'Contrôleur de Gestion',
      'Assistant(e) de Direction & Gestion',
      'Analyste Données / Opérations'
    ],
    certifyingPartner: 'Certification Internationale TOSA (Isograd)',
    startingDates: ['Session chaque semaine'],
    badge: 'Financement 100% CPF'
  }
];
