<script setup lang="ts">
import { BUREAU_MEMBERS, CAMPUS_HISTORY, CAMPUS_SITES, PARTNERS } from '@/data/bureau';
import { IMAGES } from '@/data/images';
import PartnerLogos from '@/components/PartnerLogos.vue';
import SeoMeta from '@/components/SeoMeta.vue';
import PageHero from '@/components/PageHero.vue';
import BaseButton from '@/components/BaseButton.vue';

const VALUES = [
  {
    icon: '🌍',
    title: 'Ancrés au territoire',
    text: 'Nos formations répondent aux besoins réels des entreprises de La Réunion et de Mayotte.',
  },
  {
    icon: '🎯',
    title: 'L’exigence pédagogique',
    text: 'Des cursus certifiants, des formateurs experts et un suivi individuel de chaque apprenant.',
  },
  {
    icon: '🤝',
    title: 'L’accompagnement',
    text: 'De la candidature à l’insertion, une équipe disponible pour sécuriser chaque étape du parcours.',
  },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
</script>

<template>
  <div class="accent-orange">
    <SeoMeta
      title="À propos | Expernet & Expernet Campus La Réunion"
      description="L’histoire d’Expernet et du Campus depuis 2002, notre mission, notre équipe et nos campus à La Réunion et à Mayotte."
    />

    <PageHero
      eyebrow="À propos"
      title="Depuis 2002, nous formons les talents tech de l’océan Indien"
      description="Expernet est né d’une conviction : le territoire réunionnais a besoin de formations exigeantes, connectées aux entreprises et accessibles à tous. Le Campus Expernet a prolongé cette mission en 2017 avec l’alternance."
      accent="orange"
      :image="IMAGES.heroAbout"
      image-alt="L'écosystème Expernet"
    >
      <template #actions>
        <BaseButton to="/formations" size="lg">Découvrir nos formations</BaseButton>
        <BaseButton to="/planning" variant="outline" size="lg">Voir le planning</BaseButton>
      </template>
    </PageHero>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Notre histoire</span>
          <h2 class="section-title">D’un organisme de formation à un campus de référence</h2>
          <p class="section-desc">
            Plus de vingt ans d’évolution, toujours guidés par la même ambition : contribuer au développement du
            territoire par la compétence.
          </p>
        </div>

        <ol class="timeline">
          <li v-for="event in CAMPUS_HISTORY" :key="event.year" class="timeline-item">
            <span class="timeline-year">{{ event.year }}</span>
            <div class="timeline-body">
              <h3>{{ event.title }}</h3>
              <p>{{ event.description }}</p>
            </div>
          </li>
        </ol>

        
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Nos valeurs</span>
          <h2 class="section-title">Ce qui guide notre projet pédagogique</h2>
        </div>
        <div class="grid grid--3">
          <article v-for="value in VALUES" :key="value.title" class="surface-card value-card">
            <span class="value-icon" aria-hidden="true">{{ value.icon }}</span>
            <h3>{{ value.title }}</h3>
            <p>{{ value.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Le bureau &amp; l’équipe</span>
          <h2 class="section-title">Les personnes qui font vivre le Campus</h2>
          <p class="section-desc">
            Une équipe pluridisciplinaire qui accompagne les apprenants, les entreprises et les partenaires au
            quotidien.
          </p>
        </div>

        <figure class="team-photo team-photo--staff">
          <img :src="IMAGES.aboutTeam" alt="Le staff Expernet" loading="lazy" decoding="async" />
          <figcaption>Le staff Expernet et l’équipe pédagogique au quotidien sur nos trois campus.</figcaption>
        </figure>

        <ul class="team-grid">
          <li v-for="member in BUREAU_MEMBERS" :key="member.name" class="member-card">
            <span class="member-avatar" aria-hidden="true">{{ initials(member.name) }}</span>
            <div class="member-info">
              <h3>{{ member.name }}</h3>
              <p class="member-role">{{ member.role }}</p>
              <span class="member-scope">{{ member.scope }}</span>
              <blockquote v-if="member.quote">« {{ member.quote }} »</blockquote>
            </div>
          </li>
        </ul>
        <p class="team-note">
          Informations présentées à titre de démonstration pour ce prototype de portail.
        </p>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container split">
        <div>
          <span class="eyebrow">Nos campus</span>
          <h2 class="section-title">Trois sites à La Réunion</h2>
          <ul class="site-list">
            <li v-for="site in CAMPUS_SITES" :key="site.name">
              <h3>{{ site.name }} <span class="site-city">{{ site.city }}</span></h3>
              <p>{{ site.address }}</p>
              <a :href="`tel:${site.phone.replace(/\s/g, '')}`" class="site-phone">📞 {{ site.phone }}</a>
              <span class="site-note">{{ site.note }}</span>
            </li>
          </ul>
        </div>

        <aside class="partner-card">
          <h3>Un réseau de partenaires</h3>
          <p>
            Le Campus s’appuie sur des écoles et éditeurs reconnus pour délivrer des diplômes et certifications
            de référence.
          </p>
          <ul class="partner-list">
            <li v-for="partner in PARTNERS" :key="partner">{{ partner }}</li>
          </ul>

          <div class="certification">
            <img :src="IMAGES.qualiopi" alt="Certification Qualiopi" loading="lazy" />
            <p>Centre de formation certifié Qualiopi pour les actions de formation et l’apprentissage.</p>
          </div>

          <p class="accessibility-note">
            Nos établissements sont accessibles aux personnes à mobilité réduite. Référente handicap :
            Murielle Chamand — 0262 21 90 45.
          </p>
        </aside>
      </div>
    </section>

    <section class="section partners-section">
      <div class="container">
        <div class="section-head section-head--center">
          <span class="eyebrow">Partenaires</span>
          <h2 class="section-title">Ils font confiance à Expernet Campus</h2>
          <p class="section-desc">
            Écoles, éditeurs et institutions qui garantissent la qualité de nos formations et l’accès à l’emploi.
          </p>
        </div>

        <PartnerLogos />
      </div>
    </section>

    <section class="cta-band">
      <div class="container cta-band__inner">
        <div>
          <h2>Envie de construire la suite avec nous ?</h2>
          <p>Que vous soyez candidat, entreprise ou partenaire, notre équipe vous répond sous 48 h.</p>
        </div>
        <BaseButton to="/candidature" size="lg">Candidater</BaseButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.timeline {
  list-style: none;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-left: 0;
}

.timeline-item {
  display: grid;
  grid-template-columns: 110px minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
  padding: 1.35rem 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.timeline-year {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.9rem;
  border-radius: var(--radius-full);
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 1rem;
  font-weight: 900;
}

.timeline-body h3 {
  margin-bottom: 0.3rem;
  font-size: 1.08rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.timeline-body p {
  font-size: 0.94rem;
  line-height: 1.65;
  color: var(--color-text-muted);
}

.value-card {
  border-top: 4px solid var(--accent);
}

.value-icon {
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

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.35rem;
  list-style: none;
}

.member-card {
  display: flex;
  gap: 1rem;
  padding: 1.4rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.member-avatar {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--exp-orange), #ff9f24);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 900;
}

.member-info h3 {
  font-size: 1rem;
  font-weight: 900;
  color: var(--color-text-main);
}

.member-role {
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--accent-strong);
}

.member-scope {
  display: inline-block;
  margin-top: 0.4rem;
  padding: 0.15rem 0.55rem;
  border-radius: var(--radius-full);
  background: var(--accent-soft);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--accent-strong);
}

.member-info blockquote {
  margin-top: 0.6rem;
  font-size: 0.84rem;
  font-style: italic;
  line-height: 1.55;
  color: var(--color-text-muted);
}

.team-note {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--color-text-light);
  text-align: center;
}

.split {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 3rem;
  align-items: start;
}

.site-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.site-list li {
  padding: 1.2rem 1.3rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-left: 4px solid var(--accent);
  border-radius: var(--radius-md);
}

.site-list h3 {
  margin-bottom: 0.3rem;
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.site-city {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-text-light);
}

.site-list p {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.site-phone {
  display: inline-block;
  margin-top: 0.35rem;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--accent-strong);
}

.site-note {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--color-text-light);
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
  margin-bottom: 0.6rem;
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.partner-card p {
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--color-text-muted);
}

.partner-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 1rem 0;
}

.partner-list li {
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-full);
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-size: 0.8rem;
  font-weight: 800;
}

.team-photo {
  margin: 0 0 2rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
  box-shadow: var(--shadow-md);
  background: var(--color-bg-card);
}

.team-photo img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 520px;
  object-fit: contain;
  object-position: center;
  background: #0f3849;
}

.team-photo--staff img {
  width: auto;
  max-width: 560px;
  margin: 0 auto;
  padding: 1rem;
  max-height: 440px;
  object-fit: contain;
  object-position: center;
  background: var(--color-bg-inset);
}

.team-photo figcaption {
  padding: 0.85rem 1.25rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  background: var(--color-bg-card);
  text-align: center;
}

.history-photo {
  margin: 2.5rem 0 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border-subtle);
  box-shadow: var(--shadow-md);
  background: var(--color-bg-card);
}

.history-photo img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 460px;
  object-fit: contain;
  object-position: center;
  background: var(--color-bg-inset);
}

.history-photo figcaption {
  padding: 0.85rem 1.25rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-align: center;
}

.partners-section {
  background: var(--color-bg-page);
}

.partner-logos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.85rem;
  list-style: none;
  margin: 1.25rem 0;
}

.partner-logos li {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 0.75rem 0.6rem;
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  background: var(--color-bg-inset);
  text-align: center;
}

.partner-logos img {
  height: 38px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

.partner-logos span {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.certification {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--color-bg-inset);
  border: 1px dashed var(--color-border-strong);
}

.certification img {
  height: 52px;
  width: auto;
  object-fit: contain;
}

.certification p {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.accessibility-note {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border-subtle);
  font-size: 0.82rem;
}

@media (max-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .split {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 680px) {
  .team-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .timeline-item {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;
  }

  .timeline-year {
    justify-self: start;
  }
}
</style>
