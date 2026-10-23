import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import { verifyToken } from './jwt.util.js';
import { ROLES_KEY } from './roles.decorator.js';
import type { Role } from '../generated/prisma/client.js';

export interface AuthenticatedUser {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  telephone: string | null;
  adresse: string | null;
  ville: string | null;
  codePostal: string | null;
  mfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AuthenticatedRequest = Request & { user: AuthenticatedUser };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;

    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentification requise.');
    }

    const payload = verifyToken(header.slice(7));
    if (!payload) {
      throw new UnauthorizedException('Session expirée, merci de vous reconnecter.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException('Utilisateur introuvable.');
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requiredRoles?.length && !requiredRoles.includes(user.role)) {
      throw new ForbiddenException("Votre rôle ne permet pas d'accéder à cette ressource.");
    }

    // On ne conserve jamais le hash du mot de passe sur la requête.
    const { passwordHash: _passwordHash, mfaSecret: _mfaSecret, ...safeUser } = user;
    request.user = safeUser;
    return true;
  }
}
