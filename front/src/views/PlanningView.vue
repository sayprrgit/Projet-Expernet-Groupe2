<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  PLANNING_ENTRIES,
  PLANNING_KIND_LABELS,
  PLANNING_SITES,
  type PlanningEntry,
  type PlanningKind,
} from '@/data/planning';
import { IMAGES } from '@/data/images';
import SeoMeta from '@/components/SeoMeta.vue';
import PageHero from '@/components/PageHero.vue';
import BaseButton from '@/components/BaseButton.vue';

type KindFilter = 'all' | PlanningKind;

const KIND_FILTERS: { value: KindFilter; label: string }[] = [
  { value: 'all', label: 'Tout le planning' },
  { value: 'formation', label: 'Formations' },
  { value: 'evenement', label: 'Événements' },
  { value: 'atelier', label: 'Ateliers' },
  { value: 'examen', label: 'Examens' },
];

const kindFilter = ref<KindFilter>('all');
const DEFAULT_SITE = 'Tous les sites';
const siteFilter = ref<string>(DEFAULT_SITE);

const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const parseDate = (value: string) => new Date(`${value}T00:00:00`);

const filteredEntries = computed(() =>
  PLANNING_ENTRIES.filter((entry) => {
    const kindMatches = kindFilter.value === 'all' || entry.kind === kindFilter.value;
    const siteMatches =
      siteFilter.value === DEFAULT_SITE ||
      entry.site.toLowerCase().includes(siteFilter.value.toLowerCase());
    return kindMatches && siteMatches;
  }),
);

const monthLabel = (date: string) => {
  const label = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(parseDate(date));
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const dayLabel = (entry: PlanningEntry) => {
  const start = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(
    parseDate(entry.date),
  );
  if (!entry.endDate) return start;
  const end = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(
    parseDate(entry.endDate),
  );
  return `${start} → ${end}`;
};

const groupedEntries = computed(() => {
  const groups = new Map<string, PlanningEntry[]>();
  for (const entry of filteredEntries.value) {
    const key = monthLabel(entry.date);
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }
  return [...groups.entries()].map(([label, entries]) => ({ label, entries }));
});

const nextEntry = computed(() => {
  const today = startOfToday();
  return (
    PLANNING_ENTRIES.find((entry) => parseDate(entry.date) >= today) ??
    PLANNING_ENTRIES[PLANNING_ENTRIES.length - 1] ??
    null
  );
});

const resetFilters = () => {
  kindFilter.value = 'all';
  siteFilter.value = DEFAULT_SITE;
};
</script>

<template>
  <div>
    <SeoMeta
      title="Planning des formations & événements | Expernet Réunion"
      description="Calendrier des rentrées, sessions Expernet Pro, journées portes ouvertes, ateliers et examens à La Réunion."
    />

    <PageHero
      eyebrow="Agenda 2026-2027"
      title="Planning des formations &amp; activités"
      description="Rentrées, sessions professionnelles, ateliers, journées portes ouvertes et examens : retrouvez toutes les dates de l’année sur nos trois sites réunionnais."
      accent="blue"
      :image="IMAGES.heroPlanning"
      image-alt="La vie du campus Expernet"
    >
      <template #actions>
        <BaseButton to="/formations" size="lg">Explorer le catalogue</BaseButton>
        <BaseButton to="/candidature" variant="outline" size="lg">S’inscrire à une session</BaseButton>
      </template>
    </PageHero>

    <section class="section--tight">
      <div class="container">
        <div v-if="nextEntry" class="next-card">
  <div class="accent-blue">
            <span class="next-eyebrow">Prochain rendez-vous</span>
            <h2>{{ nextEntry.title }}</h2>
            <p>
              {{ dayLabel(nextEntry) }}<span v-if="nextEntry.time"> · {{ nextEntry.time }}</span> ·
              {{ nextEntry.site }}
            </p>
          </div>
          <BaseButton v-if="nextEntry.link" :to="nextEntry.link.to" variant="primary">
            {{ nextEntry.link.label }}
          </BaseButton>
        </div>
      </div>
    </section>

    <section class="planning-section">
      <div class="container">
        <div class="filters">
          <div class="filter-group" role="group" aria-label="Filtrer par type">
            <button
              v-for="kind in KIND_FILTERS"
              :key="kind.value"
              type="button"
              class="filter-chip"
              :class="{ 'filter-chip--active': kindFilter === kind.value }"
              :aria-pressed="kindFilter === kind.value"
              @click="kindFilter = kind.value"
            >
              {{ kind.label }}
            </button>
          </div>

          <label class="site-filter">
            <span class="sr-only">Filtrer par site</span>
            <select v-model="siteFilter">
              <option v-for="site in PLANNING_SITES" :key="site" :value="site">{{ site }}</option>
            </select>
          </label>
        </div>

        <div class="results-line">
          <p>{{ filteredEntries.length }} rendez-vous affiché{{ filteredEntries.length > 1 ? 's' : '' }}</p>
          <button
            v-if="kindFilter !== 'all' || siteFilter !== DEFAULT_SITE"
            type="button"
            class="reset-link"
            @click="resetFilters"
          >
            Réinitialiser les filtres
          </button>
        </div>

        <div v-if="groupedEntries.length" class="timeline">
          <section v-for="group in groupedEntries" :key="group.label" class="month-group">
            <h2 class="month-title">{{ group.label }}</h2>
            <ul class="entry-list">
              <li v-for="entry in group.entries" :key="entry.id" class="entry" :class="`entry--${entry.kind}`">
                <div class="entry-date">
                  <span class="entry-day">{{ dayLabel(entry) }}</span>
                  <span v-if="entry.time" class="entry-time">{{ entry.time }}</span>
                </div>
                <div class="entry-body">
                  <div class="entry-head">
                    <span class="entry-kind">{{ PLANNING_KIND_LABELS[entry.kind] }}</span>
                    <span class="entry-site">📍 {{ entry.site }}</span>
                  </div>
                  <h3>{{ entry.title }}</h3>
                  <p>{{ entry.description }}</p>
                  <RouterLink v-if="entry.link" :to="entry.link.to" class="entry-link">
                    {{ entry.link.label }} →
                  </RouterLink>
                </div>
              </li>
            </ul>
          </section>
        </div>

        <div v-else class="empty">
          <p>Aucun rendez-vous ne correspond à ces filtres.</p>
          <BaseButton variant="secondary" @click="resetFilters">Afficher tout le planning</BaseButton>
        </div>

        <figure class="planning-band">
          <img :src="IMAGES.planningBand" alt="Les temps forts du campus" loading="lazy" decoding="async" />
          <figcaption>Portes ouvertes, sessions professionnelles et examens : tout l’agenda de l’année en un coup d’œil.</figcaption>
        </figure>
      </div>
    </section>
  </div>
</template>

<style scoped>
.next-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.75rem 2rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--exp-navy-950) 0%, var(--exp-navy-800) 100%);
  color: #ffffff;
  box-shadow: var(--shadow-lg);
  border-left: 5px solid var(--exp-orange);
}

.next-eyebrow {
  display: inline-block;
  margin-bottom: 0.4rem;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--exp-orange);
}

.next-card h2 {
  font-size: clamp(1.2rem, 2.4vw, 1.6rem);
  font-weight: 900;
}

.next-card p {
  margin-top: 0.3rem;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.78);
}

.planning-band {
  position: relative;
  margin: 2.5rem 0 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.planning-band img {
  display: block;
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.planning-band figcaption {
  position: absolute;
  inset: auto 0 0 0;
  padding: 1.1rem 1.4rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(180deg, rgba(11, 26, 45, 0) 0%, rgba(11, 26, 45, 0.92) 65%);
}

.planning-section {
  padding: 2.5rem 0 4.5rem;
  background: var(--color-bg-page);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-chip {
  padding: 0.45rem 0.95rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border-subtle);
  background: var(--color-bg-inset);
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-chip:hover {
  border-color: var(--exp-blue);
  color: var(--exp-blue-dark);
}

.filter-chip--active {
  background: var(--exp-navy-900);
  border-color: var(--exp-navy-900);
  color: #ffffff;
}

.site-filter select {
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-strong);
  background: #ffffff;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-text-main);
  cursor: pointer;
}

.results-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin: 1.25rem 0 2rem;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.reset-link {
  border: none;
  background: none;
  color: var(--exp-blue-dark);
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  text-decoration: underline;
}

.month-group {
  margin-bottom: 2.5rem;
}

.month-title {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border-subtle);
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--exp-navy-950);
}

.entry-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.entry {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 1.25rem;
  padding: 1.25rem 1.4rem;
  background: #ffffff;
  border: 1px solid var(--color-border-subtle);
  border-left: 4px solid var(--entry-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.entry--formation {
  --entry-color: #45a1c3;
}

.entry--evenement {
  --entry-color: #10b981;
}

.entry--atelier {
  --entry-color: #f28c05;
}

.entry--examen {
  --entry-color: #6264a7;
}

.entry-date {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.entry-day {
  font-size: 0.92rem;
  font-weight: 900;
  color: var(--color-text-main);
  text-transform: capitalize;
}

.entry-time {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.entry-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.35rem;
}

.entry-kind {
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--entry-color) 16%, transparent);
  color: var(--entry-color);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.entry-site {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-light);
}

.entry-body h3 {
  margin-bottom: 0.25rem;
  font-size: 1.02rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.entry-body p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.entry-link {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--exp-blue-dark);
}

.entry-link:hover {
  color: var(--exp-orange-dark);
}

.empty {
  padding: 3rem 1.5rem;
  text-align: center;
  border: 1.5px dashed var(--color-border-strong);
  border-radius: var(--radius-lg);
  background: #ffffff;
}

.empty p {
  margin-bottom: 1.25rem;
  color: var(--color-text-muted);
}

@media (max-width: 680px) {
  .entry {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.6rem;
  }

  .next-card {
    padding: 1.4rem;
  }
}
</style>
