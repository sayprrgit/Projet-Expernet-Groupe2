<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Formation } from '@/types/formation';
import { apiService } from '@/services/api';
import { IMAGES } from '@/data/images';
import SeoMeta from '@/components/SeoMeta.vue';
import PageHero from '@/components/PageHero.vue';
import CandidatureForm from '@/components/CandidatureForm.vue';

const route = useRoute();
const formations = ref<Formation[]>([]);

const preselectedFormationId = computed(() =>
  typeof route.query.formation === 'string' ? route.query.formation : '',
);

const REASSURANCE = [
  { icon: '⏱️', title: 'Réponse sous 48 h', text: 'Un conseiller vous recontacte rapidement après réception de votre dossier.' },
  { icon: '🧭', title: 'Accompagnement personnalisé', text: 'Aide au choix du cursus et à la recherche d’une entreprise partenaire.' },
  { icon: '🔒', title: 'Données protégées', text: 'Vos informations restent confidentielles et ne sont utilisées que pour votre candidature.' },
];

onMounted(async () => {
  const res = await apiService.getFormations();
  formations.value = res.data;
});
</script>

<template>
  <div>
    <SeoMeta
      title="Candidature en ligne | Expernet & Expernet Campus"
      description="Déposez votre candidature en ligne pour les formations Expernet Campus en alternance ou les sessions Expernet Pro à La Réunion."
    />

    <PageHero
      eyebrow="Candidature"
      title="Déposez votre dossier en ligne"
      description="Un seul formulaire pour rejoindre une formation en alternance ou une session Expernet Pro. Remplissez vos informations : un conseiller prend le relais."
      accent="orange"
      compact
      :image="IMAGES.heroCandidature"
      image-alt="Un candidat qui dépose son dossier"
    />

    <section class="section--tight">
      <div class="container">
        <!-- <div class="candidature-intro">
          <img :src="IMAGES.logoMarkBlue" alt="Expernet" class="candidature-logo" loading="lazy" />
        </div> -->

        <ul class="reassurance">
          <li v-for="item in REASSURANCE" :key="item.title">
            <span aria-hidden="true">{{ item.icon }}</span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.text }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <CandidatureForm
      :formations="formations"
      :preselected-formation-id="preselectedFormationId"
    />
  </div>
</template>

<style scoped>
.reassurance {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  list-style: none;
}

.reassurance li {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  padding: 1.15rem 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
}

.reassurance li > span {
  font-size: 1.25rem;
  line-height: 1.2;
}

.reassurance strong {
  display: block;
  margin-bottom: 0.15rem;
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.reassurance p {
  font-size: 0.84rem;
  line-height: 1.55;
  color: var(--color-text-muted);
}

@media (max-width: 820px) {
.candidature-intro {
  display: flex;
  justify-content: center;
  margin-bottom: 1.75rem;
}

.candidature-logo {
  height: 72px;
  width: auto;
  object-fit: contain;
}

.reassurance {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
