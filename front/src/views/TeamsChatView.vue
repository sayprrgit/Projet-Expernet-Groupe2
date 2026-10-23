<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import SeoMeta from '@/components/SeoMeta.vue';
import { IMAGES } from '@/data/images';
import { useAuthStore } from '@/stores/auth';
import type { Role } from '@/types/user';
import { collabApi, messageErreur, type Canal, type DocumentPartage, type Message } from '@/services/collab';

const INTERVALLE_RAFRAICHISSEMENT = 4000;
const LONGUEUR_MAX = 2000;

const ROLES: Record<Role, string> = {
  ADMIN: 'Admin',
  FORMATEUR: 'Formateur',
  ETUDIANT: 'Étudiant',
};

const canaux = ref<Canal[]>([]);
const canalActifId = ref<number | null>(null);
const messages = ref<Message[]>([]);
const documents = ref<DocumentPartage[]>([]);

const chargementCanaux = ref(false);
const chargementMessages = ref(false);
const erreurGenerale = ref('');
const erreurEnvoi = ref('');
const erreurDocuments = ref('');

const brouillon = ref('');
const repondreA = ref<Message | null>(null);
const envoiEnCours = ref(false);
const depotEnCours = ref(false);
const fichiersOuverts = ref(false); // panneau fichiers sur petits écrans

const zoneMessages = ref<HTMLElement | null>(null);
const champMessage = ref<HTMLTextAreaElement | null>(null);

let minuterie: ReturnType<typeof setInterval> | undefined;

// La route exige une connexion (router/index.ts) : on arrive ici déjà authentifié via /login
const auth = useAuthStore();
const router = useRouter();
const utilisateurCourant = computed(() => auth.user);
const connecte = computed(() => utilisateurCourant.value !== null);
const canalActif = computed(() => canaux.value.find((c) => c.id === canalActifId.value) ?? null);

const groupesCanaux = computed(() => {
  const groupes = new Map<string, Canal[]>();
  for (const canal of canaux.value) {
    const titre = canal.promotion?.nom ?? 'Tout le centre';
    groupes.set(titre, [...(groupes.get(titre) ?? []), canal]);
  }
  return [...groupes.entries()].map(([titre, liste]) => ({ titre, canaux: liste }));
});

// Fils de discussion : messages racines + leurs réponses
const fils = computed(() => {
  const ids = new Set(messages.value.map((m) => m.id));
  const reponses = new Map<number, Message[]>();
  const racines: Message[] = [];
  for (const message of messages.value) {
    if (message.parentId !== null && ids.has(message.parentId)) {
      reponses.set(message.parentId, [...(reponses.get(message.parentId) ?? []), message]);
    } else {
      racines.push(message);
    }
  }
  return racines.map((racine) => ({ racine, reponses: reponses.get(racine.id) ?? [] }));
});

const caracteresRestants = computed(() => LONGUEUR_MAX - brouillon.value.length);

function initiales(prenom: string, nom: string) {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
}

function formaterDate(iso: string) {
  const date = new Date(iso);
  const heure = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const aujourdHui = new Date().toDateString() === date.toDateString();
  return aujourdHui ? heure : `${date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} · ${heure}`;
}

function formaterTaille(octets: number) {
  if (octets < 1024) return `${octets} o`;
  if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} Ko`;
  return `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
}

function iconeDocument(typeMime: string) {
  if (typeMime.startsWith('image/')) return '🖼️';
  if (typeMime === 'application/pdf') return '📕';
  if (typeMime.includes('zip') || typeMime.includes('compressed')) return '🗜️';
  if (typeMime.includes('sheet') || typeMime.includes('excel')) return '📊';
  if (typeMime.includes('presentation') || typeMime.includes('powerpoint')) return '📽️';
  return '📄';
}

function estMoi(message: Message) {
  return message.auteur.id === utilisateurCourant.value?.id;
}

function defilerEnBas() {
  nextTick(() => {
    if (zoneMessages.value) zoneMessages.value.scrollTop = zoneMessages.value.scrollHeight;
  });
}

function estProcheDuBas() {
  const zone = zoneMessages.value;
  return !zone || zone.scrollHeight - zone.scrollTop - zone.clientHeight < 120;
}

async function chargerCanaux() {
  chargementCanaux.value = true;
  try {
    canaux.value = await collabApi.canaux();
    const toujoursVisible = canaux.value.some((c) => c.id === canalActifId.value);
    if (!toujoursVisible) canalActifId.value = canaux.value[0]?.id ?? null;
  } finally {
    chargementCanaux.value = false;
  }
}

async function chargerMessages(silencieux = false) {
  const canalId = canalActifId.value;
  if (canalId === null) {
    messages.value = [];
    return;
  }
  if (!silencieux) chargementMessages.value = true;
  try {
    const restaitEnBas = estProcheDuBas();
    const dernierAvant = messages.value.at(-1)?.id;
    const liste = await collabApi.messages(canalId);
    if (canalId !== canalActifId.value) return; // canal changé entre-temps
    messages.value = liste;
    if (!silencieux || (restaitEnBas && liste.at(-1)?.id !== dernierAvant)) defilerEnBas();
    erreurGenerale.value = '';
  } catch (err) {
    if (!silencieux) erreurGenerale.value = messageErreur(err);
  } finally {
    chargementMessages.value = false;
  }
}

async function chargerDocuments() {
  const canalId = canalActifId.value;
  if (canalId === null) {
    documents.value = [];
    return;
  }
  try {
    documents.value = await collabApi.documents(canalId);
    erreurDocuments.value = '';
  } catch (err) {
    erreurDocuments.value = messageErreur(err);
  }
}

async function ouvrirEspace() {
  erreurGenerale.value = '';
  try {
    await chargerCanaux();
    await Promise.all([chargerMessages(), chargerDocuments()]);
  } catch (err) {
    erreurGenerale.value = messageErreur(err);
  }
}

function seDeconnecter() {
  auth.logout();
  router.push('/teams');
}

function selectionnerCanal(id: number) {
  if (id === canalActifId.value) return;
  canalActifId.value = id;
  repondreA.value = null;
  erreurEnvoi.value = '';
}

function commencerReponse(message: Message) {
  repondreA.value = message;
  nextTick(() => champMessage.value?.focus());
}

async function envoyer() {
  const contenu = brouillon.value.trim();
  if (!contenu || canalActifId.value === null || envoiEnCours.value) return;
  envoiEnCours.value = true;
  erreurEnvoi.value = '';
  try {
    const nouveau = await collabApi.envoyer(canalActifId.value, contenu, repondreA.value?.id ?? null);
    messages.value = [...messages.value, nouveau];
    brouillon.value = '';
    repondreA.value = null;
    defilerEnBas();
  } catch (err) {
    erreurEnvoi.value = messageErreur(err);
  } finally {
    envoiEnCours.value = false;
    nextTick(() => champMessage.value?.focus());
  }
}

function surToucheMessage(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    envoyer();
  }
}

async function deposerFichier(event: Event) {
  const champ = event.target as HTMLInputElement;
  const fichier = champ.files?.[0];
  if (!fichier || canalActifId.value === null) return;
  depotEnCours.value = true;
  erreurDocuments.value = '';
  try {
    const titre = fichier.name.replace(/\.[^.]+$/, '') || fichier.name;
    await collabApi.deposer(canalActifId.value, fichier, titre);
    await chargerDocuments();
  } catch (err) {
    erreurDocuments.value = messageErreur(err);
  } finally {
    depotEnCours.value = false;
    champ.value = '';
  }
}

async function telecharger(doc: DocumentPartage) {
  erreurDocuments.value = '';
  try {
    await collabApi.telecharger(doc);
  } catch (err) {
    erreurDocuments.value =
      (err as { response?: { status?: number } }).response?.status === 404
        ? 'Ce fichier est introuvable sur le serveur.'
        : messageErreur(err);
  }
}

watch(canalActifId, () => {
  messages.value = [];
  documents.value = [];
  chargerMessages();
  chargerDocuments();
});

watch(() => utilisateurCourant.value?.id ?? null, (id) => {
  canaux.value = [];
  canalActifId.value = null;
  repondreA.value = null;
  brouillon.value = '';
  if (id !== null) ouvrirEspace();
  // Session expirée pendant l'utilisation : retour à la page de connexion
  else router.replace({ name: 'login', query: { redirect: '/teams/messagerie' } });
});

onMounted(async () => {
  await auth.ensureSession();
  if (connecte.value) await ouvrirEspace();
  minuterie = setInterval(() => {
    if (connecte.value && document.visibilityState === 'visible') chargerMessages(true);
  }, INTERVALLE_RAFRAICHISSEMENT);
});

onBeforeUnmount(() => clearInterval(minuterie));
</script>

<template>
  <div class="teams-app accent-purple">
    <SeoMeta
      title="Expernet Teams | Espace collaboratif"
      description="Les canaux de discussion et les documents partagés de votre promotion, directement dans la plateforme Expernet."
    />

    <!-- ================= Application ================= -->
    <div v-if="connecte" class="app">
      <header class="app-bar">
        <RouterLink to="/teams" class="app-bar__brand" aria-label="Retour à l’espace collaboratif">
          <img :src="IMAGES.logoMarkWhite" alt="" width="34" height="32" />
          <span>EXPERNET <strong>Teams</strong></span>
        </RouterLink>

        <div class="app-bar__spacer"></div>

        <div v-if="utilisateurCourant" class="user-chip">
          <span class="avatar avatar--sm" :class="`avatar--${utilisateurCourant.role.toLowerCase()}`" aria-hidden="true">
            {{ initiales(utilisateurCourant.prenom, utilisateurCourant.nom) }}
          </span>
          <span class="user-chip__info">
            <strong>{{ utilisateurCourant.prenom }} {{ utilisateurCourant.nom }}</strong>
            <span>{{ ROLES[utilisateurCourant.role] }}</span>
          </span>
        </div>
        <button type="button" class="app-bar__logout" @click="seDeconnecter">Déconnexion</button>
      </header>

      <div class="workspace">
        <!-- Canaux -->
        <aside class="sidebar" aria-label="Canaux de discussion">
          <p class="sidebar__title">Canaux</p>
          <p v-if="chargementCanaux && !canaux.length" class="sidebar__state">Chargement…</p>
          <p v-else-if="!canaux.length" class="sidebar__state">Aucun canal accessible pour ce compte.</p>

          <nav v-else class="channel-nav">
            <div v-for="groupe in groupesCanaux" :key="groupe.titre" class="channel-group">
              <p class="channel-group__title">{{ groupe.titre }}</p>
              <ul class="channel-list">
                <li v-for="canal in groupe.canaux" :key="canal.id">
                  <button
                    type="button"
                    class="channel-link"
                    :class="{ 'is-active': canal.id === canalActifId }"
                    :aria-current="canal.id === canalActifId ? 'page' : undefined"
                    @click="selectionnerCanal(canal.id)"
                  >
                    <span class="channel-link__hash" aria-hidden="true">#</span>
                    <span class="channel-link__name">{{ canal.nom }}</span>
                    <span
                      v-if="canal._count.documents"
                      class="channel-link__count"
                      :title="`${canal._count.documents} fichier(s)`"
                    >
                      {{ canal._count.documents }} 📎
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <!-- Conversation -->
        <section class="conversation" aria-label="Conversation">
          <header class="conversation__header">
            <div class="conversation__title">
              <h1><span aria-hidden="true">#</span> {{ canalActif?.nom ?? 'Aucun canal' }}</h1>
              <p>{{ canalActif ? (canalActif.promotion?.nom ?? 'Canal ouvert à tout le centre') : 'Sélectionnez un canal' }}</p>
            </div>
            <span class="live-badge" title="Les nouveaux messages s’affichent automatiquement">
              <span class="live-dot" aria-hidden="true"></span> En direct
            </span>
            <button
              type="button"
              class="files-toggle"
              :aria-expanded="fichiersOuverts"
              aria-controls="panneau-fichiers"
              @click="fichiersOuverts = !fichiersOuverts"
            >
              📎 Fichiers ({{ documents.length }})
            </button>
          </header>

          <div ref="zoneMessages" class="messages" role="log" aria-live="polite" aria-label="Messages du canal">
            <div class="messages__inner">
              <p v-if="erreurGenerale" class="state state--error" role="alert">{{ erreurGenerale }}</p>
              <p v-else-if="chargementMessages && !messages.length" class="state">Chargement des messages…</p>
              <div v-else-if="canalActif && !messages.length" class="state state--empty">
                <span class="state__icon" aria-hidden="true">💬</span>
                <p>Aucun message pour l’instant. Lancez la discussion !</p>
              </div>

              <article v-for="fil in fils" :key="fil.racine.id" class="thread">
                <div class="message" :class="{ 'message--mine': estMoi(fil.racine) }">
                  <span class="avatar" :class="`avatar--${fil.racine.auteur.role.toLowerCase()}`" aria-hidden="true">
                    {{ initiales(fil.racine.auteur.prenom, fil.racine.auteur.nom) }}
                  </span>
                  <div class="message__body">
                    <p class="message__meta">
                      <strong>{{ fil.racine.auteur.prenom }} {{ fil.racine.auteur.nom }}</strong>
                      <span class="role-badge" :class="`role-badge--${fil.racine.auteur.role.toLowerCase()}`">
                        {{ ROLES[fil.racine.auteur.role] }}
                      </span>
                      <time :datetime="fil.racine.createdAt">{{ formaterDate(fil.racine.createdAt) }}</time>
                    </p>
                    <p class="message__text">{{ fil.racine.contenu }}</p>
                  </div>
                </div>

                <div v-if="fil.reponses.length" class="replies">
                  <div
                    v-for="reponse in fil.reponses"
                    :key="reponse.id"
                    class="message"
                    :class="{ 'message--mine': estMoi(reponse) }"
                  >
                    <span
                      class="avatar avatar--sm"
                      :class="`avatar--${reponse.auteur.role.toLowerCase()}`"
                      aria-hidden="true"
                    >
                      {{ initiales(reponse.auteur.prenom, reponse.auteur.nom) }}
                    </span>
                    <div class="message__body">
                      <p class="message__meta">
                        <strong>{{ reponse.auteur.prenom }} {{ reponse.auteur.nom }}</strong>
                        <span class="role-badge" :class="`role-badge--${reponse.auteur.role.toLowerCase()}`">
                          {{ ROLES[reponse.auteur.role] }}
                        </span>
                        <time :datetime="reponse.createdAt">{{ formaterDate(reponse.createdAt) }}</time>
                      </p>
                      <p class="message__text">{{ reponse.contenu }}</p>
                    </div>
                  </div>
                </div>

                <button type="button" class="reply-button" @click="commencerReponse(fil.racine)">
                  ↩ Répondre
                  <span v-if="fil.reponses.length">
                    · {{ fil.reponses.length }} réponse{{ fil.reponses.length > 1 ? 's' : '' }}
                  </span>
                </button>
              </article>
            </div>
          </div>

          <form class="composer" @submit.prevent="envoyer">
            <div class="composer__inner">
              <div v-if="repondreA" class="composer__reply">
                <span>
                  ↩ Réponse à <strong>{{ repondreA.auteur.prenom }} {{ repondreA.auteur.nom }}</strong> :
                  <em>{{ repondreA.contenu.slice(0, 80) }}{{ repondreA.contenu.length > 80 ? '…' : '' }}</em>
                </span>
                <button type="button" class="composer__cancel" aria-label="Annuler la réponse" @click="repondreA = null">
                  ×
                </button>
              </div>

              <div class="composer__box">
                <label for="nouveau-message" class="visually-hidden">Votre message</label>
                <textarea
                  id="nouveau-message"
                  ref="champMessage"
                  v-model="brouillon"
                  class="composer__input"
                  rows="2"
                  :maxlength="LONGUEUR_MAX"
                  :disabled="!canalActif"
                  :placeholder="canalActif ? `Écrire dans #${canalActif.nom}…` : 'Sélectionnez un canal'"
                  @keydown="surToucheMessage"
                ></textarea>
                <button
                  type="submit"
                  class="btn btn--primary composer__send"
                  :disabled="!brouillon.trim() || !canalActif || envoiEnCours"
                >
                  {{ envoiEnCours ? 'Envoi…' : 'Envoyer' }}
                </button>
              </div>

              <div class="composer__footer">
                <span class="composer__hint">Entrée pour envoyer · Maj + Entrée pour aller à la ligne</span>
                <span :class="{ 'composer__count--low': caracteresRestants < 100 }">{{ caracteresRestants }}</span>
              </div>
              <p v-if="erreurEnvoi" class="form-error" role="alert">{{ erreurEnvoi }}</p>
            </div>
          </form>
        </section>

        <!-- Fichiers -->
        <aside
          id="panneau-fichiers"
          class="files"
          :class="{ 'is-open': fichiersOuverts }"
          aria-label="Fichiers du canal"
        >
          <header class="files__header">
            <h2>Fichiers</h2>
            <span class="files__count">{{ documents.length }}</span>
            <button type="button" class="files__close" aria-label="Fermer le panneau des fichiers" @click="fichiersOuverts = false">
              ×
            </button>
          </header>

          <input
            id="depot-fichier"
            type="file"
            class="visually-hidden"
            :disabled="!canalActif || depotEnCours"
            @change="deposerFichier"
          />
          <label
            for="depot-fichier"
            class="btn btn--outline btn--sm btn--block upload-label"
            :class="{ 'is-disabled': !canalActif || depotEnCours }"
          >
            {{ depotEnCours ? 'Dépôt en cours…' : '＋ Déposer un fichier' }}
          </label>
          <p class="files__hint">10 Mo maximum</p>

          <p v-if="erreurDocuments" class="form-error" role="alert">{{ erreurDocuments }}</p>

          <p v-if="!documents.length" class="files__empty">Aucun fichier partagé dans ce canal.</p>
          <ul v-else class="file-list">
            <li v-for="doc in documents" :key="doc.id" class="file-item">
              <span class="file-item__icon" aria-hidden="true">{{ iconeDocument(doc.typeMime) }}</span>
              <div class="file-item__info">
                <strong :title="doc.nomFichier">{{ doc.titre }}</strong>
                <span>{{ formaterTaille(doc.tailleOctets) }} · {{ doc.auteur.prenom }} {{ doc.auteur.nom }}</span>
              </div>
              <button
                type="button"
                class="file-item__download"
                :aria-label="`Télécharger ${doc.titre}`"
                title="Télécharger"
                @click="telecharger(doc)"
              >
                ⬇
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.teams-app {
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--color-bg-inset);
}

/* ================= Application ================= */
.app {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  height: 60px;
  padding: 0 1.25rem;
  background: rgba(11, 26, 45, 0.98);
  border-bottom: 2px solid var(--accent);
  color: #ffffff;
}

.app-bar__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #ffffff;
  text-decoration: none;
}

.app-bar__brand img {
  width: 30px;
  height: auto;
}

.app-bar__spacer {
  flex: 1;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.user-chip__info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-chip__info strong {
  font-size: 0.85rem;
  font-weight: 800;
}

.user-chip__info span {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.65);
}

.app-bar__logout {
  padding: 0.45rem 0.85rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-md);
  background: transparent;
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
}

.app-bar__logout:hover {
  border-color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.app-bar__logout:focus-visible,
.app-bar__brand:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.workspace {
  position: relative;
  display: grid;
  flex: 1;
  grid-template-columns: 280px minmax(0, 1fr) 320px;
  min-height: 0;
}

/* ---------- Canaux ---------- */
.sidebar {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 1rem 0.75rem;
  overflow-y: auto;
  background: linear-gradient(180deg, var(--exp-navy-900) 0%, var(--exp-navy-950) 100%);
  color: #ffffff;
}

.sidebar__title {
  margin: 0 0 0.85rem 0.5rem;
  font-size: 1.05rem;
  font-weight: 900;
}

.sidebar__state {
  padding: 0 0.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.channel-group + .channel-group {
  margin-top: 1.1rem;
}

.channel-group__title {
  margin: 0 0 0.35rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.channel-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.channel-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.6rem 0.7rem;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: rgba(255, 255, 255, 0.82);
  font-family: var(--font-body);
  font-size: 0.93rem;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.channel-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.channel-link:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.channel-link.is-active {
  background: var(--accent);
  color: #ffffff;
}

.channel-link__hash {
  font-weight: 900;
  opacity: 0.7;
}

.channel-link__name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.channel-link__count {
  font-size: 0.72rem;
  opacity: 0.75;
}

/* ---------- Conversation ---------- */
.conversation {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: var(--color-bg-inset);
}

.conversation__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
  padding: 0.9rem 1.5rem;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border-subtle);
}

.conversation__title {
  flex: 1;
  min-width: 0;
}

.conversation__title h1 {
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--color-text-main);
}

.conversation__title h1 span {
  color: var(--accent);
}

.conversation__title p {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.7rem;
  border-radius: var(--radius-full);
  background: var(--exp-emerald-light);
  color: #047857;
  font-size: 0.74rem;
  font-weight: 800;
  white-space: nowrap;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--exp-emerald);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

.files-toggle {
  display: none;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  color: var(--color-text-main);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
}

.messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 1.25rem 1.5rem;
}

.messages__inner {
  max-width: 920px;
  margin: 0 auto;
}

.state {
  margin: 3rem auto;
  max-width: 420px;
  font-size: 0.92rem;
  text-align: center;
  color: var(--color-text-muted);
}

.state--error {
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  background: #fef2f2;
  color: #b91c1c;
}

.state--empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.state__icon {
  font-size: 2.2rem;
}

.thread {
  margin-bottom: 1rem;
  padding: 1rem 1.15rem 0.6rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.message {
  display: flex;
  gap: 0.8rem;
}

.message--mine .message__meta strong {
  color: var(--accent-strong);
}

.message__body {
  flex: 1;
  min-width: 0;
}

.message__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.2rem;
  font-size: 0.84rem;
}

.message__meta strong {
  font-weight: 800;
  color: var(--color-text-main);
}

.message__meta time {
  font-size: 0.76rem;
  color: var(--color-text-light);
}

.message__text {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--color-text-main);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.avatar {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 900;
}

.avatar--sm {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 0.7rem;
}

.avatar--admin {
  background: var(--exp-navy-700);
}

.avatar--formateur {
  background: var(--accent);
}

.avatar--etudiant {
  background: var(--exp-blue);
}

.role-badge {
  padding: 0.08rem 0.45rem;
  border-radius: var(--radius-full);
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.role-badge--admin {
  background: rgba(37, 71, 109, 0.12);
  color: var(--exp-navy-700);
}

.role-badge--formateur {
  background: var(--accent-soft);
  color: var(--accent-strong);
}

.role-badge--etudiant {
  background: var(--exp-blue-subtle);
  color: var(--exp-blue-dark);
}

.replies {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin: 0.75rem 0 0 1.25rem;
  padding-left: 1rem;
  border-left: 2px solid var(--accent-soft);
}

.reply-button {
  margin: 0.5rem 0 0 calc(40px + 0.8rem);
  padding: 0.2rem 0.45rem;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--accent-strong);
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
}

.reply-button:hover {
  background: var(--accent-soft);
}

.reply-button:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

/* ---------- Saisie ---------- */
.composer {
  flex-shrink: 0;
  padding: 0.9rem 1.5rem 0.75rem;
  background: var(--color-bg-card);
  border-top: 1px solid var(--color-border-subtle);
}

.composer__inner {
  max-width: 920px;
  margin: 0 auto;
}

.composer__reply {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  padding: 0.45rem 0.7rem;
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--accent-soft);
  font-size: 0.82rem;
  color: var(--color-text-main);
}

.composer__reply em {
  color: var(--color-text-muted);
}

.composer__cancel {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  line-height: 1;
  color: var(--color-text-muted);
  cursor: pointer;
}

.composer__box {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
}

.composer__input {
  flex: 1;
  min-height: 52px;
  max-height: 180px;
  padding: 0.75rem 0.9rem;
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.45;
  resize: vertical;
  color: var(--color-text-main);
}

.composer__input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.composer__send {
  min-height: 52px;
}

.composer__footer {
  display: flex;
  justify-content: space-between;
  margin-top: 0.35rem;
  font-size: 0.72rem;
  color: var(--color-text-light);
}

.composer__count--low {
  font-weight: 800;
  color: #b91c1c;
}

.form-error {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #b91c1c;
}

/* ---------- Fichiers ---------- */
.files {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 1.1rem;
  overflow-y: auto;
  background: var(--color-bg-card);
  border-left: 1px solid var(--color-border-subtle);
}

.files__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
}

.files__header h2 {
  flex: 1;
  font-size: 1.05rem;
  font-weight: 900;
  color: var(--color-text-main);
}

.files__count {
  min-width: 26px;
  padding: 0.1rem 0.5rem;
  border-radius: var(--radius-full);
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 0.75rem;
  font-weight: 800;
  text-align: center;
}

.files__close {
  display: none;
  border: none;
  background: transparent;
  font-size: 1.4rem;
  line-height: 1;
  color: var(--color-text-muted);
  cursor: pointer;
}

.upload-label {
  cursor: pointer;
}

.upload-label.is-disabled {
  opacity: 0.55;
  pointer-events: none;
}

#depot-fichier:focus-visible + .upload-label {
  box-shadow: var(--focus-ring);
}

.files__hint {
  margin: 0.35rem 0 0.9rem;
  font-size: 0.72rem;
  text-align: center;
  color: var(--color-text-light);
}

.files__empty {
  font-size: 0.86rem;
  color: var(--color-text-muted);
}

.file-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  background: var(--color-bg-inset);
}

.file-item__icon {
  font-size: 1.35rem;
}

.file-item__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.file-item__info strong {
  overflow: hidden;
  font-size: 0.85rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-main);
}

.file-item__info span {
  font-size: 0.73rem;
  color: var(--color-text-muted);
}

.file-item__download {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--accent-strong);
  font-weight: 900;
  cursor: pointer;
}

.file-item__download:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.file-item__download:focus-visible,
.files-toggle:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ---------- Responsive ---------- */
@media (max-width: 1180px) {
  .workspace {
    grid-template-columns: 250px minmax(0, 1fr);
  }

  .files-toggle,
  .files__close {
    display: inline-flex;
  }

  /* Le panneau fichiers devient un tiroir à droite */
  .files {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    width: min(340px, 90vw);
    box-shadow: var(--shadow-xl);
    transform: translateX(105%);
    transition: transform 0.2s ease;
  }

  .files.is-open {
    transform: translateX(0);
  }
}

@media (max-width: 760px) {
  .user-chip__info,
  .composer__hint,
  .live-badge {
    display: none;
  }

  .workspace {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
  }

  /* Les canaux passent en bandeau horizontal */
  .sidebar {
    padding: 0.6rem 0.75rem;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .sidebar__title,
  .channel-group__title {
    display: none;
  }

  .channel-nav {
    display: flex;
    gap: 0.35rem;
  }

  .channel-group + .channel-group {
    margin-top: 0;
  }

  .channel-list {
    flex-direction: row;
  }

  .channel-link {
    white-space: nowrap;
  }

  .messages,
  .composer,
  .conversation__header {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .live-dot,
  .files {
    animation: none;
    transition: none;
  }
}
</style>
