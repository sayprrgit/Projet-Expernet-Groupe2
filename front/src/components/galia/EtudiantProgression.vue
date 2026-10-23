<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiService } from '@/services/api';
import type { Progression, ProgressionCompetence } from '@/types/user';

const progression = ref<Progression | null>(null);
const loading = ref(true);
const error = ref('');

const niveauLabel: Record<string, string> = {
  ACQUIS: 'Acquis',
  EN_COURS: 'En cours',
  NON_ACQUIS: 'Non acquis',
};

const niveauClass = (niveau: ProgressionCompetence['niveau']) =>
  'niveau--' + niveau.toLowerCase().replace('_', '-');

const total = () => {
  if (!progression.value) return 0;
  const { acquis, enCours, nonAcquis } = progression.value;
  return acquis + enCours + nonAcquis;
};

const percent = (value: number) => (total() ? Math.round((value / total()) * 100) : 0);

onMounted(async () => {
  try {
    progression.value = await apiService.getMaProgression();
  } catch {
    error.value = 'Impossible de charger votre progression.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="page">
    <header class="page-head">
      <span class="eyebrow">Galia · Étudiant</span>
      <h1>Ma progression</h1>
      <p>Suivez l'acquisition des compétences de votre formation.</p>
    </header>

    <div v-if="loading" class="state">Chargement…</div>
    <div v-else-if="error" class="state state--error">{{ error }}</div>

    <template v-else-if="progression">
      <div class="cards">
        <article class="card card--green">
          <span class="card-value">{{ progression.acquis }}</span>
          <span class="card-label">Compétences acquises</span>
        </article>
        <article class="card card--orange">
          <span class="card-value">{{ progression.enCours }}</span>
          <span class="card-label">En cours d'acquisition</span>
        </article>
        <article class="card card--red">
          <span class="card-value">{{ progression.nonAcquis }}</span>
          <span class="card-label">Non acquises</span>
        </article>
        <article class="card card--blue">
          <span class="card-value">{{ progression.moyenne ?? '—' }}</span>
          <span class="card-label">Moyenne / 20</span>
        </article>
      </div>

      <div class="progress-bar" v-if="total()">
        <span class="bar bar--green" :style="{ width: percent(progression.acquis) + '%' }"></span>
        <span class="bar bar--orange" :style="{ width: percent(progression.enCours) + '%' }"></span>
        <span class="bar bar--red" :style="{ width: percent(progression.nonAcquis) + '%' }"></span>
      </div>

      <div v-if="!progression.competences.length" class="state">
        Aucune compétence évaluée pour le moment.
      </div>
      <ul v-else class="competences">
        <li v-for="competence in progression.competences" :key="competence.id" class="competence">
          <div class="competence-main">
            <span class="code">{{ competence.code }}</span>
            <div>
              <strong>{{ competence.libelle }}</strong>
              <small>{{ competence.examen ?? 'Évaluation' }}</small>
            </div>
          </div>
          <div class="competence-side">
            <span v-if="competence.valeur !== null" class="note">{{ competence.valeur }}/20</span>
            <span class="niveau" :class="niveauClass(competence.niveau)">
              {{ niveauLabel[competence.niveau] }}
            </span>
          </div>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1rem; }
.eyebrow { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--exp-orange); }
.page-head h1 { font-size: 1.6rem; font-weight: 900; color: var(--exp-navy-950); margin: 0.35rem 0; }
.page-head p { color: var(--color-text-muted); margin-bottom: 0.75rem; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.9rem; }
.card { display: flex; flex-direction: column; gap: 0.2rem; padding: 1.1rem 1.25rem; background: #fff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border-top: 4px solid var(--color-border-strong); }
.card--green { border-top-color: #10b981; }
.card--orange { border-top-color: #f59e0b; }
.card--red { border-top-color: #ef4444; }
.card--blue { border-top-color: #3b82f6; }
.card-value { font-size: 1.7rem; font-weight: 900; color: var(--exp-navy-950); line-height: 1; }
.card-label { font-size: 0.8rem; color: var(--color-text-muted); }
.progress-bar { display: flex; height: 12px; border-radius: var(--radius-full); overflow: hidden; background: var(--color-bg-inset); }
.bar { display: block; height: 100%; transition: width 0.4s ease; }
.bar--green { background: #10b981; }
.bar--orange { background: #f59e0b; }
.bar--red { background: #ef4444; }
.competences { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
.competence { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.9rem 1rem; background: #fff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); }
.competence-main { display: flex; align-items: center; gap: 0.9rem; }
.code { display: grid; place-items: center; min-width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--color-bg-inset); font-weight: 900; font-size: 0.8rem; color: var(--exp-navy-900); }
.competence-main strong { display: block; font-size: 0.9rem; color: var(--exp-navy-950); }
.competence-main small { font-size: 0.75rem; color: var(--color-text-muted); }
.competence-side { display: flex; align-items: center; gap: 0.6rem; flex-shrink: 0; }
.note { font-weight: 800; color: var(--exp-navy-950); font-size: 0.9rem; }
.niveau { padding: 0.22rem 0.6rem; border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 800; }
.niveau--acquis { background: #dcfce7; color: #047857; }
.niveau--en-cours { background: #ffedd5; color: #c2410c; }
.niveau--non-acquis { background: #fee2e2; color: #b91c1c; }
.state { padding: 1.5rem; text-align: center; border-radius: var(--radius-md); background: var(--color-bg-inset); color: var(--color-text-muted); border: 1px dashed var(--color-border-strong); }
.state--error { color: #b91c1c; background: #fef2f2; border-color: #fecaca; }
@media (max-width: 620px) { .competence { flex-direction: column; align-items: flex-start; } }
</style>
