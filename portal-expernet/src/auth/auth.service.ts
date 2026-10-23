import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ContenuJeton } from './auth.types.js';

// Hash calculé une fois : comparé quand l'email n'existe pas, pour que la réponse
// prenne le même temps (on ne révèle pas quels emails ont un compte).
const HASH_FACTICE = bcrypt.hashSync('compte-inexistant', 10);

const PROFIL = { id: true, email: true, prenom: true, nom: true, role: true } as const;

export interface IdentifiantsDto {
  email?: unknown;
  motDePasse?: unknown;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async connexion(dto: IdentifiantsDto) {
    const email = typeof dto.email === 'string' ? dto.email.trim().toLowerCase() : '';
    const motDePasse = typeof dto.motDePasse === 'string' ? dto.motDePasse : '';
    if (!email || !motDePasse) {
      throw new BadRequestException('Email et mot de passe obligatoires');
    }

    const utilisateur = await this.prisma.user.findUnique({ where: { email } });
    const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur?.passwordHash ?? HASH_FACTICE);
    if (!utilisateur || !motDePasseValide) {
      // Message volontairement identique dans les deux cas
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const contenu: ContenuJeton = { sub: utilisateur.id, role: utilisateur.role };
    return {
      accessToken: await this.jwt.signAsync(contenu),
      utilisateur: {
        id: utilisateur.id,
        email: utilisateur.email,
        prenom: utilisateur.prenom,
        nom: utilisateur.nom,
        role: utilisateur.role,
      },
    };
  }

  async profil(id: number) {
    const utilisateur = await this.prisma.user.findUnique({ where: { id }, select: PROFIL });
    if (!utilisateur) throw new NotFoundException('Utilisateur introuvable');
    return utilisateur;
  }
}
