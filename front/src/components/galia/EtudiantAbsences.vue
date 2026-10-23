<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiService } from '@/services/api';
import type { Absence, Assiduite } from '@/types/user';

const absences = ref<Absence[]>([]);
const assiduite = ref<Assiduite | null>(null);
const loading = ref(true);
const error = ref('');

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

onMounted(async () => {
  try {
    [absences.value, assiduite.value] = await Promise.all([
      apiService.getMesAbsences(),
      apiService.getMonAssiduite(),
    ]);
  } catch {
    error.value = 'Impossible de charger vos absences.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="page">
    <header class="page-head">
      <span class="eyebrow">Galia · Étudiant</span>
      <h1>Mes absences</h1>
      <p>Consultez votre assiduité et les sessions manquées.</p>
    </header>

    <div v-if="loading" class="state">Chargement…</div>
    <div v-else-if="error" class="state state--error">{{ error }}</div>

    <template v-else>
      <div v-if="assiduite" class="cards">
        <article class="card card--green">
          <span class="card-value">{{ assiduite.presences }}</span>
          <span class="card-label">Sessions suivies</span>
        </article>
        <article class="card card--red">
          <span class="card-value">{{ assiduite.absences }}</span>
          <span class="card-label">Absences</span>
        </article>
        <article class="card card--blue">
          <span class="card-value">
            {{ assiduite.tauxPresence !== null ? `${assiduite.tauxPresence}%` : '—' }}
          </span>
          <span class="card-label">Taux de présence</span>
        </article>
      </div>

      <div v-if="!absences.length" class="state">
        🎉 Aucune absence enregistrée. Continuez comme ça !
      </div>
      <ul v-else class="absences">
        <li v-for="absence in absences" :key="absence.id" class="absence">
          <div>
            <strong>{{ absence.session.titre }}</strong>
            <span>{{ dateLabel(absence.session.debut) }}</span>
            <span class="time">
              {{ timeLabel(absence.session.debut) }} – {{ timeLabel(absence.session.fin) }}
            </span>
          </div>
          <span class="badge" :class="absence.justifiee ? 'badge--ok' : 'badge--ko'">
            {{ absence.justifiee ? 'Justifiée' : 'Non justifiée' }}
          </span>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1rem; }
.eyebrow { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--exp-orange-dark); }
.page-head h1 { font-size: 1.6rem; font-weight: 900; color: var(--exp-navy-950); margin: 0.35rem 0; }
.page-head p { color: var(--color-text-muted); margin-bottom: 0.75rem; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.9rem; }
.card { display: flex; flex-direction: column; gap: 0.2rem; padding: 1.1rem 1.25rem; background: #fff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); border-top: 4px solid var(--color-border-strong); }
.card--green { border-top-color: #10b981; }
.card--red { border-top-color: #ef4444; }
.card--blue { border-top-color: #3b82f6; }
.card-value { font-size: 1.7rem; font-weight: 900; color: var(--exp-navy-950); line-height: 1; }
.card-label { font-size: 0.8rem; color: var(--color-text-muted); }
.absences { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
.absence { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.9rem 1rem; background: #fff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); border-left: 4px solid #ef4444; }
.absence strong { display: block; font-size: 0.9rem; color: var(--exp-navy-950); }
.absence span { display: block; font-size: 0.78rem; color: var(--color-text-muted); text-transform: capitalize; }
.absence .time { color: var(--exp-blue-dark); font-weight: 600; }
.badge { padding: 0.25rem 0.65rem; border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 800; white-space: nowrap; }
.badge--ok { background: #dcfce7; color: #047857; }
.badge--ko { background: #fee2e2; color: #b91c1c; }
.state { padding: 1.5rem; text-align: center; border-radius: var(--radius-md); background: var(--color-bg-inset); color: var(--color-text-muted); border: 1px dashed var(--color-border-strong); }
.state--error { color: #b91c1c; background: #fef2f2; border-color: #fecaca; }
</style>
