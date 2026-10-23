<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { apiService } from '@/services/api';
import type { Assiduite, Note, Progression, Promotion, Session } from '@/types/user';

const emit = defineEmits<{ (e: 'navigate', key: string): void }>();

const auth = useAuthStore();

const sessions = ref<Session[]>([]);
const notes = ref<Note[]>([]);
const progression = ref<Progression | null>(null);
const assiduite = ref<Assiduite | null>(null);
const promotion = ref<Promotion | null>(null);
const isLoading = ref(true);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const prochainesSessions = computed(() => {
  const now = new Date();
  return sessions.value.filter((s) => new Date(s.fin) >= now).slice(0, 5);
});

const gradeClass = (valeur: number) => {
  if (valeur >= 16) return 'grade--excellent';
  if (valeur >= 12) return 'grade--good';
  if (valeur >= 10) return 'grade--average';
  return 'grade--weak';
};

async function loadDashboard() {
  isLoading.value = true;
  try {
    const [s, n, p, a, promo] = await Promise.all([
      apiService.getMonEmploiDuTemps(),
      apiService.getMesNotes(),
      apiService.getMaProgression(),
      apiService.getMonAssiduite(),
      apiService.getMaPromotion(),
    ]);
    sessions.value = s;
    notes.value = n;
    progression.value = p;
    assiduite.value = a;
    promotion.value = promo;
  } catch (err) {
    console.error('Erreur chargement dashboard étudiant :', err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadDashboard);
</script>

<template>
  <div class="dashboard">
    <section class="welcome">
      <div>
        <h1>Bonjour, {{ auth.user?.prenom }} 👋</h1>
        <p v-if="promotion">
          Promotion <strong>{{ promotion.nom }}</strong> — {{ promotion.formation?.libelle }}
        </p>
        <p v-else class="muted">Aucune promotion ne vous est encore assignée.</p>
      </div>
      <button type="button" class="btn-ghost" @click="emit('navigate', 'emploi-du-temps')">
        📅 Mon emploi du temps
      </button>
    </section>

    <div v-if="isLoading" class="loading">Chargement de vos données…</div>

    <template v-else>
      <section class="stats-grid">
        <article class="stat-card stat--blue">
          <span class="stat-icon">📊</span>
          <div>
            <span class="stat-value">{{ progression?.moyenne ?? '—' }}</span>
            <span class="stat-label">Moyenne générale / 20</span>
          </div>
        </article>
        <article class="stat-card stat--green">
          <span class="stat-icon">✅</span>
          <div>
            <span class="stat-value">
              {{ assiduite?.tauxPresence !== null ? `${assiduite?.tauxPresence}%` : '—' }}
            </span>
            <span class="stat-label">Taux de présence</span>
          </div>
        </article>
        <article class="stat-card stat--orange">
          <span class="stat-icon">🎯</span>
          <div>
            <span class="stat-value">{{ progression?.acquis ?? 0 }}</span>
            <span class="stat-label">Compétences acquises</span>
          </div>
        </article>
        <article class="stat-card stat--purple">
          <span class="stat-icon">📋</span>
          <div>
            <span class="stat-value">{{ assiduite?.absences ?? 0 }}</span>
            <span class="stat-label">Absences enregistrées</span>
          </div>
        </article>
      </section>

      <div class="two-columns">
        <section class="panel">
          <header class="panel-head">
            <h2>📅 Prochaines sessions</h2>
            <button type="button" class="link" @click="emit('navigate', 'emploi-du-temps')">
              Voir tout →
            </button>
          </header>
          <p v-if="!prochainesSessions.length" class="empty">
            Aucune session à venir pour le moment.
          </p>
          <ul v-else class="session-list">
            <li v-for="session in prochainesSessions" :key="session.id" class="session-item">
              <div class="session-date">
                <strong>{{ formatDate(session.debut) }}</strong>
                <span>{{ formatTime(session.debut) }} – {{ formatTime(session.fin) }}</span>
              </div>
              <div class="session-info">
                <strong>{{ session.titre }}</strong>
                <span>{{ session.promotion?.formation?.libelle ?? 'Campus Le Port' }}</span>
              </div>
            </li>
          </ul>
        </section>

        <section class="panel">
          <header class="panel-head">
            <h2>📝 Dernières notes</h2>
            <button type="button" class="link" @click="emit('navigate', 'notes')">
              Voir tout →
            </button>
          </header>
          <p v-if="!notes.length" class="empty">Aucune note publiée pour le moment.</p>
          <ul v-else class="note-list">
            <li v-for="note in notes.slice(0, 5)" :key="note.id" class="note-item">
              <div>
                <strong>{{ note.competence?.libelle ?? 'Évaluation' }}</strong>
                <span>{{ note.examen?.intitule ?? 'Examen' }} · {{ note.examen ? shortDate(note.examen.dateExamen) : '' }}</span>
              </div>
              <span class="grade" :class="gradeClass(note.valeur)">{{ note.valeur }}/20</span>
            </li>
          </ul>
        </section>
      </div>

      <section class="quick-actions">
        <h2>Accès rapides</h2>
        <div class="actions-grid">
          <button type="button" class="action" @click="emit('navigate', 'emploi-du-temps')">
            <span>📅</span> Emploi du temps
          </button>
          <button type="button" class="action" @click="emit('navigate', 'notes')">
            <span>📝</span> Toutes mes notes
          </button>
          <button type="button" class="action" @click="emit('navigate', 'progression')">
            <span>📈</span> Ma progression
          </button>
          <button type="button" class="action" @click="emit('navigate', 'absences')">
            <span>📋</span> Mes absences
          </button>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.welcome {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.75rem 2rem;
  border-radius: var(--radius-lg);
  color: #ffffff;
  background: linear-gradient(135deg, var(--exp-navy-950), var(--exp-navy-800));
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.welcome h1 {
  font-size: 1.7rem;
  font-weight: 900;
  margin-bottom: 0.35rem;
}

.welcome p {
  opacity: 0.85;
}

.muted {
  font-style: italic;
  opacity: 0.6;
}

.btn-ghost {
  flex-shrink: 0;
  padding: 0.7rem 1.1rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.16);
}

.loading {
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1.25rem;
  background: #ffffff;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.stat-icon {
  font-size: 1.6rem;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-md);
  background: var(--color-bg-inset);
}

.stat--blue .stat-icon { background: #e0edff; }
.stat--green .stat-icon { background: #dcfce7; }
.stat--orange .stat-icon { background: #ffedd5; }
.stat--purple .stat-icon { background: #ede9fe; }

.stat-value {
  display: block;
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--exp-navy-950);
  line-height: 1;
}

.stat-label {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.two-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.panel {
  background: #ffffff;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: 1.35rem;
  box-shadow: var(--shadow-sm);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid var(--color-border-subtle);
}

.panel-head h2 {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--exp-navy-900);
}

.link {
  border: 0;
  background: transparent;
  color: var(--exp-blue-dark);
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
}

.empty {
  padding: 1.25rem;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-bg-inset);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
}

.session-list,
.note-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.session-item,
.note-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-md);
  background: var(--color-bg-inset);
}

.session-date {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.session-date strong,
.session-info strong,
.note-item strong {
  font-size: 0.86rem;
  color: var(--exp-navy-950);
}

.session-date span,
.session-info span,
.note-item span {
  display: block;
  font-size: 0.76rem;
  color: var(--color-text-muted);
}

.session-info {
  flex: 1;
  text-align: right;
}

.grade {
  flex-shrink: 0;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 800;
}

.grade--excellent { background: #dcfce7; color: #047857; }
.grade--good { background: #e0edff; color: #1d4ed8; }
.grade--average { background: #ffedd5; color: #c2410c; }
.grade--weak { background: #fee2e2; color: #b91c1c; }

.quick-actions h2 {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--exp-navy-900);
  margin-bottom: 0.85rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.85rem;
}

.action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  padding: 1.15rem;
  background: #ffffff;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--exp-navy-900);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.action span {
  font-size: 1.5rem;
}

.action:hover {
  transform: translateY(-2px);
  border-color: var(--exp-orange-dark);
  color: var(--exp-orange-dark);
  box-shadow: var(--shadow-md);
}

@media (max-width: 700px) {
  .welcome {
    flex-direction: column;
    align-items: flex-start;
  }
  .session-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .session-info {
    text-align: left;
  }
}
</style>
