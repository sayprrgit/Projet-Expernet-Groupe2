import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

const DUREE_SESSION_SECONDES = 8 * 60 * 60; // 8 heures

// Module global : JwtAuthGuard et JwtService sont utilisables dans tous les modules
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error("JWT_SECRET manquant dans les variables d'environnement");
        }
        return { secret, signOptions: { expiresIn: DUREE_SESSION_SECONDES } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
