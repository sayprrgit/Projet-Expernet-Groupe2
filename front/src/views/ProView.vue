<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Formation } from '@/types/formation';
import { apiService } from '@/services/api';
import { IMAGES } from '@/data/images';
import SeoMeta from '@/components/SeoMeta.vue';
import PageHero from '@/components/PageHero.vue';
import BaseButton from '@/components/BaseButton.vue';
import FormationCard from '@/components/FormationCard.vue';
import FormationModal from '@/components/FormationModal.vue';

const router = useRouter();

const THEMATIQUES = [
  { title: 'Cybersécurité & tests d’intrusion', image: IMAGES.proCyber },
  { title: 'Design, graphisme & production digitale', image: IMAGES.proDesign },
  { title: 'Administration avancée & Zero Trust', image: IMAGES.proAdmin },
];
const formations = ref<Formation[]>([]);
const selectedFormation = ref<Formation | null>(null);
const isLoading = ref(true);

const FINANCEMENTS = [
  {
    title: 'Compte Personnel de Formation',
    text: 'Mobilisez vos droits CPF directement sur MonCompteFormation pour financer tout ou partie de votre parcours.',
    tag: 'CPF',
  },
  {
    title: 'OPCO & entreprises',
    text: 'Prise en charge par votre opérateur de compétences ou directement par votre employeur dans le cadre du plan de développement.',
    tag: 'Entreprises',
  },
  {
    title: 'Transition Pro',
    text: 'Financement des projets de reconversion professionnelle pour les salariés et les indépendants.',
    tag: 'Reconversion',
  },
  {
    title: 'France Travail',
    text: 'Dispositifs d’aide à la formation pour les demandeurs d’emploi, avec accompagnement au montage du dossier.',
    tag: 'Demandeurs d’emploi',
  },
];

const FORMATS = [
  {
    title: 'Inter-entreprises',
    text: 'Sessions programmées tout au long de l’année, en présentiel sur nos sites ou à distance.',
  },
  {
    title: 'Intra-entreprise',
    text: 'Programme construit sur mesure pour vos équipes, dans vos locaux ou les nôtres.',
  },
  {
    title: 'Distanciel',
    text: 'Classes virtuelles animées par nos formateurs certifiés, avec supports et exercices en ligne.',
  },
];

const loadFormations = async () => {
  isLoading.value = true;
  try {
    const res = await apiService.getFormations({ type: 'pro' });
    formations.value = res.data;
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
  <div class="accent-blue">
    <SeoMeta
      title="Expernet Pro | Formations continues & CPF à La Réunion"
      description="Formations professionnelles continues à La Réunion : Microsoft 365, Copilot, cybersécurité, Excel TOSA. Sessions courtes éligibles CPF, en présentiel ou distanciel."
    />

    <PageHero
      eyebrow="Expernet Pro"
      title="Montez en compétences, sans mettre votre activité entre parenthèses"
      description="Certifications éditeurs, cybersécurité, bureautique avancée et management : des sessions courtes et opérationnelles pour les salariés, les indépendants et les entreprises réunionnaises."
      accent="blue"
      :image="IMAGES.heroPro"
      image-alt="Formations bureautiques et Microsoft 365 Expernet Pro"
    >
      <template #actions>
        <BaseButton to="/formations?type=pro" size="lg">Voir les formations Pro</BaseButton>
        <BaseButton to="/planning" variant="outline" size="lg">Calendrier des sessions</BaseButton>
      </template>
    </PageHero>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Financement</span>
          <h2 class="section-title">4 façons de financer votre formation</h2>
          <p class="section-desc">
            Nos conseillers vous aident à identifier le dispositif le plus adapté à votre situation.
          </p>
        </div>

        <div class="grid grid--4">
          <article v-for="item in FINANCEMENTS" :key="item.tag" class="surface-card finance-card">
            <span class="finance-tag">{{ item.tag }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Catalogue Pro</span>
          <h2 class="section-title">Certifications &amp; parcours courts</h2>
          <p class="section-desc">
            Des formations de 3 à 5 jours, animées par des formateurs certifiés et orientées pratique.
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
          <BaseButton to="/formations?type=pro" variant="outline">Voir tout le catalogue Pro</BaseButton>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Nos thématiques</span>
          <h2 class="section-title">Des parcours alignés sur les besoins des entreprises</h2>
          <p class="section-desc">
            Cybersécurité, design, bureautique ou intelligence artificielle : nos sessions Pro sont construites avec
            les professionnels du territory.
          </p>
        </div>

        <div class="gallery">
          <figure v-for="item in THEMATIQUES" :key="item.title" class="gallery__item">
            <img :src="item.image" :alt="item.title" loading="lazy" decoding="async" />
            <figcaption>{{ item.title }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div>
          <span class="eyebrow">Formats</span>
          <h2 class="section-title">Une organisation adaptée à votre quotidien</h2>
          <p class="section-desc">
            Les sessions Expernet Pro sont conçues pour s’intégrer à votre activité, sur nos trois sites
            réunionnais ou à distance.
          </p>
          <ul class="format-list">
            <li v-for="item in FORMATS" :key="item.title">
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </li>
          </ul>
        </div>

        <div class="contact-card">
          <h3>Un besoin spécifique ?</h3>
          <p>
            Décrivez-nous votre projet : nous construisons un programme sur mesure et vous accompagnons dans le
            montage du financement.
          </p>
          <ul class="contact-list">
            <li><a href="tel:+262262294020">📞 0262 29 40 20</a></li>
            <li><a href="mailto:contact@expernet.re">✉️ contact@expernet.re</a></li>
            <li>📍 Le Port</li>
          </ul>
          <BaseButton to="/candidature" block>Demander un devis</BaseButton>
        </div>
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
.finance-tag {
  display: inline-block;
  margin-bottom: 0.85rem;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
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

.format-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.format-list li {
  padding: 1.15rem 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-left: 4px solid var(--accent);
  border-radius: var(--radius-md);
}

.format-list h3 {
  margin-bottom: 0.3rem;
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.format-list p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.contact-card {
  padding: 1.85rem;
  background: var(--exp-navy-950);
  border-radius: var(--radius-lg);
  color: #ffffff;
  border-top: 4px solid var(--accent);
}

.contact-card h3 {
  margin-bottom: 0.75rem;
  font-size: 1.15rem;
  font-weight: 900;
}

.contact-card p {
  margin-bottom: 1.25rem;
  font-size: 0.92rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.78);
}

.contact-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
}

.contact-list a:hover {
  color: var(--accent-bright);
}

@media (max-width: 1024px) {
  .split {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.gallery__item {
  margin: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  box-shadow: var(--shadow-sm);
}

.gallery__item img {
  display: block;
  width: 100%;
  height: 230px;
  object-fit: cover;
}

.gallery__item figcaption {
  padding: 0.9rem 1.15rem;
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.formations-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
