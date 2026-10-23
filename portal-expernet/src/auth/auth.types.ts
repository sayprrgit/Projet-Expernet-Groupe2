import type { Role } from '../generated/prisma/client.js';

// Utilisateur extrait du jeton JWT et attaché à la requête par JwtAuthGuard
export interface UtilisateurConnecte {
  id: number;
  role: Role;
}

// Contenu (payload) du jeton JWT
export interface ContenuJeton {
  sub: number;
  role: Role;
}
