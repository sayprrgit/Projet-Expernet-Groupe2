<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { apiService } from '@/services/api';
import type {
  Competence,
  Emargement,
  EtudiantStats,
  Examen,
  FormateurOverview,
  Note,
  Promotion,
  PromotionStats,
  Session,
} from '@/types/user';

const loading = ref(true);
const error = ref('');
const overview = ref<FormateurOverview | null>(null);
const promotions = ref<Promotion[]>([]);
const selectedPromoId = ref<number | null>(null);

const etudiants = ref<EtudiantStats[]>([]);
const sessions = ref<Session[]>([]);
const stats = ref<PromotionStats | null>(null);
const notes = ref<Note[]>([]);
const examens = ref<Examen[]>([]);
const competences = ref<Competence[]>([]);

const selectedSessionId = ref<number | null>(null);
const emargements = ref<Emargement[]>([]);
const loadingSession = ref(false);
const saving = ref(false);
const feedback = reactive({ type: '' as '' | 'success' | 'error', message: '' });

const noteForm = reactive({
  etudiantId: '',
  examenId: '',
  competenceId: '',
  valeur: '',
  appreciation: '',
});

const selectedPromotion = computed(
  () => promotions.value.find((p) => p.id === selectedPromoId.value) ?? null,
);

const selectedSession = computed(
  () => sessions.value.find((s) => s.id === selectedSessionId.value) ?? null,
);

const pastSessions = computed(() =>
  sessions.value.filter((s) => new Date(s.fin) < new Date()),
);
const upcomingSessions = computed(() =>
  sessions.value.filter((s) => new Date(s.fin) >= new Date()),
);

const presenceSet = computed(() => new Set(emargements.value.map((e) => e.etudiantId)));

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const gradeClass = (valeur: number) => {
  if (valeur >= 16) return 'grade--excellent';
  if (valeur >= 12) return 'grade--good';
  if (valeur >= 10) return 'grade--average';
  return 'grade--weak';
};

function flash(type: 'success' | 'error', message: string) {
  feedback.type = type;
  feedback.message = message;
  window.setTimeout(() => {
    feedback.type = '';
    feedback.message = '';
  }, 4000);
}

async function loadPromotion(promotionId: number) {
  selectedSessionId.value = null;
  emargements.value = [];
  try {
    const [e, s, st, n, ex, co] = await Promise.all([
      apiService.getEtudiantsPromotion(promotionId),
      apiService.getSessionsPromotion(promotionId),
      apiService.getStatsPromotion(promotionId),
      apiService.getNotesPromotion(promotionId),
      apiService.getExamensPromotion(promotionId),
      apiService.getCompetencesPromotion(promotionId),
    ]);
    etudiants.value = e;
    sessions.value = s;
    stats.value = st;
    notes.value = n;
    examens.value = ex;
    competences.value = co;

    noteForm.etudiantId = e[0] ? String(e[0].id) : '';
    noteForm.examenId = ex[0] ? String(ex[0].id) : '';
    noteForm.competenceId = co[0] ? String(co[0].id) : '';
  } catch (err: any) {
    flash('error', err?.response?.data?.message ?? 'Erreur de chargement de la promotion.');
  }
}

async function loadOverview() {
  try {
    overview.value = await apiService.getFormateurOverview();
    promotions.value = await apiService.getMesPromotions();
    const firstPromo = promotions.value[0];
    if (firstPromo) {
      selectedPromoId.value = firstPromo.id;
      await loadPromotion(firstPromo.id);
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? 'Impossible de charger le tableau de bord.';
  } finally {
    loading.value = false;
  }
}

async function selectSession(sessionId: number) {
  if (selectedSessionId.value === sessionId) {
    selectedSessionId.value = null;
    emargements.value = [];
    return;
  }
  selectedSessionId.value = sessionId;
  loadingSession.value = true;
  try {
    emargements.value = await apiService.getEmargementsSession(sessionId);
  } catch {
    flash('error', 'Impossible de charger les émargements.');
  } finally {
    loadingSession.value = false;
  }
}

async function markPresence(etudiant: EtudiantStats, present: boolean) {
  if (!selectedSessionId.value) return;
  saving.value = true;
  try {
    await apiService.marquerPresence(selectedSessionId.value, etudiant.id, present);
    emargements.value = await apiService.getEmargementsSession(selectedSessionId.value);
    etudiants.value = await apiService.getEtudiantsPromotion(selectedPromoId.value!);
    stats.value = await apiService.getStatsPromotion(selectedPromoId.value!);
    flash('success', `${etudiant.prenom} ${etudiant.nom} : ${present ? 'présent' : 'absent'}.`);
  } catch (err: any) {
    flash('error', err?.response?.data?.message ?? "Erreur lors de l'enregistrement.");
  } finally {
    saving.value = false;
  }
}

async function submitNote() {
  const etudiantId = Number(noteForm.etudiantId);
  const examenId = Number(noteForm.examenId);
  const competenceId = Number(noteForm.competenceId);
  const valeur = Number(noteForm.valeur);

  if (!etudiantId || !examenId || !competenceId) {
    flash('error', 'Sélectionnez un étudiant, un examen et une compétence.');
    return;
  }
  if (!Number.isFinite(valeur) || valeur < 0 || valeur > 20) {
    flash('error', 'La note doit être comprise entre 0 et 20.');
    return;
  }

  saving.value = true;
  try {
    await apiService.saisirNote({
      etudiantId,
      examenId,
      competenceId,
      valeur,
      appreciation: noteForm.appreciation || undefined,
    });
    notes.value = await apiService.getNotesPromotion(selectedPromoId.value!);
    etudiants.value = await apiService.getEtudiantsPromotion(selectedPromoId.value!);
    stats.value = await apiService.getStatsPromotion(selectedPromoId.value!);
    noteForm.valeur = '';
    noteForm.appreciation = '';
    flash('success', 'Note enregistrée avec succès.');
  } catch (err: any) {
    flash('error', err?.response?.data?.message ?? "Erreur lors de l'enregistrement de la note.");
  } finally {
    saving.value = false;
  }
}

watch(selectedPromoId, (id, old) => {
  if (id && id !== old) loadPromotion(id);
});

onMounted(loadOverview);
</script>

<template>
  <div class="dashboard">
    <section id="formateur-accueil" class="welcome">
      <div>
        <h1>Tableau de bord formateur</h1>
        <p>Suivez l'évolution, l'assiduité et les résultats de vos promotions.</p>
      </div>
      <div v-if="promotions.length" class="promo-picker">
        <label for="promo">Promotion</label>
        <select id="promo" v-model.number="selectedPromoId" @keydown.space.prevent.stop>
          <option v-for="promo in promotions" :key="promo.id" :value="promo.id">
            {{ promo.nom }}
          </option>
        </select>
      </div>
    </section>

    <div v-if="feedback.message" class="flash" :class="`flash--${feedback.type}`">
      {{ feedback.message }}
    </div>

    <div v-if="loading" class="state">Chargement…</div>
    <div v-else-if="error" class="state state--error">{{ error }}</div>

    <template v-else>
      <section v-if="overview" class="stats-grid">
        <article class="stat-card stat--blue">
          <span class="stat-icon">👥</span>
          <div>
            <span class="stat-value">{{ overview.etudiants }}</span>
            <span class="stat-label">Étudiants suivis</span>
          </div>
        </article>
        <article class="stat-card stat--green">
          <span class="stat-icon">✅</span>
          <div>
            <span class="stat-value">
              {{ overview.tauxPresenceMoyen !== null ? `${overview.tauxPresenceMoyen}%` : '—' }}
            </span>
            <span class="stat-label">Assiduité moyenne</span>
          </div>
        </article>
        <article class="stat-card stat--orange">
          <span class="stat-icon">📊</span>
          <div>
            <span class="stat-value">{{ overview.moyenneGenerale ?? '—' }}</span>
            <span class="stat-label">Moyenne générale</span>
          </div>
        </article>
        <article class="stat-card stat--purple">
          <span class="stat-icon">🎓</span>
          <div>
            <span class="stat-value">{{ overview.promotions }}</span>
            <span class="stat-label">Promotions</span>
          </div>
        </article>
      </section>

      <template v-if="selectedPromotion">
        <section v-if="stats" id="formateur-indicateurs" class="panel">
          <header class="panel-head">
            <h2>{{ selectedPromotion.nom }} — indicateurs</h2>
            <span class="sub">{{ selectedPromotion.formation?.libelle }}</span>
          </header>
          <div class="kpi-row">
            <div class="kpi"><span>{{ stats.effectif }}</span><small>Effectif</small></div>
            <div class="kpi"><span>{{ stats.sessionsTerminees }}</span><small>Sessions terminées</small></div>
            <div class="kpi"><span>{{ stats.tauxPresence ?? '—' }}%</span><small>Taux de présence</small></div>
            <div class="kpi"><span>{{ stats.tauxAbsence ?? '—' }}%</span><small>Absentéisme</small></div>
            <div class="kpi"><span>{{ stats.moyenneGenerale ?? '—' }}</span><small>Moyenne / 20</small></div>
            <div class="kpi"><span>{{ stats.tauxReussite ?? '—' }}%</span><small>Réussite (≥ 10)</small></div>
          </div>
        </section>

        <section id="formateur-etudiants" class="panel">
          <header class="panel-head">
            <h2>👥 Suivi des étudiants</h2>
            <span class="sub">{{ etudiants.length }} étudiant(s)</span>
          </header>
          <p v-if="!etudiants.length" class="state">Aucun étudiant inscrit.</p>
          <div v-else class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Moyenne</th>
                  <th>Présences</th>
                  <th>Absences</th>
                  <th>Assiduité</th>
                  <th>Progression</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="etudiant in etudiants" :key="etudiant.id">
                  <td>
                    <strong>{{ etudiant.prenom }} {{ etudiant.nom }}</strong>
                    <br><small>{{ etudiant.email }}</small>
                  </td>
                  <td>
                    <span v-if="etudiant.moyenne !== null" class="grade" :class="gradeClass(etudiant.moyenne)">
                      {{ etudiant.moyenne }}/20
                    </span>
                    <span v-else class="muted">—</span>
                  </td>
                  <td>{{ etudiant.presences }}/{{ etudiant.totalSessions }}</td>
                  <td>
                    <span :class="{ 'text-danger': etudiant.absences > 0 }">{{ etudiant.absences }}</span>
                  </td>
                  <td>
                    <div class="assiduite">
                      <div class="assiduite-bar">
                        <span :style="{ width: `${etudiant.tauxPresence ?? 0}%` }"></span>
                      </div>
                      <small>{{ etudiant.tauxPresence !== null ? `${etudiant.tauxPresence}%` : '—' }}</small>
                    </div>
                  </td>
                  <td>
                    <span class="pill pill--green">{{ etudiant.progression.acquis }} acquis</span>
                    <span class="pill pill--orange">{{ etudiant.progression.enCours }} en cours</span>
                    <span class="pill pill--red">{{ etudiant.progression.nonAcquis }} non acquis</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="two-columns">
          <section id="formateur-emargements" class="panel">
            <header class="panel-head">
              <h2>🕒 Émargements</h2>
              <span class="sub">Cliquez sur une session passée</span>
            </header>
            <p v-if="!pastSessions.length" class="state">Aucune session terminée.</p>
            <ul v-else class="session-list">
              <li v-for="session in pastSessions" :key="session.id">
                <button
                  type="button"
                  class="session-button"
                  :class="{ 'session-button--active': selectedSessionId === session.id }"
                  @click="selectSession(session.id)"
                >
                  <span>
                    <strong>{{ session.titre }}</strong>
                    <small>{{ formatDate(session.debut) }} · {{ formatTime(session.debut) }} – {{ formatTime(session.fin) }}</small>
                  </span>
                  <span class="chevron">{{ selectedSessionId === session.id ? '▾' : '▸' }}</span>
                </button>

                <div v-if="selectedSessionId === session.id" class="presence-panel">
                  <div v-if="loadingSession" class="state">Chargement…</div>
                  <ul v-else class="presence-list">
                    <li v-for="etudiant in etudiants" :key="etudiant.id">
                      <span>{{ etudiant.prenom }} {{ etudiant.nom }}</span>
                      <div class="presence-actions">
                        <button
                          type="button"
                          class="toggle"
                          :class="{ 'toggle--on': presenceSet.has(etudiant.id) }"
                          :disabled="saving"
                          @click="markPresence(etudiant, true)"
                        >
                          Présent
                        </button>
                        <button
                          type="button"
                          class="toggle toggle--absent"
                          :class="{ 'toggle--off': !presenceSet.has(etudiant.id) }"
                          :disabled="saving"
                          @click="markPresence(etudiant, false)"
                        >
                          Absent
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <p v-if="selectedSession" class="hint">
              Session sélectionnée : {{ selectedSession.titre }}
            </p>

            <h3 class="sub-title">À venir</h3>
            <p v-if="!upcomingSessions.length" class="muted">Aucune session à venir.</p>
            <ul v-else class="upcoming-list">
              <li v-for="session in upcomingSessions" :key="session.id">
                <strong>{{ session.titre }}</strong>
                <span>{{ formatDate(session.debut) }} · {{ formatTime(session.debut) }}</span>
              </li>
            </ul>
          </section>

          <section id="formateur-saisie" class="panel">
            <header class="panel-head">
              <h2>📝 Saisir une note</h2>
            </header>
            <form class="note-form" @submit.prevent="submitNote">
              <label>
                Étudiant
                <select v-model="noteForm.etudiantId" @keydown.space.prevent.stop>
                  <option v-for="etudiant in etudiants" :key="etudiant.id" :value="String(etudiant.id)">
                    {{ etudiant.prenom }} {{ etudiant.nom }}
                  </option>
                </select>
              </label>
              <label>
                Examen
                <select v-model="noteForm.examenId" @keydown.space.prevent.stop>
                  <option v-for="examen in examens" :key="examen.id" :value="String(examen.id)">
                    {{ examen.intitule }}
                  </option>
                </select>
              </label>
              <label>
                Compétence
                <select v-model="noteForm.competenceId" @keydown.space.prevent.stop>
                  <option v-for="competence in competences" :key="competence.id" :value="String(competence.id)">
                    {{ competence.code }} — {{ competence.libelle }}
                  </option>
                </select>
              </label>
              <label>
                Note sur 20
                <input v-model="noteForm.valeur" type="number" min="0" max="20" step="0.5" required />
              </label>
              <label>
                Appréciation
                <textarea v-model="noteForm.appreciation" rows="3" placeholder="Commentaire optionnel…"></textarea>
              </label>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Enregistrement…' : 'Enregistrer la note' }}
              </button>
            </form>
          </section>
        </div>

        <section id="formateur-notes" class="panel">
          <header class="panel-head">
            <h2>📚 Notes de la promotion</h2>
            <span class="sub">{{ notes.length }} note(s)</span>
          </header>
          <p v-if="!notes.length" class="state">Aucune note saisie.</p>
          <div v-else class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Compétence</th>
                  <th>Examen</th>
                  <th>Note</th>
                  <th>Niveau</th>
                  <th>Appréciation</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="note in notes" :key="note.id">
                  <td>{{ note.etudiant?.prenom }} {{ note.etudiant?.nom }}</td>
                  <td>{{ note.competence?.code }} — {{ note.competence?.libelle }}</td>
                  <td>{{ note.examen?.intitule }}</td>
                  <td><span class="grade" :class="gradeClass(note.valeur)">{{ note.valeur }}/20</span></td>
                  <td>{{ note.niveau.replace('_', ' ') }}</td>
                  <td class="appreciation">{{ note.appreciation || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

      <div v-else class="state">Aucune promotion ne vous est assignée.</div>
    </template>
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
.promo-picker { display: flex; flex-direction: column; gap: 0.35rem; min-width: 240px; }
.promo-picker label { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255, 255, 255, 0.7); }
.promo-picker select { padding: 0.6rem 0.75rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.1); color: #fff; font-weight: 600; }
.promo-picker option { color: #111; }
.flash { padding: 0.8rem 1rem; border-radius: var(--radius-md); font-weight: 600; font-size: 0.9rem; }
.flash--success { background: #dcfce7; color: #047857; }
.flash--error { background: #fee2e2; color: #b91c1c; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 1rem; }
.stat-card { display: flex; align-items: center; gap: 0.9rem; padding: 1.2rem; background: #fff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
.stat-icon { font-size: 1.5rem; width: 50px; height: 50px; display: grid; place-items: center; border-radius: var(--radius-md); background: var(--color-bg-inset); }
.stat--blue .stat-icon { background: #e0edff; }
.stat--green .stat-icon { background: #dcfce7; }
.stat--orange .stat-icon { background: #ffedd5; }
.stat--purple .stat-icon { background: #ede9fe; }
.stat-value { display: block; font-size: 1.5rem; font-weight: 900; color: var(--exp-navy-950); line-height: 1; }
.stat-label { display: block; margin-top: 0.2rem; font-size: 0.78rem; color: var(--color-text-muted); }
.panel { background: #fff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: 1.35rem; box-shadow: var(--shadow-sm); }
.panel-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; padding-bottom: 0.7rem; border-bottom: 1px solid var(--color-border-subtle); }
.panel-head h2 { font-size: 1.05rem; font-weight: 800; color: var(--exp-navy-900); }
.sub { font-size: 0.78rem; color: var(--color-text-muted); }
.sub-title { margin: 1.25rem 0 0.5rem; font-size: 0.9rem; font-weight: 800; color: var(--exp-navy-900); }
.kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; }
.kpi { padding: 0.9rem; background: var(--color-bg-inset); border-radius: var(--radius-md); text-align: center; }
.kpi span { display: block; font-size: 1.35rem; font-weight: 900; color: var(--exp-navy-950); }
.kpi small { font-size: 0.72rem; color: var(--color-text-muted); }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.86rem; min-width: 760px; }
th, td { padding: 0.75rem 0.85rem; text-align: left; border-bottom: 1px solid var(--color-border-subtle); vertical-align: middle; }
th { background: var(--color-bg-inset); font-weight: 800; color: var(--exp-navy-900); font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.03em; }
td small { color: var(--color-text-muted); }
.appreciation { color: var(--color-text-muted); max-width: 220px; }
.muted { color: var(--color-text-muted); font-size: 0.85rem; }
.text-danger { color: #b91c1c; font-weight: 800; }
.grade { padding: 0.2rem 0.55rem; border-radius: var(--radius-full); font-weight: 800; white-space: nowrap; }
.grade--excellent { background: #dcfce7; color: #047857; }
.grade--good { background: #e0edff; color: #1d4ed8; }
.grade--average { background: #ffedd5; color: #c2410c; }
.grade--weak { background: #fee2e2; color: #b91c1c; }
.pill { display: inline-block; margin: 0.1rem 0.15rem 0.1rem 0; padding: 0.15rem 0.45rem; border-radius: var(--radius-full); font-size: 0.66rem; font-weight: 800; white-space: nowrap; }
.pill--green { background: #dcfce7; color: #047857; }
.pill--orange { background: #ffedd5; color: #c2410c; }
.pill--red { background: #fee2e2; color: #b91c1c; }
.assiduite { display: flex; align-items: center; gap: 0.5rem; }
.assiduite-bar { width: 70px; height: 8px; border-radius: var(--radius-full); background: #e5e7eb; overflow: hidden; }
.assiduite-bar span { display: block; height: 100%; background: #10b981; }
.assiduite small { font-size: 0.72rem; color: var(--color-text-muted); }
.two-columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.25rem; }
.session-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
.session-button { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.75rem 0.85rem; background: var(--color-bg-inset); border: 1px solid transparent; border-radius: var(--radius-md); cursor: pointer; text-align: left; }
.session-button:hover { border-color: var(--exp-orange); }
.session-button--active { border-color: var(--exp-orange); background: #fff7ed; }
.session-button strong { display: block; font-size: 0.86rem; color: var(--exp-navy-950); }
.session-button small { display: block; font-size: 0.74rem; color: var(--color-text-muted); }
.chevron { color: var(--exp-orange-dark); font-weight: 900; }
.presence-panel { padding: 0.6rem 0.25rem 0.2rem; }
.presence-list { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; }
.presence-list li { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; font-size: 0.84rem; padding: 0.35rem 0.25rem; border-bottom: 1px dashed var(--color-border-subtle); }
.presence-actions { display: flex; gap: 0.35rem; }
.toggle { padding: 0.3rem 0.6rem; border: 1px solid var(--color-border-strong); background: #fff; border-radius: var(--radius-full); font-size: 0.72rem; font-weight: 700; color: var(--color-text-muted); cursor: pointer; }
.toggle--on { background: #dcfce7; border-color: #10b981; color: #047857; }
.toggle--off { background: #fee2e2; border-color: #ef4444; color: #b91c1c; }
.hint { margin-top: 0.5rem; font-size: 0.78rem; color: var(--exp-blue-dark); }
.upcoming-list { list-style: none; display: flex; flex-direction: column; gap: 0.45rem; }
.upcoming-list li { padding: 0.6rem 0.75rem; border-radius: var(--radius-md); background: var(--color-bg-inset); border-left: 3px solid var(--exp-blue); }
.upcoming-list strong { display: block; font-size: 0.84rem; color: var(--exp-navy-950); }
.upcoming-list span { font-size: 0.74rem; color: var(--color-text-muted); }
.note-form { display: flex; flex-direction: column; gap: 0.75rem; }
.note-form label { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.8rem; font-weight: 700; color: var(--exp-navy-900); }
.note-form select, .note-form input, .note-form textarea { padding: 0.6rem 0.7rem; border: 1px solid var(--color-border-strong); border-radius: var(--radius-md); font-size: 0.88rem; font-family: inherit; }
.note-form select:focus, .note-form input:focus, .note-form textarea:focus { outline: none; border-color: var(--exp-orange); box-shadow: 0 0 0 3px rgba(242,140,5,0.15); }
.btn-primary { padding: 0.75rem 1rem; border: 0; border-radius: var(--radius-md); background: var(--exp-orange); color: var(--exp-navy-950); font-weight: 800; cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.state { padding: 1.25rem; text-align: center; border-radius: var(--radius-md); background: var(--color-bg-inset); color: var(--color-text-muted); border: 1px dashed var(--color-border-strong); }
.state--error { color: #b91c1c; background: #fef2f2; border-color: #fecaca; }
@media (max-width: 700px) { .welcome { flex-direction: column; align-items: flex-start; } }
/* Ancres de la navigation formateur : ne pas passer sous l'en-tête collant */
.welcome,
.panel {
  scroll-margin-top: 90px;
}
</style>
