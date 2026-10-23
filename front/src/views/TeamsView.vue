<script setup lang="ts">
import SeoMeta from '@/components/SeoMeta.vue';
import PageHero from '@/components/PageHero.vue';
import BaseButton from '@/components/BaseButton.vue';
import { IMAGES } from '@/data/images';

const FEATURES = [
  {
    icon: '🎥',
    title: 'Classes virtuelles',
    text: 'Assistez aux cours et aux points pédagogiques en visioconférence avec vos formateurs.',
  },
  {
    icon: '👥',
    title: 'Projets en équipe',
    text: 'Travaillez en groupe sur les projets fil rouge, avec des canaux dédiés par promotion.',
  },
  {
    icon: '🧭',
    title: 'Tutorat & suivi',
    text: 'Échangez avec votre tuteur pédagogique et votre référent entreprise dans un même espace.',
  },
  {
    icon: '📂',
    title: 'Ressources partagées',
    text: 'Retrouvez les documents, modèles et enregistrements partagés par l’équipe pédagogique.',
  },
  {
    icon: '🔔',
    title: 'Notifications',
    text: 'Soyez informé des changements de planning, des rendus et des rendez-vous importants.',
  },
  {
    icon: '🤖',
    title: 'Assistant IA',
    text: 'Utilisez Copilot pour préparer vos révisions, synthétiser des documents et gagner du temps.',
  },
];

const RULES = [
  'Utiliser votre compte Expernet pour rejoindre l’équipe de votre promotion.',
  'Respecter les règles de courtoisie et la confidentialité des échanges.',
  'Nommer clairement vos fichiers et déposer vos livrables dans les canaux prévus.',
];
</script>

<template>
  <div class="accent-purple">
    <SeoMeta
      title="Teams | Espace collaboratif Expernet Campus"
      description="L’espace Microsoft Teams d’Expernet Campus : classes virtuelles, projets en équipe, tutorat et ressources partagées."
    />

    <PageHero
      eyebrow="Espace collaboratif"
      title="Teams, le prolongement numérique de votre formation"
      description="Classes virtuelles, projets en équipe, tutorat et ressources : l’espace Teams rassemble les échanges pédagogiques de votre promotion."
      accent="purple"
      :image="IMAGES.heroTeams"
      image-alt="Classes virtuelles et travail collaboratif"
    >
      <template #actions>
        <BaseButton to="/teams/messagerie" size="lg">Connexion Teams</BaseButton>
        <BaseButton to="/candidature" variant="outline" size="lg">Obtenir mes accès Teams</BaseButton>
        <BaseButton to="/galia" variant="outline" size="lg">Découvrir GALIA</BaseButton>
      </template>
    </PageHero>

    <section class="section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Fonctionnalités</span>
          <h2 class="section-title">Collaborer, échanger, avancer ensemble</h2>
          <p class="section-desc">
            Teams complète GALIA pour tout ce qui se joue en collectif : cours à distance, projets et suivi.
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
          <span class="eyebrow">Bon usage</span>
          <h2 class="section-title">Trois règles pour un espace efficace</h2>
          <p class="section-desc">
            Pour que chacun puisse travailler sereinement, l’espace Teams suit une charte simple, partagée avec
            les apprenants et les formateurs.
          </p>
          <ul class="rules-list">
            <li v-for="rule in RULES" :key="rule">{{ rule }}</li>
          </ul>
          <div class="section-actions">
            <BaseButton to="/candidature">Signaler un problème d’accès</BaseButton>
          </div>
          <figure class="teams-photo">
            <img :src="IMAGES.teamsPhoto" alt="Travail collaboratif en équipe" loading="lazy" decoding="async" />
            <figcaption>Les équipes projet travaillent ensemble dans les canaux Teams du Campus.</figcaption>
          </figure>
        </div>

        <aside class="team-card">
          <h3>Votre promotion sur Teams</h3>
          <ul class="team-list">
            <li>
              <span class="team-avatar" aria-hidden="true">SISR</span>
              <div>
                <strong>BTS SIO — SISR</strong>
                <span>Infrastructure, systèmes &amp; réseaux</span>
              </div>
            </li>
            <li>
              <span class="team-avatar" aria-hidden="true">SLAM</span>
              <div>
                <strong>BTS SIO — SLAM</strong>
                <span>Développement d’applications</span>
              </div>
            </li>
            <li>
              <span class="team-avatar" aria-hidden="true">CDA</span>
              <div>
                <strong>Concepteur Développeur d’Applications</strong>
                <span>Bac+4 · Partenariat ENI</span>
              </div>
            </li>
            <li>
              <span class="team-avatar" aria-hidden="true">CYB</span>
              <div>
                <strong>Hacking &amp; Cybersécurité</strong>
                <span>Bac+5 · Cybersecurity Academy</span>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <section class="cta-band">
      <div class="container cta-band__inner">
        <div>
          <h2>Besoin d’un coup de main pour rejoindre Teams ?</h2>
          <p>L’équipe pédagogique peut vous réinviter et vérifier vos accès en quelques minutes.</p>
        </div>
        <BaseButton to="/candidature" size="lg">Contacter l’équipe</BaseButton>
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

.rules-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 1.5rem;
}

.rules-list li {
  position: relative;
  padding-left: 1.6rem;
  font-size: 0.94rem;
  line-height: 1.6;
  color: var(--color-text-main);
}

.rules-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-strong);
  font-weight: 900;
}

.section-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.75rem;
}

.teams-photo {
  margin: 1.75rem 0 0;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
  background: var(--color-bg-card);
}

.teams-photo img {
  display: block;
  width: 100%;
  height: 210px;
  object-fit: cover;
}

.teams-photo figcaption {
  padding: 0.75rem 1rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.team-card {
  padding: 1.6rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-top: 4px solid var(--accent);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.team-card h3 {
  margin-bottom: 1rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.team-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.team-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem;
  border-radius: var(--radius-md);
  background: var(--color-bg-inset);
}

.team-avatar {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background: var(--accent);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.team-list div {
  display: flex;
  flex-direction: column;
}

.team-list strong {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.team-list div span {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

@media (max-width: 1024px) {
  .split {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
