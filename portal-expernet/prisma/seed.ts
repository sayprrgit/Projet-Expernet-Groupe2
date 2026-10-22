import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role, NiveauRncp, NiveauAcquisition, RoleJury } from '../src/generated/prisma/client.js';
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

  // ───────── Utilisateurs ─────────
  const admin = await prisma.user.create({
    data: { email: 'admin@expernet.re', passwordHash, nom: 'Payet', prenom: 'Marie', role: Role.ADMIN, mfaEnabled: true },
  });
  const formateur = await prisma.user.create({
    data: { email: 'j.hoarau@expernet.re', passwordHash, nom: 'Hoarau', prenom: 'Jean', role: Role.FORMATEUR, mfaEnabled: true },
  });
  const lynho = await prisma.user.create({
    data: { email: 'lynho@exemple.re', passwordHash, nom: 'Demo', prenom: 'Lynho', role: Role.ETUDIANT },
  });
  const sarah = await prisma.user.create({
    data: { email: 's.grondin@exemple.re', passwordHash, nom: 'Grondin', prenom: 'Sarah', role: Role.ETUDIANT },
  });

  // ───────── Catalogue ─────────
  const dev = await prisma.filiere.create({ data: { nom: 'Développement', slug: 'developpement' } });
  const reseaux = await prisma.filiere.create({ data: { nom: 'Réseaux et systèmes', slug: 'reseaux-systemes' } });

  const cda = await prisma.formation.create({
    data: {
      titre: "Concepteur Développeur d'Applications",
      slug: 'concepteur-developpeur-applications',
      filiereId: dev.id,
      niveauRncp: NiveauRncp.NIVEAU_6,
      eligibleCpf: true,
      dureeHeures: 1200,
      publiee: true,
      prerequis: 'Niveau bac+2 en informatique ou expérience équivalente.',
      objectifs: 'Concevoir, développer et déployer des applications sécurisées.',
      modalitesAcces: 'Dossier de candidature, tests techniques et entretien.',
      debouches: 'Développeur full-stack, concepteur logiciel, chef de projet technique.',
      metaDescription: "Formation CDA de niveau 6 éligible au CPF à La Réunion.",
    },
  });
  await prisma.formation.create({
    data: {
      titre: 'Technicien Systèmes et Réseaux',
      slug: 'technicien-systemes-reseaux',
      filiereId: reseaux.id,
      niveauRncp: NiveauRncp.NIVEAU_5,
      eligibleCpf: true,
      dureeHeures: 900,
      publiee: true,
      prerequis: 'Niveau bac ou expérience équivalente.',
      objectifs: "Installer, administrer et sécuriser un parc informatique.",
      modalitesAcces: 'Dossier de candidature et entretien.',
      debouches: 'Technicien réseau, administrateur systèmes junior.',
    },
  });

  await prisma.candidature.create({
    data: {
      formationId: cda.id,
      nom: 'Exemple',
      prenom: 'Candidat',
      email: 'candidat@exemple.re',
      motivation: 'Je souhaite me reconvertir dans le développement.',
    },
  });

  // ───────── Promotion, inscriptions, sessions ─────────
  const promo = await prisma.promotion.create({
    data: {
      nom: 'CDA 2026-2027',
      formationId: cda.id,
      formateurId: formateur.id,
      dateDebut: new Date('2026-10-19'),
      dateFin: new Date('2027-07-02'),
    },
  });
  await prisma.inscription.createMany({
    data: [
      { promotionId: promo.id, etudiantId: lynho.id },
      { promotionId: promo.id, etudiantId: sarah.id },
    ],
  });

  const session1 = await prisma.session.create({
    data: {
      promotionId: promo.id,
      titre: 'Algorithmique et PHP',
      debut: new Date('2026-10-22T08:30:00+04:00'),
      fin: new Date('2026-10-22T12:30:00+04:00'),
    },
  });
  await prisma.session.create({
    data: {
      promotionId: promo.id,
      titre: 'Bases de données',
      debut: new Date('2026-10-22T13:30:00+04:00'),
      fin: new Date('2026-10-22T17:30:00+04:00'),
    },
  });

  // ───────── Émargements de la session 1 (les deux étudiants ont signé) ─────────
  const signaturePlaceholder = 'data:image/png;base64,iVBORw0KGgo='; // à remplacer par une vraie signature
  for (const [etudiant, heure] of [
    [lynho, '2026-10-22T08:41:12+04:00'],
    [sarah, '2026-10-22T08:44:57+04:00'],
  ] as const) {
    const signeLe = new Date(heure);
    await prisma.emargement.create({
      data: {
        sessionId: session1.id,
        etudiantId: etudiant.id,
        signature: signaturePlaceholder,
        signeLe,
        adresseIp: '127.0.0.1',
        empreinte: empreinte(session1.id, etudiant.id, signeLe, signaturePlaceholder),
      },
    });
  }

  // ───────── Examen, jury, compétences, évaluations ─────────
  const c1 = await prisma.competence.create({
    data: { formationId: cda.id, code: 'C1', libelle: 'Développer une application sécurisée' },
  });
  const c2 = await prisma.competence.create({
    data: { formationId: cda.id, code: 'C2', libelle: 'Concevoir une base de données' },
  });

  const examen = await prisma.examen.create({
    data: {
      promotionId: promo.id,
      intitule: 'Soutenance finale CDA',
      dateExamen: new Date('2027-06-25T09:00:00+04:00'),
      salle: 'B12',
    },
  });
  await prisma.juryMembre.createMany({
    data: [
      { examenId: examen.id, userId: admin.id, roleJury: RoleJury.PRESIDENT },
      { examenId: examen.id, userId: formateur.id, roleJury: RoleJury.MEMBRE },
    ],
  });
  await prisma.evaluation.createMany({
    data: [
      {
        examenId: examen.id,
        etudiantId: lynho.id,
        competenceId: c1.id,
        niveau: NiveauAcquisition.ACQUIS,
        commentaire: 'Bonne maîtrise de la sécurité',
      },
      {
        examenId: examen.id,
        etudiantId: lynho.id,
        competenceId: c2.id,
        niveau: NiveauAcquisition.EN_COURS,
        commentaire: 'Normalisation à revoir',
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
