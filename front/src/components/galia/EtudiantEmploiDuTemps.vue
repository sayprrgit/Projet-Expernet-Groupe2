<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { apiService } from '@/services/api';
import type { Session } from '@/types/user';

const sessions = ref<Session[]>([]);
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

const upcoming = computed(() =>
  sessions.value.filter((s) => new Date(s.fin) >= new Date()),
);
const past = computed(() =>
  sessions.value.filter((s) => new Date(s.fin) < new Date()).reverse(),
);

onMounted(async () => {
  try {
    sessions.value = await apiService.getMonEmploiDuTemps();
  } catch {
    error.value = "Impossible de charger l'emploi du temps.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="page">
    <header class="page-head">
      <div>
        <span class="eyebrow">Galia · Étudiant</span>
        <h1>Mon emploi du temps</h1>
        <p>Retrouvez vos sessions de formation et vos prochains regroupements.</p>
      </div>
    </header>

    <div v-if="loading" class="state">Chargement…</div>
    <div v-else-if="error" class="state state--error">{{ error }}</div>
    <div v-else-if="!sessions.length" class="state">Aucune session planifiée.</div>

    <template v-else>
      <h2 class="section-title">À venir ({{ upcoming.length }})</h2>
      <p v-if="!upcoming.length" class="state">Aucune session à venir.</p>
      <ul v-else class="session-grid">
        <li v-for="session in upcoming" :key="session.id" class="session-card">
          <span class="badge">À venir</span>
          <h3>{{ session.titre }}</h3>
          <p class="date">{{ dateLabel(session.debut) }}</p>
          <p class="time">{{ timeLabel(session.debut) }} – {{ timeLabel(session.fin) }}</p>
          <p class="meta">{{ session.promotion?.formation?.libelle ?? 'Campus Le Port' }}</p>
        </li>
      </ul>

      <h2 class="section-title">Sessions passées ({{ past.length }})</h2>
      <ul class="session-grid session-grid--past">
        <li v-for="session in past" :key="session.id" class="session-card">
          <span class="badge badge--past">Terminée</span>
          <h3>{{ session.titre }}</h3>
          <p class="date">{{ dateLabel(session.debut) }}</p>
          <p class="time">{{ timeLabel(session.debut) }} – {{ timeLabel(session.fin) }}</p>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 0.5rem; }
.page-head { margin-bottom: 1rem; }
.eyebrow {
  font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--exp-orange-dark);
}
.page-head h1 { font-size: 1.6rem; font-weight: 900; color: var(--exp-navy-950); margin: 0.35rem 0; }
.page-head p { color: var(--color-text-muted); }
.section-title { margin: 1.25rem 0 0.75rem; font-size: 1.05rem; font-weight: 800; color: var(--exp-navy-900); }
.session-grid {
  list-style: none; display: grid; gap: 0.9rem;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
}
.session-card {
  position: relative; padding: 1.1rem; background: #fff;
  border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg);
  border-left: 4px solid var(--exp-blue); box-shadow: var(--shadow-sm);
}
.session-grid--past .session-card { border-left-color: var(--color-border-strong); opacity: 0.85; }
.session-card h3 { font-size: 0.98rem; font-weight: 800; color: var(--exp-navy-950); margin-bottom: 0.4rem; }
.date { font-size: 0.85rem; font-weight: 700; color: var(--exp-navy-900); text-transform: capitalize; }
.time { font-size: 0.82rem; color: var(--exp-blue-dark); font-weight: 600; }
.meta { margin-top: 0.4rem; font-size: 0.78rem; color: var(--color-text-muted); }
.badge {
  position: absolute; top: 0.9rem; right: 0.9rem; padding: 0.18rem 0.55rem;
  border-radius: var(--radius-full); background: #e0edff; color: #1d4ed8;
  font-size: 0.66rem; font-weight: 800; text-transform: uppercase;
}
.badge--past { background: var(--color-bg-inset); color: var(--color-text-muted); }
.state {
  padding: 1.5rem; text-align: center; border-radius: var(--radius-md);
  background: var(--color-bg-inset); color: var(--color-text-muted);
  border: 1px dashed var(--color-border-strong);
}
.state--error { color: #b91c1c; background: #fef2f2; border-color: #fecaca; }
</style>
