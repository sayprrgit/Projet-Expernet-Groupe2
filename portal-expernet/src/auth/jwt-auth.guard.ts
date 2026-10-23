import { type CanActivate, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import type { ContenuJeton, UtilisateurConnecte } from './auth.types.js';

// Vérifie le jeton « Authorization: Bearer <jwt> » et attache l'utilisateur à la requête.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(contexte: ExecutionContext): Promise<boolean> {
    const requete = contexte.switchToHttp().getRequest<Request & { utilisateur?: UtilisateurConnecte }>();
    const [type, jeton] = requete.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !jeton) {
      throw new UnauthorizedException('Authentification requise');
    }

    let contenu: ContenuJeton;
    try {
      contenu = await this.jwt.verifyAsync<ContenuJeton>(jeton);
    } catch {
      throw new UnauthorizedException('Session invalide ou expirée');
    }

    // On relit l'utilisateur en base : un compte supprimé ou dont le rôle a changé est pris en compte
    const utilisateur = await this.prisma.user.findUnique({
      where: { id: contenu.sub },
      select: { id: true, role: true },
    });
    if (!utilisateur) throw new UnauthorizedException('Utilisateur introuvable');

    requete.utilisateur = utilisateur;
    return true;
  }
}
