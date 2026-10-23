<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Formation } from '@/types/formation';
import { apiService } from '@/services/api';
import { UNIVERS } from '@/data/univers';
import { CAMPUS_HISTORY } from '@/data/bureau';
import { IMAGES } from '@/data/images';
import { PLANNING_ENTRIES } from '@/data/planning';
import SeoMeta from '@/components/SeoMeta.vue';
import HeroSection from '@/components/HeroSection.vue';
import UniversCard from '@/components/UniversCard.vue';
import FormationCard from '@/components/FormationCard.vue';
import FormationModal from '@/components/FormationModal.vue';
import BaseButton from '@/components/BaseButton.vue';

const router = useRouter();

const formations = ref<Formation[]>([]);
const selectedFormation = ref<Formation | null>(null);
const isLoading = ref(true);

const featured = computed(() => formations.value.slice(0, 6));

const today = new Date();
today.setHours(0, 0, 0, 0);

const upcoming = computed(() =>
  PLANNING_ENTRIES.filter((entry) => new Date(`${entry.date}T00:00:00`) >= today).slice(0, 3),
);

const historyTeaser = CAMPUS_HISTORY.slice(0, 3);

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(`${iso}T00:00:00`),
  );

const goToFormations = (type: string) => {
  router.push({ name: 'formations', query: type === 'all' ? {} : { type } });
};

const handleApply = (formation: Formation) => {
  selectedFormation.value = null;
  router.push({ name: 'candidature', query: { formation: formation.id } });
};

onMounted(async () => {
  try {
    const res = await apiService.getFormations();
    formations.value = res.data;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="home-page">
    <SeoMeta :total-formations="formations.length" />

    <HeroSection active-type="all" @select-type="goToFormations" />

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Un portail, quatre univers</span>
          <h2 class="section-title">Tout l’écosystème Expernet au même endroit</h2>
          <p class="section-desc">
            Formations en alternance, formation continue, espace apprenant et espace collaboratif : choisissez
            l’univers qui correspond à votre projet.
          </p>
        </div>

        <div class="grid grid--4">
          <UniversCard v-for="univers in UNIVERS" :key="univers.id" :univers="univers" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <figure class="campus-band">
          <img :src="IMAGES.homeBand" alt="La vie du campus Expernet" loading="lazy" decoding="async" />
          <figcaption>
            Alternance, projets tutorés et événements de campus : découvrez le quotidien des apprenants Expernet.
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Catalogue</span>
          <h2 class="section-title">Formations à la une</h2>
          <p class="section-desc">
            Un aperçu des parcours les plus demandés, en alternance comme en formation continue.
          </p>
        </div>

        <div v-if="isLoading" class="loading">Chargement des formations…</div>
        <div v-else class="formations-grid">
          <FormationCard
            v-for="formation in featured"
            :key="formation.id"
            :formation="formation"
            @view-details="selectedFormation = $event"
            @apply="handleApply"
          />
        </div>

        <div class="section-actions">
          <BaseButton to="/formations" size="lg">Voir toutes les formations</BaseButton>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div class="split__content">
          <span class="eyebrow">Notre histoire</span>
          <h2 class="section-title">Un acteur engagé pour le territoire depuis 2002</h2>
          <p class="section-desc">
            D’un organisme de formation spécialisé à un campus de référence en alternance, Expernet accompagne
            les talents tech et digitaux de La Réunion et de Mayotte.
          </p>
          <ul class="mini-timeline">
            <li v-for="event in historyTeaser" :key="event.year">
              <span class="mini-year">{{ event.year }}</span>
              <div>
                <strong>{{ event.title }}</strong>
                <p>{{ event.description }}</p>
              </div>
            </li>
          </ul>
          <div class="section-actions">
            <BaseButton to="/a-propos" variant="outline">Notre histoire &amp; notre équipe</BaseButton>
          </div>
        </div>

        <aside class="stats-card">
          <figure class="stats-photo">
            <img :src="IMAGES.homeCampusPhoto" alt="Un centre de formation Expernet" loading="lazy" />
          </figure>
          <h3>Le Campus en chiffres</h3>
          <ul>
            <li><strong>2002</strong><span>Création d’Expernet</span></li>
            <li><strong>2017</strong><span>Ouverture du Campus</span></li>
            <li><strong>Bac+2 → Bac+5</strong><span>Diplômes &amp; titres RNCP</span></li>
            <li><strong>3</strong><span>Sites à La Réunion</span></li>
            <li><strong>250+</strong><span>Entreprises partenaires</span></li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Agenda</span>
          <h2 class="section-title">Les prochains rendez-vous</h2>
          <p class="section-desc">
            Rentrées, sessions professionnelles, ateliers et journées portes ouvertes : ne manquez aucune date.
          </p>
        </div>

        <ul class="upcoming">
          <li v-for="entry in upcoming" :key="entry.id" class="upcoming-item">
            <span class="upcoming-date">{{ formatDate(entry.date) }}</span>
            <div class="upcoming-body">
              <h3>{{ entry.title }}</h3>
              <p>{{ entry.site }} · {{ entry.description }}</p>
            </div>
            <RouterLink v-if="entry.link" :to="entry.link.to" class="upcoming-link">
              {{ entry.link.label }} →
            </RouterLink>
          </li>
        </ul>

        <div class="section-actions">
          <BaseButton to="/planning" variant="outline">Consulter tout le planning</BaseButton>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container cta-band__inner">
        <div>
          <h2>Prêt à écrire la suite avec nous ?</h2>
          <p>Déposez votre candidature en ligne : un conseiller vous accompagne sous 48 h.</p>
        </div>
        <BaseButton to="/candidature" size="lg">Candidater</BaseButton>
      </div>
    </section>

    <FormationModal
      :formation="selectedFormation"
      @close="selectedFormation = null"
      @apply="handleApply"
    />
  </div>
</template>

<style scoped>
.formations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.loading {
  padding: 2rem 0;
  color: var(--color-text-muted);
}

.section-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 2rem;
}

.split {
  display: grid;
  grid-template-columns: 1.35fr 0.85fr;
  gap: 3rem;
  align-items: start;
}

.mini-timeline {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin-top: 1.5rem;
}

.mini-timeline li {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.mini-year {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-full);
  background: var(--exp-orange-subtle);
  color: var(--exp-orange-dark);
  font-size: 0.82rem;
  font-weight: 900;
}

.mini-timeline strong {
  display: block;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.mini-timeline p {
  font-size: 0.88rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.stats-card {
  padding: 1.85rem;
  background: var(--exp-navy-950);
  color: #ffffff;
  border-radius: var(--radius-lg);
  border-top: 4px solid var(--exp-orange);
  box-shadow: var(--shadow-lg);
}

.campus-band {
  position: relative;
  margin: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.campus-band img {
  display: block;
  width: 100%;
  height: 320px;
  object-fit: cover;
}

.campus-band figcaption {
  position: absolute;
  inset: auto 0 0 0;
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(180deg, rgba(11, 26, 45, 0) 0%, rgba(11, 26, 45, 0.92) 65%);
}

.stats-photo {
  margin: 0 0 1.35rem;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.stats-photo img {
  display: block;
  width: 100%;
  height: 190px;
  object-fit: cover;
}

.stats-card h3 {
  margin-bottom: 1.1rem;
  font-size: 1.05rem;
  font-weight: 900;
}

.stats-card ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.stats-card li {
  display: flex;
  flex-direction: column;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-card li:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.stats-card strong {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--exp-orange);
}

.stats-card span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.72);
}

.upcoming {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.upcoming-item {
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr) auto;
  gap: 1.25rem;
  align-items: center;
  padding: 1.2rem 1.4rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-left: 4px solid var(--exp-orange);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.upcoming-date {
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--exp-navy-950);
  text-transform: capitalize;
}

.upcoming-body h3 {
  margin-bottom: 0.2rem;
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.upcoming-body p {
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--color-text-muted);
}

.upcoming-link {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--exp-orange-dark);
  white-space: nowrap;
}

.upcoming-link:hover {
  color: var(--exp-blue-dark);
}

@media (max-width: 1024px) {
  .split {
    grid-template-columns: minmax(0, 1fr);
  }

  .upcoming-item {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.5rem;
  }
}

@media (max-width: 560px) {
  .formations-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
