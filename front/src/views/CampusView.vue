<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Formation } from '@/types/formation';
import { apiService } from '@/services/api';
import { PARTNERS } from '@/data/bureau';
import { IMAGES } from '@/data/images';
import SeoMeta from '@/components/SeoMeta.vue';
import PageHero from '@/components/PageHero.vue';
import BaseButton from '@/components/BaseButton.vue';
import FormationCard from '@/components/FormationCard.vue';
import FormationModal from '@/components/FormationModal.vue';
import PartnerLogos from '@/components/PartnerLogos.vue';

const router = useRouter();
const formations = ref<Formation[]>([]);
const selectedFormation = ref<Formation | null>(null);
const isLoading = ref(true);

const STEPS = [
  {
    step: '1',
    title: 'Je candidate',
    text: 'Déposez votre dossier en ligne en quelques minutes : parcours, projet et campus souhaité.',
  },
  {
    step: '2',
    title: 'Je passe un entretien',
    text: 'Un conseiller valide votre projet et vous accompagne dans la recherche d’une entreprise.',
  },
  {
    step: '3',
    title: 'Je signe mon contrat',
    text: 'Contrat d’apprentissage signé avec l’entreprise partenaire, 100 % financé par l’OPCO.',
  },
  {
    step: '4',
    title: 'Je démarre ma formation',
    text: 'Alternance rythmée entre le Campus et l’entreprise, avec un tuteur pédagogique dédié.',
  },
];

const FACTS = [
  { value: 'Bac+2 → Bac+5', label: 'Diplômes & titres RNCP' },
  { value: '0 €', label: 'Frais de scolarité en alternance' },
  { value: '250+', label: 'Entreprises partenaires' },
  { value: '92 %', label: 'Insertion sous 6 mois' },
];

const loadFormations = async () => {
  isLoading.value = true;
  try {
    const res = await apiService.getFormations({ type: 'campus' });
    formations.value = res.data.slice(0, 6);
  } finally {
    isLoading.value = false;
  }
};

const handleApply = (formation: Formation) => {
  selectedFormation.value = null;
  router.push({ name: 'candidature', query: { formation: formation.id } });
};

onMounted(loadFormations);
</script>

<template>
  <div class="accent-orange">
    <SeoMeta
      title="Expernet Campus | Formations en alternance Bac+2 à Bac+5 à La Réunion"
      description="Expernet Campus : BTS SIO, Bachelors et Mastères en alternance à La Réunion et à Mayotte. Diplômes d’État et titres RNCP, 0 € de frais, 250+ entreprises partenaires."
    />

    <PageHero
      eyebrow="Expernet Campus"
      title="L’alternance qui forme les talents tech de La Réunion"
      description="Du Bac+2 au Bac+5, nos cursus allient enseignement technique exigeant et immersion rémunérée en entreprise. Un modèle 100 % financé, avec un accompagnement individualisé jusqu’à l’insertion."
      accent="orange"
      :image="IMAGES.heroCampus"
      image-alt="Les cursus du Campus Expernet"
    >
      <template #actions>
        <BaseButton to="/formations?type=campus" size="lg">Voir les formations Campus</BaseButton>
        <BaseButton to="/planning" variant="outline" size="lg">Prochaines sessions</BaseButton>
      </template>
    </PageHero>

    <section class="section">
      <div class="container">
        <ul class="facts-grid">
          <li v-for="fact in FACTS" :key="fact.label" class="fact-card">
            <strong>{{ fact.value }}</strong>
            <span>{{ fact.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Parcours d’admission</span>
          <h2 class="section-title">De la candidature à la rentrée, en 4 étapes</h2>
          <p class="section-desc">
            Un accompagnement de bout en bout pour sécuriser votre entrée en alternance et votre contrat.
          </p>
        </div>

        <ol class="steps-grid">
          <li v-for="item in STEPS" :key="item.step" class="step-card">
            <span class="step-number" aria-hidden="true">{{ item.step }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Catalogue Campus</span>
          <h2 class="section-title">Nos formations en alternance</h2>
          <p class="section-desc">
            Informatique, cybersécurité, développement, infrastructure et marketing digital : choisissez votre
            parcours certifiant.
          </p>
        </div>

        <div v-if="isLoading" class="loading">Chargement des formations…</div>
        <div v-else class="formations-grid">
          <FormationCard
            v-for="formation in formations"
            :key="formation.id"
            :formation="formation"
            @view-details="selectedFormation = $event"
            @apply="handleApply"
          />
        </div>

        <div class="section-actions">
          <BaseButton to="/formations?type=campus" variant="outline">Voir tout le catalogue Campus</BaseButton>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container split">
        <div>
          <span class="eyebrow">Pourquoi le Campus</span>
          <h2 class="section-title">Un diplôme reconnu, une entreprise, un métier</h2>
          <p class="section-desc">
            Le Campus s’appuie sur des partenariats nationaux solides et un réseau d’entreprises réunionnaises
            engagées dans la formation des jeunes talents.
          </p>
          <ul class="check-list">
            <li>Diplômes d’État et titres RNCP reconnus par les employeurs</li>
            <li>Formation 100 % financée, alternant rémunéré chaque mois</li>
            <li>Job datings et mise en relation directe avec les recruteurs</li>
            <li>Référent handicap et accompagnement individualisé</li>
          </ul>
          <figure class="campus-cursus">
            <img :src="IMAGES.campusCursus" alt="Une session de formation en alternance" loading="lazy" decoding="async" />
            <figcaption>En entreprise 3 à 4 jours par semaine, au Campus le reste du temps.</figcaption>
          </figure>
          <div class="section-actions">
            <BaseButton to="/a-propos">Notre histoire &amp; notre équipe</BaseButton>
          </div>
        </div>
        <div class="partner-card">
          <img class="campus-logo" :src="IMAGES.logoCampus" alt="Expernet Campus" loading="lazy" />
          <h3>Nos partenaires pédagogiques</h3>
          <ul class="partner-list">
            <li v-for="partner in PARTNERS" :key="partner">{{ partner }}</li>
          </ul>
          <PartnerLogos />
          <figure class="campus-photo">
            <img :src="IMAGES.campusPhoto" alt="Un centre de formation Expernet" loading="lazy" />
            <figcaption>Nos locaux de formation et de travail en entreprise.</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container cta-band__inner">
        <div>
          <h2>Prêt à rejoindre la prochaine promotion ?</h2>
          <p>Les candidatures pour la rentrée 2026-2027 sont ouvertes. Déposez votre dossier en ligne.</p>
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
.campus-cursus {
  margin: 1.75rem 0 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
  background: var(--color-bg-card);
}

.campus-cursus img {
  display: block;
  width: 100%;
  height: 210px;
  object-fit: cover;
}

.campus-cursus figcaption {
  padding: 0.75rem 1rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.campus-logo {
  display: block;
  height: 64px;
  width: auto;
  margin-bottom: 1rem;
  object-fit: contain;
}

.campus-photo {
  margin: 1.25rem 0 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
}

.campus-photo img {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.campus-photo figcaption {
  padding: 0.6rem 0.85rem;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  background: var(--color-bg-inset);
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
  list-style: none;
}

.fact-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-left: 4px solid var(--accent);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.fact-card strong {
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--exp-navy-950);
}

.fact-card span {
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
  list-style: none;
}

.step-card {
  position: relative;
  padding: 1.75rem 1.5rem 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-bottom: 0.85rem;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-weight: 900;
}

.step-card h3 {
  margin-bottom: 0.4rem;
  font-size: 1.02rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.step-card p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

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
  grid-template-columns: 1.4fr 0.9fr;
  gap: 3rem;
  align-items: start;
}

.check-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 1.25rem;
}

.check-list li {
  position: relative;
  padding-left: 1.6rem;
  font-size: 0.95rem;
  color: var(--color-text-main);
}

.check-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-strong);
  font-weight: 900;
}

.partner-card {
  padding: 1.75rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-top: 4px solid var(--accent);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.partner-card h3 {
  margin-bottom: 1rem;
  font-size: 1.05rem;
  font-weight: 800;
}

.partner-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
}

.partner-list li {
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-full);
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 0.82rem;
  font-weight: 800;
}

@media (max-width: 1024px) {
  .facts-grid,
  .steps-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .split {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .facts-grid,
  .steps-grid,
  .formations-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
