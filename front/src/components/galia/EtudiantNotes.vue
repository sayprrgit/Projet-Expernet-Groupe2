<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { apiService } from '@/services/api';
import type { Note } from '@/types/user';

const notes = ref<Note[]>([]);
const loading = ref(true);
const error = ref('');

const moyenne = computed(() => {
  if (!notes.value.length) return null;
  const sum = notes.value.reduce((acc, n) => acc + n.valeur, 0);
  return Math.round((sum / notes.value.length) * 10) / 10;
});

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const gradeClass = (valeur: number) => {
  if (valeur >= 16) return 'grade--excellent';
  if (valeur >= 12) return 'grade--good';
  if (valeur >= 10) return 'grade--average';
  return 'grade--weak';
};

onMounted(async () => {
  try {
    notes.value = await apiService.getMesNotes();
  } catch {
    error.value = 'Impossible de charger vos notes.';
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
        <h1>Mes notes</h1>
        <p>Vos évaluations par compétence et les appréciations de vos formateurs.</p>
      </div>
      <div v-if="moyenne !== null" class="moyenne-card">
        <span>Moyenne</span>
        <strong>{{ moyenne }}<small>/20</small></strong>
      </div>
    </header>

    <div v-if="loading" class="state">Chargement…</div>
    <div v-else-if="error" class="state state--error">{{ error }}</div>
    <div v-else-if="!notes.length" class="state">Aucune note publiée pour le moment.</div>

    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Compétence</th>
            <th>Examen</th>
            <th>Date</th>
            <th>Niveau</th>
            <th>Note</th>
            <th>Appréciation</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="note in notes" :key="note.id">
            <td><strong>{{ note.competence?.libelle }}</strong><br><small>{{ note.competence?.code }}</small></td>
            <td>{{ note.examen?.intitule }}</td>
            <td>{{ note.examen ? shortDate(note.examen.dateExamen) : '—' }}</td>
            <td>
              <span class="niveau" :class="'niveau--' + note.niveau.toLowerCase().replace('_', '-')">
                {{ note.niveau.replace('_', ' ') }}
              </span>
            </td>
            <td><span class="grade" :class="gradeClass(note.valeur)">{{ note.valeur }}/20</span></td>
            <td class="appreciation">{{ note.appreciation || '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 1rem; }
.page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.eyebrow { font-size: 0.72rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--exp-orange); }
.page-head h1 { font-size: 1.6rem; font-weight: 900; color: var(--exp-navy-950); margin: 0.35rem 0; }
.page-head p { color: var(--color-text-muted); }
.moyenne-card {
  display: flex; flex-direction: column; align-items: center; gap: 0.1rem;
  padding: 0.85rem 1.4rem; background: #fff; border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); flex-shrink: 0;
}
.moyenne-card span { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); }
.moyenne-card strong { font-size: 1.6rem; font-weight: 900; color: var(--exp-navy-950); }
.moyenne-card small { font-size: 0.8rem; color: var(--color-text-muted); }
.table-wrapper { overflow-x: auto; background: #fff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); }
table { width: 100%; border-collapse: collapse; font-size: 0.88rem; min-width: 760px; }
th, td { padding: 0.8rem 1rem; text-align: left; border-bottom: 1px solid var(--color-border-subtle); vertical-align: top; }
th { background: var(--color-bg-inset); font-weight: 800; color: var(--exp-navy-900); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.03em; }
td small { color: var(--color-text-muted); }
.appreciation { color: var(--color-text-muted); max-width: 240px; }
.grade { padding: 0.2rem 0.6rem; border-radius: var(--radius-full); font-weight: 800; white-space: nowrap; }
.grade--excellent { background: #dcfce7; color: #047857; }
.grade--good { background: #e0edff; color: #1d4ed8; }
.grade--average { background: #ffedd5; color: #c2410c; }
.grade--weak { background: #fee2e2; color: #b91c1c; }
.niveau { padding: 0.18rem 0.5rem; border-radius: var(--radius-full); font-size: 0.7rem; font-weight: 800; white-space: nowrap; }
.niveau--acquis { background: #dcfce7; color: #047857; }
.niveau--en-cours { background: #ffedd5; color: #c2410c; }
.niveau--non-acquis { background: #fee2e2; color: #b91c1c; }
.state { padding: 1.5rem; text-align: center; border-radius: var(--radius-md); background: var(--color-bg-inset); color: var(--color-text-muted); border: 1px dashed var(--color-border-strong); }
.state--error { color: #b91c1c; background: #fef2f2; border-color: #fecaca; }
@media (max-width: 640px) { .page-head { flex-direction: column; } }
</style>
