import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { UtilisateurConnecte } from './auth.types.js';

// Usage : maMethode(@UtilisateurActuel() user: UtilisateurConnecte)
// Nécessite JwtAuthGuard sur la route.
export const UtilisateurActuel = createParamDecorator(
  (_donnees: unknown, contexte: ExecutionContext): UtilisateurConnecte =>
    contexte.switchToHttp().getRequest<{ utilisateur: UtilisateurConnecte }>().utilisateur,
);
