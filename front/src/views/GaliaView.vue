<script setup lang="ts">
import { computed, onMounted } from 'vue';
import SeoMeta from '@/components/SeoMeta.vue';
import PageHero from '@/components/PageHero.vue';
import BaseButton from '@/components/BaseButton.vue';
import { IMAGES } from '@/data/images';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const isAuthenticated = computed(() => !!auth.token && !!auth.user);
const accessLabel = computed(() =>
  isAuthenticated.value ? 'Accéder à mon espace' : 'Se connecter à Galia',
);
const accessTarget = computed(() => (isAuthenticated.value ? '/galia/espace' : '/login'));

onMounted(() => auth.ensureSession());

const FEATURES = [
  {
    icon: '📖',
    title: 'Cours & supports',
    text: 'Retrouvez les supports de cours, exercices et ressources complémentaires de chaque module.',
  },
  {
    icon: '🗓️',
    title: 'Emploi du temps',
    text: 'Consultez votre planning d’alternance et les dates de regroupement au Campus.',
  },
  {
    icon: '📈',
    title: 'Progression',
    text: 'Suivez vos résultats, vos évaluations et les compétences validées tout au long de l’année.',
  },
  {
    icon: '📝',
    title: 'Rendus & évaluations',
    text: 'Déposez vos livrables, passez vos quiz et consultez les retours de vos formateurs.',
  },
  {
    icon: '🏅',
    title: 'Attestations',
    text: 'Téléchargez vos attestations de formation et vos certificats dès qu’ils sont validés.',
  },
  {
    icon: '💬',
    title: 'Messagerie pédagogique',
    text: 'Échangez avec vos formateurs et votre tuteur pédagogique depuis un espace unique.',
  },
];

const STEPS = [
  {
    title: 'Recevez vos identifiants',
    text: 'Votre compte GALIA est créé lors de votre inscription. Les identifiants sont envoyés par e-mail.',
  },
  {
    title: 'Connectez-vous',
    text: 'Accédez à votre espace depuis un ordinateur, une tablette ou un mobile.',
  },
  {
    title: 'Commencez votre parcours',
    text: 'Retrouvez vos modules, votre planning et vos ressources dès le premier jour de formation.',
  },
];
</script>

<template>
  <div class="accent-gold">
    <SeoMeta
      title="GALIA | Espace apprenant Expernet Campus"
      description="GALIA, la plateforme LMS des apprenants Expernet Campus : cours, ressources, planning, suivi de progression et attestations en ligne."
    />

    <PageHero
      eyebrow="Espace apprenant"
      title="GALIA, votre parcours de formation réuni au même endroit"
      description="Cours, ressources, emploi du temps, rendus et attestations : GALIA accompagne les apprenants Expernet Campus pendant toute la durée de leur formation."
      accent="gold"
      :image="IMAGES.heroGalia"
      image-alt="Intelligence artificielle et productivité bureautique"
    >
      <template #actions>
        <BaseButton :to="accessTarget" size="lg">{{ accessLabel }}</BaseButton>
        <BaseButton to="/candidature" variant="outline" size="lg">Demander mes accès</BaseButton>
      </template>
    </PageHero>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Fonctionnalités</span>
          <h2 class="section-title">Tout votre parcours pédagogique en ligne</h2>
          <p class="section-desc">
            GALIA centralise les outils utilisés par les apprenants, les formateurs et l’équipe pédagogique.
          </p>
        </div>

        <div class="grid grid--3">
          <article v-for="feature in FEATURES" :key="feature.title" class="surface-card feature-card">
            <span class="feature-icon" aria-hidden="true">{{ feature.icon }}</span>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container split">
        <div>
          <span class="eyebrow">Accès</span>
          <h2 class="section-title">Se connecter à GALIA</h2>
          <p class="section-desc">
            L’accès est réservé aux apprenants inscrits et aux équipes pédagogiques Expernet Campus.
          </p>
          <ol class="access-list">
            <li v-for="(step, index) in STEPS" :key="step.title">
              <span class="access-number" aria-hidden="true">{{ index + 1 }}</span>
              <div>
                <h3>{{ step.title }}</h3>
                <p>{{ step.text }}</p>
              </div>
            </li>
          </ol>
          <div class="section-actions">
            <BaseButton :to="accessTarget" size="lg">{{ accessLabel }}</BaseButton>
            <BaseButton to="/candidature" variant="outline" size="lg">Je n’ai pas reçu mes identifiants</BaseButton>
          </div>
          <figure class="galia-photo">
            <img :src="IMAGES.galiaPhoto" alt="Les ressources numériques GALIA" loading="lazy" decoding="async" />
            <figcaption>Supports de cours, exercices et ressources mis à jour sur GALIA.</figcaption>
          </figure>
        </div>

        <div class="preview-card" aria-label="Aperçu de l’espace GALIA">
          <div class="preview-head">
            <span class="preview-dot" aria-hidden="true"></span>
            <span>Mon espace — BTS SIO 1re année</span>
          </div>
          <ul class="preview-list">
            <li>
              <span aria-hidden="true">📖</span>
              <div>
                <strong>Module Cybersécurité</strong>
                <span>Chapitre 3 · 62 % complété</span>
              </div>
            </li>
            <li>
              <span aria-hidden="true">🗓️</span>
              <div>
                <strong>Prochain regroupement</strong>
                <span>Lundi 9 novembre · Campus Le Port</span>
              </div>
            </li>
            <li>
              <span aria-hidden="true">📝</span>
              <div>
                <strong>Livrable à rendre</strong>
                <span>Dossier projet · dans 5 jours</span>
              </div>
            </li>
            <li>
              <span aria-hidden="true">🏅</span>
              <div>
                <strong>Attestation disponible</strong>
                <span>Bonnes pratiques ANSSI</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container cta-band__inner">
        <div>
          <h2>Une question sur GALIA ?</h2>
          <p>Notre équipe pédagogique vous accompagne pour votre première connexion et tout au long de l’année.</p>
        </div>
        <BaseButton to="/candidature" size="lg">Contacter un conseiller</BaseButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.feature-card {
  border-top: 4px solid var(--accent);
}

.feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin-bottom: 0.85rem;
  border-radius: 12px;
  background: var(--accent-soft);
  font-size: 1.25rem;
}

.split {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 3rem;
  align-items: start;
}

.access-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.access-list li {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
}

.access-number {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-weight: 900;
}

.access-list h3 {
  margin-bottom: 0.2rem;
  font-size: 0.98rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.access-list p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.section-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.75rem;
}

.galia-photo {
  margin: 1.75rem 0 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
  background: var(--color-bg-card);
}

.galia-photo img {
  display: block;
  width: 100%;
  height: 210px;
  object-fit: cover;
}

.galia-photo figcaption {
  padding: 0.75rem 1rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.preview-card {
  background: var(--exp-navy-950);
  border-radius: var(--radius-lg);
  padding: 1.35rem;
  color: #ffffff;
  border-top: 4px solid var(--accent);
  box-shadow: var(--shadow-lg);
}

.preview-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.82);
}

.preview-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft);
}

.preview-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.preview-list li {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.7rem 0.8rem;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.05);
}

.preview-list div {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.preview-list strong {
  font-size: 0.86rem;
  font-weight: 800;
}

.preview-list div span {
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.65);
}

@media (max-width: 1024px) {
  .split {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
