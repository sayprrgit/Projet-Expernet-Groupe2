import axios from 'axios';
import { authApi, jetonActuel, type Role } from './auth';

export type { Role } from './auth';

export interface Canal {
  id: number;
  nom: string;
  promotionId: number | null;
  promotion: { id: number; nom: string } | null;
  _count: { messages: number; documents: number };
}

export interface Message {
  id: number;
  canalId: number;
  contenu: string;
  parentId: number | null;
  createdAt: string;
  modifieLe: string | null;
  auteur: { id: number; prenom: string; nom: string; role: Role };
}

export interface DocumentPartage {
  id: number;
  titre: string;
  nomFichier: string;
  typeMime: string;
  tailleOctets: number;
  promotionId: number | null;
  canalId: number | null;
  visiblePar: Role[];
  createdAt: string;
  auteur: { id: number; prenom: string; nom: string };
}

const client = axios.create({ baseURL: '/api', timeout: 8000 });

// Chaque appel envoie le jeton JWT de la session
client.interceptors.request.use((config) => {
  const jeton = jetonActuel();
  if (jeton) config.headers.set('Authorization', `Bearer ${jeton}`);
  return config;
});

// Jeton expiré ou invalide : on ferme la session
client.interceptors.response.use(
  (reponse) => reponse,
  (err: unknown) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) authApi.deconnexion();
    return Promise.reject(err);
  },
);

export const collabApi = {
  canaux: () => client.get<Canal[]>('/canaux').then((r) => r.data),

  messages: (canalId: number) => client.get<Message[]>(`/canaux/${canalId}/messages`).then((r) => r.data),

  envoyer: (canalId: number, contenu: string, parentId: number | null) =>
    client.post<Message>(`/canaux/${canalId}/messages`, { contenu, parentId }).then((r) => r.data),

  documents: (canalId: number) =>
    client.get<DocumentPartage[]>('/documents', { params: { canalId } }).then((r) => r.data),

  deposer: (canalId: number, fichier: File, titre: string) => {
    const donnees = new FormData();
    donnees.append('file', fichier);
    donnees.append('titre', titre);
    donnees.append('canalId', String(canalId));
    return client.post<DocumentPartage>('/documents', donnees).then((r) => r.data);
  },

  // Le téléchargement passe par axios pour envoyer le jeton d'authentification.
  async telecharger(doc: DocumentPartage) {
    const reponse = await client.get<Blob>(`/documents/${doc.id}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(reponse.data);
    const lien = document.createElement('a');
    lien.href = url;
    lien.download = doc.nomFichier;
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};

export { messageErreur } from './auth';
