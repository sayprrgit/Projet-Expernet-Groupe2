-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FORMATEUR', 'ETUDIANT');

-- CreateEnum
CREATE TYPE "FormationType" AS ENUM ('CAMPUS', 'PRO');

-- CreateEnum
CREATE TYPE "FormationLevel" AS ENUM ('BAC2', 'BAC3', 'BAC5', 'CERTIFICATION');

-- CreateEnum
CREATE TYPE "FormationCategory" AS ENUM ('DEV', 'RESEAUX', 'MARKETING', 'MANAGEMENT', 'DATA');

-- CreateEnum
CREATE TYPE "NiveauRncp" AS ENUM ('NIVEAU_3', 'NIVEAU_4', 'NIVEAU_5', 'NIVEAU_6', 'NIVEAU_7');

-- CreateEnum
CREATE TYPE "TypeFormation" AS ENUM ('CAMPUS', 'PRO');

-- CreateEnum
CREATE TYPE "NiveauFormation" AS ENUM ('BAC_PLUS_2', 'BAC_PLUS_3', 'BAC_PLUS_5', 'CERTIFICATION');

-- CreateEnum
CREATE TYPE "StatutCandidature" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "RoleJury" AS ENUM ('PRESIDENT', 'MEMBRE');

-- CreateEnum
CREATE TYPE "NiveauAcquisition" AS ENUM ('NON_ACQUIS', 'EN_COURS', 'ACQUIS');

-- CreateEnum
CREATE TYPE "PlanningType" AS ENUM ('FORMATION', 'EVENEMENT', 'ATELIER', 'EXAMEN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ETUDIANT',
    "telephone" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "codePostal" TEXT,
    "mfaSecret" TEXT,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filiere" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Filiere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formation" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "filiereId" INTEGER NOT NULL,
    "libelle" TEXT NOT NULL,
    "libelleNiveau" TEXT NOT NULL,
    "type" "TypeFormation" NOT NULL,
    "niveau" "NiveauFormation" NOT NULL,
    "niveauRncp" "NiveauRncp",
    "rncpCode" TEXT,
    "cpfCode" TEXT,
    "eligibleCpf" BOOLEAN NOT NULL DEFAULT false,
    "alternance" BOOLEAN NOT NULL DEFAULT false,
    "duree" TEXT NOT NULL,
    "dureeHeures" INTEGER NOT NULL,
    "rythme" TEXT NOT NULL,
    "lieux" TEXT[],
    "resume" TEXT NOT NULL,
    "prerequis" TEXT[],
    "objectifs" TEXT[],
    "modalitesAcces" TEXT[],
    "debouches" TEXT[],
    "certificateur" TEXT NOT NULL,
    "prochainesSessions" TEXT[],
    "badge" TEXT,
    "metaDescription" TEXT,
    "publiee" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Formation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidature" (
    "id" SERIAL NOT NULL,
    "reference" TEXT NOT NULL,
    "formationId" INTEGER,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "codePostal" TEXT NOT NULL,
    "typeDemarche" TEXT NOT NULL,
    "statutActuel" TEXT NOT NULL,
    "motivation" TEXT NOT NULL DEFAULT '',
    "rgpdConsent" BOOLEAN NOT NULL DEFAULT false,
    "statut" "StatutCandidature" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "formationId" INTEGER NOT NULL,
    "formateurId" INTEGER NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscription" (
    "id" SERIAL NOT NULL,
    "promotionId" INTEGER NOT NULL,
    "etudiantId" INTEGER NOT NULL,

    CONSTRAINT "Inscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "promotionId" INTEGER NOT NULL,
    "titre" TEXT NOT NULL,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emargement" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "etudiantId" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "signeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "adresseIp" TEXT,
    "empreinte" TEXT NOT NULL,

    CONSTRAINT "Emargement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attestation" (
    "id" SERIAL NOT NULL,
    "etudiantId" INTEGER NOT NULL,
    "periodeDu" TIMESTAMP(3) NOT NULL,
    "periodeAu" TIMESTAMP(3) NOT NULL,
    "cheminPdf" TEXT NOT NULL,
    "generee" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attestation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Examen" (
    "id" SERIAL NOT NULL,
    "promotionId" INTEGER NOT NULL,
    "intitule" TEXT NOT NULL,
    "dateExamen" TIMESTAMP(3) NOT NULL,
    "salle" TEXT,

    CONSTRAINT "Examen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JuryMembre" (
    "id" SERIAL NOT NULL,
    "examenId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleJury" "RoleJury" NOT NULL DEFAULT 'MEMBRE',

    CONSTRAINT "JuryMembre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competence" (
    "id" SERIAL NOT NULL,
    "formationId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,

    CONSTRAINT "Competence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "examenId" INTEGER NOT NULL,
    "etudiantId" INTEGER NOT NULL,
    "competenceId" INTEGER NOT NULL,
    "niveau" "NiveauAcquisition" NOT NULL DEFAULT 'NON_ACQUIS',
    "commentaire" TEXT,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanningEvent" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "type" "PlanningType" NOT NULL,
    "date" DATE NOT NULL,
    "dateFin" DATE,
    "heure" TEXT,
    "site" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lienLabel" TEXT,
    "lienUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanningEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Canal" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "promotionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Canal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "canalId" INTEGER NOT NULL,
    "auteurId" INTEGER NOT NULL,
    "contenu" TEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifieLe" TIMESTAMP(3),

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "nomFichier" TEXT NOT NULL,
    "cheminStockage" TEXT NOT NULL,
    "typeMime" TEXT NOT NULL,
    "tailleOctets" INTEGER NOT NULL,
    "auteurId" INTEGER NOT NULL,
    "promotionId" INTEGER,
    "canalId" INTEGER,
    "visiblePar" "Role"[] DEFAULT ARRAY['ADMIN', 'FORMATEUR', 'ETUDIANT']::"Role"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Filiere_nom_key" ON "Filiere"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Filiere_slug_key" ON "Filiere"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Formation_slug_key" ON "Formation"("slug");

-- CreateIndex
CREATE INDEX "Formation_filiereId_type_niveau_idx" ON "Formation"("filiereId", "type", "niveau");

-- CreateIndex
CREATE INDEX "Formation_eligibleCpf_publiee_idx" ON "Formation"("eligibleCpf", "publiee");

-- CreateIndex
CREATE UNIQUE INDEX "Candidature_reference_key" ON "Candidature"("reference");

-- CreateIndex
CREATE INDEX "Candidature_formationId_statut_idx" ON "Candidature"("formationId", "statut");

-- CreateIndex
CREATE INDEX "Candidature_statut_createdAt_idx" ON "Candidature"("statut", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Inscription_promotionId_etudiantId_key" ON "Inscription"("promotionId", "etudiantId");

-- CreateIndex
CREATE INDEX "Session_promotionId_debut_idx" ON "Session"("promotionId", "debut");

-- CreateIndex
CREATE UNIQUE INDEX "Emargement_sessionId_etudiantId_key" ON "Emargement"("sessionId", "etudiantId");

-- CreateIndex
CREATE UNIQUE INDEX "JuryMembre_examenId_userId_key" ON "JuryMembre"("examenId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Competence_formationId_code_key" ON "Competence"("formationId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_examenId_etudiantId_competenceId_key" ON "Evaluation"("examenId", "etudiantId", "competenceId");

-- CreateIndex
CREATE INDEX "PlanningEvent_date_idx" ON "PlanningEvent"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Canal_promotionId_nom_key" ON "Canal"("promotionId", "nom");

-- CreateIndex
CREATE INDEX "Message_canalId_createdAt_idx" ON "Message"("canalId", "createdAt");

-- CreateIndex
CREATE INDEX "Document_promotionId_createdAt_idx" ON "Document"("promotionId", "createdAt");

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_filiereId_fkey" FOREIGN KEY ("filiereId") REFERENCES "Filiere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_formateurId_fkey" FOREIGN KEY ("formateurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emargement" ADD CONSTRAINT "Emargement_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Emargement" ADD CONSTRAINT "Emargement_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Examen" ADD CONSTRAINT "Examen_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JuryMembre" ADD CONSTRAINT "JuryMembre_examenId_fkey" FOREIGN KEY ("examenId") REFERENCES "Examen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JuryMembre" ADD CONSTRAINT "JuryMembre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competence" ADD CONSTRAINT "Competence_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_examenId_fkey" FOREIGN KEY ("examenId") REFERENCES "Examen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_competenceId_fkey" FOREIGN KEY ("competenceId") REFERENCES "Competence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Canal" ADD CONSTRAINT "Canal_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "Canal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "Canal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
