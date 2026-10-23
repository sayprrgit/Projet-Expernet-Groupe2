<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Formation, FormationFilters } from '@/types/formation';
import { apiService } from '@/services/api';
import { IMAGES } from '@/data/images';
import SeoMeta from '@/components/SeoMeta.vue';
import PageHero from '@/components/PageHero.vue';
import BaseButton from '@/components/BaseButton.vue';
import SearchAndFilters from '@/components/SearchAndFilters.vue';
import FormationCard from '@/components/FormationCard.vue';
import FormationModal from '@/components/FormationModal.vue';

const route = useRoute();
const router = useRouter();

const ALLOWED_TYPES = ['all', 'campus', 'pro'];

const typeFromQuery = computed(() => {
  const value = String(route.query.type ?? 'all');
  return ALLOWED_TYPES.includes(value) ? value : 'all';
});

const filters = reactive<FormationFilters>({
  search: '',
  category: 'all',
  level: 'all',
  type: typeFromQuery.value,
  cpfOnly: false,
  campus: 'all',
});

const formations = ref<Formation[]>([]);
const totalAll = ref(0);
const isLoading = ref(true);
const selectedFormation = ref<Formation | null>(null);

const CATEGORY_LABELS: Record<string, string> = {
  dev: 'Développement web & logiciel',
  reseaux: 'Systèmes, réseaux & cybersécurité',
  marketing: 'Marketing digital & communication',
  management: 'Management IT',
  data: 'Data & intelligence artificielle',
};

const TYPE_LABELS: Record<string, string> = {
  campus: 'Alternance Campus',
  pro: 'Expernet Pro',
};

const fetchFormations = async () => {
  isLoading.value = true;
  try {
    const res = await apiService.getFormations(filters);
    formations.value = res.data;
  } finally {
    isLoading.value = false;
  }
};

const fetchTotal = async () => {
  const res = await apiService.getFormations();
  totalAll.value = res.total;
};

const resetFilters = () => {
  filters.search = '';
  filters.category = 'all';
  filters.level = 'all';
  filters.type = 'all';
  filters.cpfOnly = false;
  filters.campus = 'all';
  if (route.query.type) {
    router.replace({ query: {} });
  }
};

const openDetails = (formation: Formation) => {
  selectedFormation.value = formation;
};

const closeDetails = () => {
  selectedFormation.value = null;
};

const handleApply = (formation: Formation) => {
  closeDetails();
  router.push({ name: 'candidature', query: { formation: formation.id } });
};

const hasActiveFilters = computed(
  () =>
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.level !== 'all' ||
    filters.type !== 'all' ||
    filters.cpfOnly ||
    filters.campus !== 'all',
);

watch(filters, fetchFormations, { deep: true });

watch(typeFromQuery, (next) => {
  if (filters.type !== next) {
    filters.type = next;
  }
});

onMounted(async () => {
  await Promise.all([fetchTotal(), fetchFormations()]);
});
</script>

<template>
  <div>
    <SeoMeta
      title="Toutes les formations | Expernet & Expernet Campus La Réunion"
      description="Catalogue complet des formations Expernet : BTS SIO, Bachelors et Mastères en alternance, certifications professionnelles éligibles CPF à La Réunion."
      :total-formations="formations.length"
    />

    <PageHero
      eyebrow="Catalogue 2026-2027"
      title="Toutes nos formations à La Réunion"
      description="Formations certifiantes d’Expernet Campus (alternance Bac+2 à Bac+5) et d’Expernet Pro (CPF, salariés et entreprises). Filtrez par filière, niveau, campus ou financement."
      accent="orange"
      :image="IMAGES.heroFormations"
      image-alt="Les cursus informatique et marketing digital du Campus"
    >
      <template #actions>
        <BaseButton to="/planning" variant="outline" size="lg">Voir le planning des sessions</BaseButton>
      </template>
    </PageHero>

    <section class="catalogue-section" aria-labelledby="catalogue-title">
      <div class="container">
        <h2 id="catalogue-title" class="sr-only">Catalogue des formations</h2>

        <SearchAndFilters
          :filters="filters"
          :total-results="formations.length"
          :total-all="totalAll || formations.length"
          @update:filters="Object.assign(filters, $event)"
          @reset="resetFilters"
        />

        <div v-if="hasActiveFilters" class="active-filters-bar" aria-label="Filtres actuellement appliqués">
          <span class="active-label">Filtres actifs :</span>
          <button v-if="filters.search" class="active-tag" @click="filters.search = ''">
            Recherche : "{{ filters.search }}" ✕
          </button>
          <button v-if="filters.type !== 'all'" class="active-tag active-tag--type" @click="filters.type = 'all'">
            {{ TYPE_LABELS[filters.type] || filters.type }} ✕
          </button>
          <button v-if="filters.category !== 'all'" class="active-tag" @click="filters.category = 'all'">
            {{ CATEGORY_LABELS[filters.category] || filters.category }} ✕
          </button>
          <button v-if="filters.level !== 'all'" class="active-tag" @click="filters.level = 'all'">
            Niveau {{ filters.level }} ✕
          </button>
          <button v-if="filters.campus !== 'all'" class="active-tag" @click="filters.campus = 'all'">
            {{ filters.campus }} ✕
          </button>
          <button v-if="filters.cpfOnly" class="active-tag active-tag--cpf" @click="filters.cpfOnly = false">
            Éligible CPF uniquement ✕
          </button>
        </div>

        <div v-if="isLoading" class="loading-state" aria-live="polite">
          <div class="loading-spinner" aria-hidden="true"></div>
          <p>Chargement des formations...</p>
        </div>

        <div v-else-if="formations.length > 0" class="formations-grid">
          <FormationCard
            v-for="formation in formations"
            :key="formation.id"
            :formation="formation"
            @view-details="openDetails"
            @apply="handleApply"
          />
        </div>

        <div v-else class="no-results-state" role="status">
          <div class="no-results-icon">🔍</div>
          <h3>Aucune formation ne correspond à vos critères</h3>
          <p>Modifiez votre recherche ou réinitialisez les filtres pour afficher l’ensemble du catalogue.</p>
          <BaseButton variant="primary" @click="resetFilters">Afficher toutes les formations</BaseButton>
        </div>

        <div class="catalogue-badges">
          <img :src="IMAGES.rncp" alt="Titres RNCP" loading="lazy" />
          <span>Formations certifiées RNCP, dispensées dans un centre de formation Qualiopi.</span>
        </div>

        <figure class="catalogue-band">
          <img :src="IMAGES.catalogueBand" alt="Une formation Expernet en situation" loading="lazy" decoding="async" />
          <figcaption>Des sessions en petit effectif, animées par des formateurs issus du terrain.</figcaption>
        </figure>
      </div>
    </section>

    <FormationModal
      :formation="selectedFormation"
      @close="closeDetails"
      @apply="handleApply"
    />
  </div>
</template>

<style scoped>
.catalogue-badges {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-top: 2.5rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
}

.catalogue-badges img {
  height: 46px;
  width: auto;
  object-fit: contain;
}

.catalogue-badges span {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.catalogue-band {
  position: relative;
  margin: 1.5rem 0 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.catalogue-band img {
  display: block;
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.catalogue-band figcaption {
  position: absolute;
  inset: auto 0 0 0;
  padding: 1.1rem 1.4rem;
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(180deg, rgba(11, 26, 45, 0) 0%, rgba(11, 26, 45, 0.92) 65%);
}

.catalogue-section {
  padding: 2.5rem 0 4.5rem;
  background: var(--color-bg-page);
}

.active-filters-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  margin-bottom: 1.75rem;
}

.active-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.active-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  background: var(--exp-navy-900);
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.active-tag:hover {
  background: var(--exp-orange);
}

.active-tag--type {
  background: var(--exp-orange);
}

.active-tag--cpf {
  background: var(--exp-blue);
}

.formations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.75rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 1rem;
  color: var(--color-text-muted);
}

.loading-spinner {
  width: 42px;
  height: 42px;
  border: 4px solid var(--color-border-subtle);
  border-top-color: var(--exp-orange);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-results-state {
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: 3.5rem 2rem;
  text-align: center;
  border: 1.5px dashed var(--color-border-strong);
  max-width: 600px;
  margin: 2rem auto;
}

.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.no-results-state h3 {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--exp-navy-950);
  margin-bottom: 0.5rem;
}

.no-results-state p {
  font-size: 0.95rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

@media (max-width: 520px) {
  .formations-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
