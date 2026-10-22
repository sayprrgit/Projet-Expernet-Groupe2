import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCandidatureDto {
  @ApiProperty({ example: 'Dupont', description: 'Nom de famille du candidat' })
  nom!: string;

  @ApiProperty({ example: 'Alexandre', description: 'Prénom du candidat' })
  prenom!: string;

  @ApiProperty({ example: 'alexandre.dupont@email.re', description: 'Adresse email valide' })
  email!: string;

  @ApiProperty({ example: '+262692123456', description: 'Numéro de téléphone (+262 ou métropole)' })
  telephone!: string;

  @ApiProperty({ example: '97400', description: 'Code postal (La Réunion)' })
  codePostal!: string;

  @ApiProperty({ example: 'bts-sio-slam', description: 'Identifiant de la formation visée' })
  formationId!: string;

  @ApiProperty({ example: 'campus', enum: ['campus', 'pro', 'info'], description: 'Type de démarche' })
  typeDemarche!: 'campus' | 'pro' | 'info';

  @ApiProperty({ example: 'Sainte-Clotilde', enum: ['Sainte-Clotilde', 'Saint-Pierre', 'Distanciel'], description: 'Campus de préférence' })
  campusPrefere!: string;

  @ApiProperty({ example: 'etudiant', enum: ['lyceen', 'etudiant', 'reconversion', 'salarie'], description: 'Statut actuel du candidat' })
  statutActuel!: string;

  @ApiPropertyOptional({ example: 'Passionné par le web et la tech réunionnaise...', description: 'Message ou projet professionnel' })
  message?: string;

  @ApiProperty({ example: true, description: 'Consentement RGPD' })
  rgpdConsent!: boolean;
}
