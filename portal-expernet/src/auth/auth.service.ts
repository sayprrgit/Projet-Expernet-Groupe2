import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { signToken } from './jwt.util.js';
import type { User } from '../generated/prisma/client.js';

export type SafeUser = Omit<User, 'passwordHash' | 'mfaSecret'>;

export function toSafeUser(user: User): SafeUser {
  const { passwordHash: _passwordHash, mfaSecret: _mfaSecret, ...safe } = user;
  return safe;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    return {
      token: signToken(user.id, user.role),
      user: toSafeUser(user),
    };
  }
}
