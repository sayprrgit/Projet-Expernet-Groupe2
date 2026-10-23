<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { apiService } from '@/services/api';
import type {
  AdminStats,
  AdminUser,
  CandidatureAdmin,
  Role,
  StatutCandidature,
} from '@/types/user';

const loading = ref(true);
const error = ref('');
const feedback = reactive({ type: '' as '' | 'success' | 'error', message: '' });

const stats = ref<AdminStats | null>(null);
const users = ref<AdminUser[]>([]);
const candidatures = ref<CandidatureAdmin[]>([]);

const search = ref('');
const roleFilter = ref<'ALL' | Role>('ALL');

const showForm = ref(false);
const editingId = ref<number | null>(null);
const saving = ref(false);
const formError = ref('');

const form = reactive({
  email: '',
  password: '',
  nom: '',
  prenom: '',
  role: 'ETUDIANT' as Role,
  telephone: '',
  ville: '',
  codePostal: '',
});

const filteredUsers = computed(() =>
  users.value.filter((user) => {
    const matchesRole = roleFilter.value === 'ALL' || user.role === roleFilter.value;
    const q = search.value.trim().toLowerCase();
    const matchesSearch =
      !q ||
      `${user.prenom} ${user.nom}`.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  }),
);

const roleLabel: Record<Role, string> = {
  ADMIN: 'Administrateur',
  FORMATEUR: 'Formateur',
  ETUDIANT: 'Étudiant',
};

const statutLabel: Record<StatutCandidature, string> = {
  EN_ATTENTE: 'En attente',
  ACCEPTEE: 'Acceptée',
  REFUSEE: 'Refusée',
};

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

function flash(type: 'success' | 'error', message: string) {
  feedback.type = type;
  feedback.message = message;
  window.setTimeout(() => {
    feedback.type = '';
    feedback.message = '';
  }, 4000);
}

async function loadAll() {
  loading.value = true;
  try {
    [stats.value, users.value, candidatures.value] = await Promise.all([
      apiService.getGlobalStats(),
      apiService.getAllUsers(),
      apiService.getCandidaturesAdmin(),
    ]);
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Impossible de charger les données admin.';
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  Object.assign(form, {
    email: '',
    password: '',
    nom: '',
    prenom: '',
    role: 'ETUDIANT',
    telephone: '',
    ville: '',
    codePostal: '',
  });
  formError.value = '';
  showForm.value = true;
}

function openEdit(user: AdminUser) {
  editingId.value = user.id;
  Object.assign(form, {
    email: user.email,
    password: '',
    nom: user.nom,
    prenom: user.prenom,
    role: user.role,
    telephone: user.telephone ?? '',
    ville: user.ville ?? '',
    codePostal: user.codePostal ?? '',
  });
  formError.value = '';
  showForm.value = true;
}

async function submitForm() {
  formError.value = '';
  if (!form.email || !form.nom || !form.prenom) {
    formError.value = "Email, nom et prénom sont obligatoires.";
    return;
  }
  if (!editingId.value && form.password.length < 8) {
    formError.value = 'Le mot de passe doit contenir au moins 8 caractères.';
    return;
  }
  if (editingId.value && form.password && form.password.length < 8) {
    formError.value = 'Le mot de passe doit contenir au moins 8 caractères.';
    return;
  }

  saving.value = true;
  try {
    if (editingId.value) {
      await apiService.updateUser(editingId.value, {
        email: form.email,
        nom: form.nom,
        prenom: form.prenom,
        role: form.role,
        telephone: form.telephone || undefined,
        ville: form.ville || undefined,
        codePostal: form.codePostal || undefined,
        ...(form.password ? { password: form.password } : {}),
      });
      flash('success', 'Utilisateur mis à jour.');
    } else {
      await apiService.createUser({
        email: form.email,
        password: form.password,
        nom: form.nom,
        prenom: form.prenom,
        role: form.role,
        telephone: form.telephone || undefined,
        ville: form.ville || undefined,
        codePostal: form.codePostal || undefined,
      });
      flash('success', 'Utilisateur créé.');
    }
    showForm.value = false;
    users.value = await apiService.getAllUsers();
    stats.value = await apiService.getGlobalStats();
  } catch (err: any) {
    formError.value = err?.response?.data?.message ?? "Erreur lors de l'enregistrement.";
  } finally {
    saving.value = false;
  }
}

async function removeUser(user: AdminUser) {
  if (!window.confirm(`Supprimer définitivement ${user.prenom} ${user.nom} ?`)) return;
  try {
    await apiService.deleteUser(user.id);
    users.value = await apiService.getAllUsers();
    stats.value = await apiService.getGlobalStats();
    flash('success', 'Utilisateur supprimé.');
  } catch (err: any) {
    flash('error', err?.response?.data?.message ?? 'Suppression impossible.');
  }
}

async function setStatut(candidature: CandidatureAdmin, statut: StatutCandidature) {
  try {
    await apiService.updateCandidatureStatut(candidature.id, statut);
    candidatures.value = await apiService.getCandidaturesAdmin();
    stats.value = await apiService.getGlobalStats();
    flash('success', `Candidature ${candidature.reference} : ${statutLabel[statut].toLowerCase()}.`);
  } catch (err: any) {
    flash('error', err?.response?.data?.message ?? 'Mise à jour impossible.');
  }
}

onMounted(loadAll);
</script>

<template>
  <div class="dashboard">
    <section class="welcome">
      <div>
        <h1>Administration Expernet</h1>
        <p>Pilotage des utilisateurs, des promotions et des candidatures.</p>
      </div>
      <button type="button" class="btn-primary" @click="openCreate">
        + Nouvel utilisateur
      </button>
    </section>

    <div v-if="feedback.message" class="flash" :class="`flash--${feedback.type}`">
      {{ feedback.message }}
    </div>

    <div v-if="loading" class="state">Chargement…</div>
    <div v-else-if="error" class="state state--error">{{ error }}</div>

    <template v-else>
      <section v-if="stats" class="stats-grid">
        <article class="stat-card stat--blue">
          <span class="stat-icon">👥</span>
          <div>
            <span class="stat-value">{{ stats.totalEtudiants }}</span>
            <span class="stat-label">Étudiants</span>
          </div>
        </article>
        <article class="stat-card stat--purple">
          <span class="stat-icon">🎓</span>
          <div>
            <span class="stat-value">{{ stats.totalFormateurs }}</span>
            <span class="stat-label">Formateurs</span>
          </div>
        </article>
        <article class="stat-card stat--green">
          <span class="stat-icon">✅</span>
          <div>
            <span class="stat-value">
              {{ stats.tauxPresenceGlobal !== null ? `${stats.tauxPresenceGlobal}%` : '—' }}
            </span>
            <span class="stat-label">Présence globale</span>
          </div>
        </article>
        <article class="stat-card stat--orange">
          <span class="stat-icon">📊</span>
          <div>
            <span class="stat-value">{{ stats.moyenneGenerale ?? '—' }}</span>
            <span class="stat-label">Moyenne centre</span>
          </div>
        </article>
        <article class="stat-card stat--blue">
          <span class="stat-icon">📚</span>
          <div>
            <span class="stat-value">{{ stats.totalPromotions }}</span>
            <span class="stat-label">Promotions</span>
          </div>
        </article>
        <article class="stat-card stat--purple">
          <span class="stat-icon">🧭</span>
          <div>
            <span class="stat-value">{{ stats.totalFormations }}</span>
            <span class="stat-label">Formations</span>
          </div>
        </article>
      </section>

      <section v-if="stats" class="panel candidatures-panel">
        <header class="panel-head">
          <h2>📨 Candidatures</h2>
          <span class="sub">
            {{ stats.candidatures.total }} au total · {{ stats.candidatures.enAttente }} en attente
          </span>
        </header>
        <p v-if="!candidatures.length" class="state">Aucune candidature.</p>
        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Réf.</th>
                <th>Candidat</th>
                <th>Formation</th>
                <th>Reçue le</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="candidature in candidatures" :key="candidature.id">
                <td><strong>{{ candidature.reference }}</strong></td>
                <td>
                  {{ candidature.prenom }} {{ candidature.nom }}
                  <br><small>{{ candidature.email }}</small>
                </td>
                <td>{{ candidature.formation?.titre ?? 'Demande d’information' }}</td>
                <td>{{ shortDate(candidature.createdAt) }}</td>
                <td>
                  <span class="statut" :class="`statut--${candidature.statut.toLowerCase()}`">
                    {{ statutLabel[candidature.statut] }}
                  </span>
                </td>
                <td>
                  <div class="row-actions">
                    <button
                      v-if="candidature.statut !== 'ACCEPTEE'"
                      type="button"
                      class="mini mini--ok"
                      @click="setStatut(candidature, 'ACCEPTEE')"
                    >
                      Accepter
                    </button>
                    <button
                      v-if="candidature.statut !== 'REFUSEE'"
                      type="button"
                      class="mini mini--ko"
                      @click="setStatut(candidature, 'REFUSEE')"
                    >
                      Refuser
                    </button>
                    <button
                      v-if="candidature.statut !== 'EN_ATTENTE'"
                      type="button"
                      class="mini"
                      @click="setStatut(candidature, 'EN_ATTENTE')"
                    >
                      Remettre en attente
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <header class="panel-head">
          <h2>👤 Utilisateurs</h2>
          <div class="filters">
            <input v-model="search" type="search" placeholder="Rechercher un nom ou email…" aria-label="Rechercher un utilisateur par nom ou email" />
            <select v-model="roleFilter" aria-label="Filtrer par rôle" @keydown.space.prevent.stop>
              <option value="ALL">Tous les rôles</option>
              <option value="ETUDIANT">Étudiants</option>
              <option value="FORMATEUR">Formateurs</option>
              <option value="ADMIN">Administrateurs</option>
            </select>
          </div>
        </header>

        <p v-if="!filteredUsers.length" class="state">Aucun utilisateur ne correspond.</p>
        <div v-else class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Ville</th>
                <th>Rattachement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td><strong>{{ user.prenom }} {{ user.nom }}</strong></td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="role" :class="`role--${user.role.toLowerCase()}`">
                    {{ roleLabel[user.role] }}
                  </span>
                </td>
                <td>{{ user.ville || '—' }}</td>
                <td>
                  <small v-if="user.role === 'ETUDIANT'">
                    {{ user._count?.inscriptions ?? 0 }} inscription(s)
                  </small>
                  <small v-else-if="user.role === 'FORMATEUR'">
                    {{ user._count?.promotionsEnseignees ?? 0 }} promotion(s)
                  </small>
                  <small v-else>Administration</small>
                </td>
                <td>
                  <div class="row-actions">
                    <button type="button" class="mini" @click="openEdit(user)">Modifier</button>
                    <button type="button" class="mini mini--ko" @click="removeUser(user)">Supprimer</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal" role="dialog" aria-modal="true">
        <header class="modal-head">
          <h2>{{ editingId ? 'Modifier un utilisateur' : 'Nouvel utilisateur' }}</h2>
          <button type="button" class="close" aria-label="Fermer" @click="showForm = false">✕</button>
        </header>

        <form class="user-form" @submit.prevent="submitForm">
          <div v-if="formError" class="form-error">{{ formError }}</div>
          <div class="grid-2">
            <label>
              Prénom
              <input v-model="form.prenom" type="text" required />
            </label>
            <label>
              Nom
              <input v-model="form.nom" type="text" required />
            </label>
          </div>
          <label>
            Email
            <input v-model="form.email" type="email" required />
          </label>
          <div class="grid-2">
            <label>
              Rôle
              <select v-model="form.role" @keydown.space.prevent.stop>
                <option value="ETUDIANT">Étudiant</option>
                <option value="FORMATEUR">Formateur</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </label>
            <label>
              Mot de passe {{ editingId ? '(laisser vide pour conserver)' : '' }}
              <input
                v-model="form.password"
                type="password"
                :required="!editingId"
                minlength="8"
                autocomplete="new-password"
              />
            </label>
          </div>
          <div class="grid-2">
            <label>
              Téléphone
              <input v-model="form.telephone" type="tel" />
            </label>
            <label>
              Ville
              <input v-model="form.ville" type="text" />
            </label>
          </div>
          <label>
            Code postal
            <input v-model="form.codePostal" type="text" maxlength="5" />
          </label>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showForm = false">Annuler</button>
            <button type="submit" class="btn-primary" :disabled="saving">
              {{ saving ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 1.25rem; }
.welcome {
  display: flex; align-items: center; justify-content: space-between; gap: 1.5rem;
  padding: 1.75rem 2rem; border-radius: var(--radius-lg); color: #fff;
  background: linear-gradient(135deg, var(--exp-navy-950), var(--exp-navy-800));
}
.welcome h1 { font-size: 1.6rem; font-weight: 900; margin-bottom: 0.35rem; }
.welcome p { opacity: 0.85; }
.btn-primary { padding: 0.7rem 1.1rem; border: 0; border-radius: var(--radius-md); background: var(--exp-orange); color: var(--exp-navy-950); font-weight: 800; cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { padding: 0.7rem 1.1rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius-md); background: #fff; color: var(--exp-navy-900); font-weight: 700; cursor: pointer; }
.flash { padding: 0.8rem 1rem; border-radius: var(--radius-md); font-weight: 600; font-size: 0.9rem; }
.flash--success { background: #dcfce7; color: #047857; }
.flash--error { background: #fee2e2; color: #b91c1c; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem; }
.stat-card { display: flex; align-items: center; gap: 0.85rem; padding: 1.1rem; background: #fff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.stat-icon { font-size: 1.4rem; width: 46px; height: 46px; display: grid; place-items: center; border-radius: var(--radius-md); background: var(--color-bg-inset); }
.stat--blue .stat-icon { background: #e0edff; }
.stat--green .stat-icon { background: #dcfce7; }
.stat--orange .stat-icon { background: #ffedd5; }
.stat--purple .stat-icon { background: #ede9fe; }
.stat-value { display: block; font-size: 1.45rem; font-weight: 900; color: var(--exp-navy-950); line-height: 1; }
.stat-label { display: block; margin-top: 0.2rem; font-size: 0.76rem; color: var(--color-text-muted); }
.panel { background: #fff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: 1.35rem; box-shadow: var(--shadow-sm); }
.panel-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; padding-bottom: 0.7rem; border-bottom: 1px solid var(--color-border-subtle); }
.panel-head h2 { font-size: 1.05rem; font-weight: 800; color: var(--exp-navy-900); }
.sub { font-size: 0.78rem; color: var(--color-text-muted); }
.filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.filters input, .filters select { padding: 0.5rem 0.7rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius-md); font-size: 0.84rem; }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; min-width: 780px; }
th, td { padding: 0.7rem 0.8rem; text-align: left; border-bottom: 1px solid var(--color-border-subtle); vertical-align: middle; }
th { background: var(--color-bg-inset); font-weight: 800; color: var(--exp-navy-900); font-size: 0.73rem; text-transform: uppercase; letter-spacing: 0.03em; }
td small { color: var(--color-text-muted); }
.row-actions { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.mini { padding: 0.28rem 0.55rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius-full); background: #fff; font-size: 0.7rem; font-weight: 700; color: var(--exp-navy-900); cursor: pointer; }
.mini--ok { border-color: #10b981; color: #047857; }
.mini--ko { border-color: #ef4444; color: #b91c1c; }
.statut { padding: 0.2rem 0.55rem; border-radius: var(--radius-full); font-size: 0.68rem; font-weight: 800; white-space: nowrap; }
.statut--en_attente { background: #ffedd5; color: #c2410c; }
.statut--acceptee { background: #dcfce7; color: #047857; }
.statut--refusee { background: #fee2e2; color: #b91c1c; }
.role { padding: 0.2rem 0.55rem; border-radius: var(--radius-full); font-size: 0.68rem; font-weight: 800; white-space: nowrap; }
.role--admin { background: #ede9fe; color: #6d28d9; }
.role--formateur { background: #e0edff; color: #1d4ed8; }
.role--etudiant { background: #dcfce7; color: #047857; }
.state { padding: 1.25rem; text-align: center; border-radius: var(--radius-md); background: var(--color-bg-inset); color: var(--color-text-muted); border: 1px dashed var(--color-border-strong); }
.state--error { color: #b91c1c; background: #fef2f2; border-color: #fecaca; }
.modal-overlay { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; padding: 1rem; background: rgba(15, 23, 42, 0.6); }
.modal { width: min(560px, 100%); max-height: 90vh; overflow-y: auto; background: #fff; border-radius: var(--radius-lg); padding: 1.5rem; box-shadow: var(--shadow-2xl); }
.modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.modal-head h2 { font-size: 1.15rem; font-weight: 900; color: var(--exp-navy-950); }
.close { border: 0; background: transparent; font-size: 1.1rem; cursor: pointer; color: var(--color-text-muted); }
.user-form { display: flex; flex-direction: column; gap: 0.85rem; }
.user-form label { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.8rem; font-weight: 700; color: var(--exp-navy-900); }
.user-form input, .user-form select { padding: 0.6rem 0.7rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius-md); font-size: 0.88rem; font-family: inherit; }
.user-form input:focus, .user-form select:focus { outline: none; border-color: var(--exp-orange); box-shadow: 0 0 0 3px rgba(242,140,5,0.15); }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.6rem; margin-top: 0.5rem; }
.form-error { padding: 0.6rem 0.8rem; border-radius: var(--radius-md); background: #fee2e2; color: #b91c1c; font-size: 0.82rem; font-weight: 600; }
@media (max-width: 640px) { .welcome { flex-direction: column; align-items: flex-start; } .grid-2 { grid-template-columns: 1fr; } }
</style>
