import axios from 'axios';
import { computed, ref } from 'vue';

export type Role = 'ADMIN' | 'FORMATEUR' | 'ETUDIANT';

export interface UtilisateurSession {
  id: number;
  email: string;
  prenom: string;
  nom: string;
  role: Role;
}

interface Session {
  jeton: string;
  utilisateur: UtilisateurSession;
}

// Session conservée dans le navigateur (jeton JWT valable 8 h côté serveur)
const CLE_SESSION = 'expernet-session';

function lireSession(): Session | null {
  try {
    const brut = localStorage.getItem(CLE_SESSION);
    if (!brut) return null;
    const session = JSON.parse(brut) as Partial<Session>;
    return typeof session.jeton === 'string' && session.utilisateur ? (session as Session) : null;
  } catch {
    return null;
  }
}

const session = ref<Session | null>(lireSession());

function enregistrerSession(nouvelle: Session | null) {
  session.value = nouvelle;
  try {
    if (nouvelle) localStorage.setItem(CLE_SESSION, JSON.stringify(nouvelle));
    else localStorage.removeItem(CLE_SESSION);
  } catch {
    /* stockage indisponible : la session reste en mémoire */
  }
}

export const utilisateurConnecte = computed(() => session.value?.utilisateur ?? null);

export function jetonActuel(): string | null {
  return session.value?.jeton ?? null;
}

const client = axios.create({ baseURL: '/api', timeout: 8000 });

export const authApi = {
  async connexion(email: string, motDePasse: string) {
    const { data } = await client.post<{ accessToken: string; utilisateur: UtilisateurSession }>('/auth/login', {
      email,
      motDePasse,
    });
    enregistrerSession({ jeton: data.accessToken, utilisateur: data.utilisateur });
    return data.utilisateur;
  },

  // Vérifie auprès du serveur que la session sauvegardée est toujours valide
  async verifierSession(): Promise<UtilisateurSession | null> {
    const jeton = jetonActuel();
    if (!jeton) return null;
    try {
      const { data } = await client.get<UtilisateurSession>('/auth/me', {
        headers: { Authorization: `Bearer ${jeton}` },
      });
      enregistrerSession({ jeton, utilisateur: data });
      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        enregistrerSession(null);
        return null;
      }
      throw err;
    }
  },

  deconnexion() {
    enregistrerSession(null);
  },
};

export function messageErreur(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Le serveur ne répond pas. Vérifiez que le backend est démarré.';
    const message = (err.response.data as { message?: unknown } | undefined)?.message;
    if (Array.isArray(message)) return message.join(', ');
    if (typeof message === 'string') return message;
  }
  return 'Une erreur est survenue.';
}
