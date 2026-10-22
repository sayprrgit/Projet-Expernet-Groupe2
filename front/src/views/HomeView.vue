<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import type { Formation, FormationFilters } from '@/types/formation';
import { apiService } from '@/services/api';
import SeoMeta from '@/components/SeoMeta.vue';
import Navbar from '@/components/Navbar.vue';
import HeroSection from '@/components/HeroSection.vue';
import SearchAndFilters from '@/components/SearchAndFilters.vue';
import FormationCard from '@/components/FormationCard.vue';
import FormationModal from '@/components/FormationModal.vue';
import CandidatureForm from '@/components/CandidatureForm.vue';
import Footer from '@/components/Footer.vue';

// État des filtres
const filters = reactive<FormationFilters>({
  search: '',
  category: 'all',
  level: 'all',
  type: 'all',
  cpfOnly: false,
  campus: 'all',
});

// État des formations
const formations = ref<Formation[]>([]);
const totalAll = ref(0);
const isLoading = ref(true);
const selectedFormation = ref<Formation | null>(null);
const preselectedFormationId = ref<string>('');

// Récupération des formations avec gestion réactive des filtres
const fetchFormations = async () => {
  isLoading.value = true;
  try {
    const res = await apiService.getFormations(filters);
    formations.value = res.data;
    if (totalAll.value === 0 || (filters.search === '' && filters.category === 'all' && filters.level === 'all' && filters.type === 'all' && !filters.cpfOnly && filters.campus === 'all')) {
      totalAll.value = res.total;
    }
  } catch (err) {
    console.error('Erreur lors du chargement des formations :', err);
  } finally {
    isLoading.value = false;
  }
};

watch(
  filters,
  () => {
    fetchFormations();
  },
  { deep: true },
);

onMounted(() => {
  fetchFormations();
});

// Réinitialisation des filtres
const resetFilters = () => {
  filters.search = '';
  filters.category = 'all';
  filters.level = 'all';
  filters.type = 'all';
  filters.cpfOnly = false;
  filters.campus = 'all';
};

// Sélection du type depuis le Hero (All, Campus, Pro)
const handleSelectType = (type: string) => {
  filters.type = type;
  const target = document.getElementById('formations');
  target?.scrollIntoView({ behavior: 'smooth' });
};

// Ouverture de la fiche détaillée (Modale)
const openDetails = (formation: Formation) => {
  selectedFormation.value = formation;
};

const closeDetails = () => {
  selectedFormation.value = null;
};

// Clic sur "Candidater" -> sélection de la formation et scroll fluide vers le formulaire
const handleApply = (formation: Formation) => {
  preselectedFormationId.value = formation.id;
  const target = document.getElementById('candidature-section');
  target?.scrollIntoView({ behavior: 'smooth' });
};

// Titre dynamique pour le SEO selon la sélection
const dynamicSeoTitle = computed(() => {
  if (filters.category !== 'all') {
    const catLabels: Record<string, string> = {
      dev: 'Développement Web & Logiciel',
      reseaux: 'Systèmes, Réseaux & Cybersécurité',
      marketing: 'Marketing Digital & Communication',
      management: 'Management IT & Bureautique',
    };
    return `Formations ${catLabels[filters.category] || ''} | Expernet Réunion`;
  }
  if (filters.type === 'campus') {
    return 'Expernet Campus Réunion | Formations en Alternance Bac+2 à Bac+5';
  }
  if (filters.type === 'pro') {
    return 'Expernet Pro Réunion | Formations Continues, Reconversion & CPF';
  }
  return 'Expernet & Expernet Campus La Réunion | Portail Officiel Formations Tech';
});
</script>

<template>
  <div id="top" class="home-page">
    <!-- Métadonnées & SEO dynamique -->
    <SeoMeta
      :title="dynamicSeoTitle"
      :total-formations="formations.length"
    />

    <!-- En-tête / Barre de navigation -->
    <Navbar />

    <!-- Contenu principal fluide avec scrolling global -->
    <main id="main-content" tabindex="-1">
      <!-- Section Hero & Univers Expernet -->
      <HeroSection
        :active-type="filters.type"
        @select-type="handleSelectType"
      />

      <!-- Section Catalogue : Toutes les formations listées d'emblée avec la barre de recherche au-dessus -->
      <section id="formations" class="catalogue-section" aria-labelledby="catalogue-title">
        <div class="container">
          <div class="catalogue-header">
            <span class="catalogue-badge">Catalogue Complet 2026-2027</span>
            <h2 id="catalogue-title" class="catalogue-title">
              Toutes nos Formations à La Réunion
            </h2>
            <p class="catalogue-desc">
              Toutes les formations certifiantes d'<strong>Expernet Campus</strong> (Alternance Bac+2 à Bac+5) et d'<strong>Expernet Pro</strong> (CPF &amp; Salariés) sont listées ci-dessous. Utilisez la barre de recherche pour affiner par mots-clés ou filtres détaillés.
            </p>
          </div>
        </div>

        <!-- Barre de recherche et filtres de détail -->
        <SearchAndFilters
          :filters="filters"
          :total-results="formations.length"
          :total-all="totalAll || formations.length"
          @update:filters="Object.assign(filters, $event)"
          @reset="resetFilters"
        />

        <div class="container">
          <!-- Tags de filtres actifs -->
          <div
            v-if="filters.category !== 'all' || filters.level !== 'all' || filters.cpfOnly || filters.campus !== 'all' || filters.search || filters.type !== 'all'"
            class="active-filters-bar"
            aria-label="Filtres actuellement appliqués"
          >
            <span class="active-label">Filtres actifs :</span>
            <button
              v-if="filters.search"
              class="active-tag"
              @click="filters.search = ''"
            >
              Recherche : "{{ filters.search }}" ✕
            </button>
            <button
              v-if="filters.type !== 'all'"
              class="active-tag active-tag--type"
              @click="filters.type = 'all'"
            >
              {{ filters.type === 'campus' ? 'Alternance Campus' : 'Formation Pro' }} ✕
            </button>
            <button
              v-if="filters.category !== 'all'"
              class="active-tag"
              @click="filters.category = 'all'"
            >
              Filière ✕
            </button>
            <button
              v-if="filters.level !== 'all'"
              class="active-tag"
              @click="filters.level = 'all'"
            >
              {{ filters.level }} ✕
            </button>
            <button
              v-if="filters.campus !== 'all'"
              class="active-tag"
              @click="filters.campus = 'all'"
            >
              {{ filters.campus }} ✕
            </button>
            <button
              v-if="filters.cpfOnly"
              class="active-tag active-tag--cpf"
              @click="filters.cpfOnly = false"
            >
              Éligible CPF Uniquement ✕
            </button>
          </div>

          <!-- État de chargement -->
          <div v-if="isLoading" class="loading-state" aria-live="polite">
            <div class="loading-spinner" aria-hidden="true"></div>
            <p>Mise à jour des formations en direct...</p>
          </div>

          <!-- Grille affichant l'intégralité des formations -->
          <div v-else-if="formations.length > 0" class="formations-grid">
            <FormationCard
              v-for="formation in formations"
              :key="formation.id"
              :formation="formation"
              @view-details="openDetails"
              @apply="handleApply"
            />
          </div>

          <!-- État aucun résultat -->
          <div v-else class="no-results-state" role="status">
            <div class="no-results-icon">🔍</div>
            <h3>Aucune formation ne correspond à vos critères</h3>
            <p>
              Modifiez votre recherche textuelle ou réinitialisez les filtres pour afficher l'ensemble du catalogue.
            </p>
            <button
              type="button"
              class="btn-reset-all"
              @click="resetFilters"
            >
              Afficher toutes les formations
            </button>
          </div>
        </div>
      </section>

      <!-- Section Présentation : Expernet Campus vs Expernet Pro -->
      <section id="expernet-campus" class="presentation-section presentation-section--campus" aria-labelledby="campus-title">
        <div class="container presentation-inner">
          <div class="presentation-content">
            <span class="sub-badge sub-badge--orange">Alternance Réunion (Le Port, Sainte-Clotilde, Saint-Pierre)</span>
            <h2 id="campus-title" class="presentation-title">
              Expernet Campus : Propulsez votre carrière avec l'alternance
            </h2>
            <p class="presentation-lead">
              Du <strong>Bac+2 au Bac+5</strong>, nos cursus en contrat d'apprentissage allient enseignement technique de haut niveau et immersion rémunérée dans les entreprises réunionnaises.
            </p>
            <ul class="presentation-bullets">
              <li>
                <strong>Formation 100% financée :</strong> 0€ de frais de scolarité pour l'alternant (prise en charge OPCO).
              </li>
              <li>
                <strong>Rémunération mensuelle :</strong> un salaire versé chaque mois pendant toute la durée de vos études.
              </li>
              <li>
                <strong>Partenariats prestigieux :</strong> Écoles nationales de renom (ENI, IPI, ESD Cybersecurity Academy, Digital Campus).
              </li>
              <li>
                <strong>Accompagnement personnalisé :</strong> job-datings et placement direct dans plus de 250 entreprises partenaires à La Réunion.
              </li>
            </ul>
            <div class="presentation-actions">
              <button
                type="button"
                class="btn-action btn-action--orange"
                @click="handleSelectType('campus')"
              >
                Voir les formations Campus
              </button>
              <a href="#candidature-section" class="btn-action btn-action--ghost">
                Déposer un dossier Campus
              </a>
            </div>
          </div>
          <div class="presentation-visual" aria-hidden="true">
            <div class="visual-card visual-card--campus">
              <span class="visual-badge visual-badge--orange">🎓 Rentrée 2026-2027</span>
              <h4>Diplômes Certifiés d'État &amp; Titres RNCP</h4>
              <p>Formations reconnues par le Ministère du Travail et l'Enseignement Supérieur.</p>
              <div class="visual-stats">
                <div>
                  <strong>92%</strong>
                  <span>Insertion sous 6 mois</span>
                </div>
                <div>
                  <strong>+250</strong>
                  <span>Entreprises partenaires 974</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="expernet-pro" class="presentation-section presentation-section--pro" aria-labelledby="pro-title">
        <div class="container presentation-inner presentation-inner--reverse">
          <div class="presentation-content">
            <span class="sub-badge sub-badge--blue">Formation Continue &amp; Salariés</span>
            <h2 id="pro-title" class="presentation-title">
              Expernet Pro : Reconversion, Montée en Compétences &amp; CPF
            </h2>
            <p class="presentation-lead">
              Pour les salariés, entreprises et demandeurs d'emploi à La Réunion souhaitant acquérir des compétences concrètes et des certifications reconnues (Microsoft, Cisco, TOSA, référentiels ANSSI).
            </p>
            <ul class="presentation-bullets">
              <li>
                <strong>Dispositifs de financement :</strong> MonCompteFormation (CPF), OPCO, Transition Pro, France Travail.
              </li>
              <li>
                <strong>Formations certifiantes courtes :</strong> de 3 à 5 jours, en présentiel (Le Port, Sainte-Clotilde, Saint-Pierre) ou à distance.
              </li>
              <li>
                <strong>Formateurs certifiés :</strong> professionnels en activité (MCT Microsoft, experts cybersécurité, TOSA).
              </li>
            </ul>
            <div class="presentation-actions">
              <button
                type="button"
                class="btn-action btn-action--blue"
                @click="handleSelectType('pro')"
              >
                Voir les formations Pro &amp; CPF
              </button>
              <a href="#candidature-section" class="btn-action btn-action--ghost">
                Demander un conseil / devis
              </a>
            </div>
          </div>
          <div class="presentation-visual" aria-hidden="true">
            <div class="visual-card visual-card--pro">
              <span class="visual-badge visual-badge--blue">💼 Financement CPF</span>
              <h4>Certifications Professionnelles Officielles</h4>
              <p>Validez vos compétences avec Microsoft 365, Copilot IA, Excel TOSA et les bonnes pratiques ANSSI.</p>
              <div class="visual-stats">
                <div>
                  <strong>100%</strong>
                  <span>Finançable CPF</span>
                </div>
                <div>
                  <strong>Qualiopi</strong>
                  <span>CFA certifié</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Formulaire interactif de candidature & prise de contact -->
      <CandidatureForm
        :formations="formations"
        :preselected-formation-id="preselectedFormationId"
      />
    </main>

    <!-- Fiche descriptive en modale interactive -->
    <FormationModal
      :formation="selectedFormation"
      @close="closeDetails"
      @apply="handleApply"
    />

    <!-- Pied de page -->
    <Footer />
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

main {
  outline: none;
}

.catalogue-section {
  padding: 3rem 0 4rem;
  background: var(--color-bg-page);
}

.catalogue-header {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2rem;
}

.catalogue-badge {
  display: inline-block;
  padding: 0.3rem 0.85rem;
  background: var(--exp-orange-light);
  color: var(--exp-orange-dark);
  border: 1px solid rgba(242, 140, 5, 0.3);
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.catalogue-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 900;
  color: var(--exp-navy-950);
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
}

.catalogue-desc {
  font-size: 1.05rem;
  color: var(--color-text-muted);
  line-height: 1.6;
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

.btn-reset-all {
  padding: 0.75rem 1.5rem;
  background: var(--exp-orange);
  color: #ffffff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset-all:hover {
  background: var(--exp-orange-hover);
}

/* Sections présentation */
.presentation-section {
  padding: 5rem 0;
  border-top: 1px solid var(--color-border-subtle);
}

.presentation-section--campus {
  background: #ffffff;
}

.presentation-section--pro {
  background: #f8fafc;
}

.presentation-inner {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 3.5rem;
  align-items: center;
}

.presentation-inner--reverse {
  grid-template-columns: 0.8fr 1.2fr;
}

.presentation-inner--reverse .presentation-content {
  order: 2;
}

.presentation-inner--reverse .presentation-visual {
  order: 1;
}

.sub-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.sub-badge--orange {
  background: var(--exp-orange-light);
  color: var(--exp-orange-dark);
  border: 1px solid rgba(242, 140, 5, 0.3);
}

.sub-badge--blue {
  background: var(--exp-blue-light);
  color: var(--exp-blue-dark);
  border: 1px solid rgba(69, 161, 195, 0.4);
}

.presentation-title {
  font-size: clamp(1.75rem, 3.5vw, 2.3rem);
  font-weight: 900;
  color: var(--exp-navy-950);
  line-height: 1.25;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.presentation-lead {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.presentation-bullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: 2rem;
}

.presentation-bullets li {
  position: relative;
  padding-left: 1.75rem;
  font-size: 0.95rem;
  color: var(--color-text-main);
  line-height: 1.5;
}

.presentation-bullets li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--exp-orange);
  font-weight: 900;
  font-size: 1.1rem;
}

.presentation-section--pro .presentation-bullets li::before {
  color: var(--exp-blue);
}

.presentation-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1.4rem;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-action--orange {
  background: var(--exp-orange);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(242, 140, 5, 0.35);
}

.btn-action--orange:hover {
  background: var(--exp-orange-hover);
}

.btn-action--blue {
  background: var(--exp-blue);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(69, 161, 195, 0.35);
}

.btn-action--blue:hover {
  background: var(--exp-blue-hover);
}

.btn-action--ghost {
  background: transparent;
  color: var(--exp-navy-900);
  border: 1.5px solid var(--color-border-strong);
}

.btn-action--ghost:hover {
  background: var(--color-bg-page);
}

.visual-card {
  background: linear-gradient(135deg, var(--exp-navy-950) 0%, var(--exp-navy-900) 100%);
  color: #ffffff;
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.visual-card--campus {
  border-top: 4px solid var(--exp-orange);
}

.visual-card--pro {
  background: linear-gradient(135deg, #0f2744 0%, #173656 100%);
  border-top: 4px solid var(--exp-blue);
}

.visual-badge {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
}

.visual-badge--orange {
  background: var(--exp-orange-subtle);
  color: #fed7aa;
  border: 1px solid var(--exp-orange);
}

.visual-badge--blue {
  background: var(--exp-blue-subtle);
  color: #7dd3fc;
  border: 1px solid var(--exp-blue);
}

.visual-card h4 {
  font-size: 1.45rem;
  font-weight: 900;
  margin-bottom: 0.65rem;
  line-height: 1.3;
}

.visual-card p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
}

.visual-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.visual-stats strong {
  display: block;
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--exp-blue);
}

.visual-stats span {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
}

@media (max-width: 992px) {
  .presentation-inner,
  .presentation-inner--reverse {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .presentation-inner--reverse .presentation-content {
    order: 1;
  }
  .presentation-inner--reverse .presentation-visual {
    order: 2;
  }
}
</style>
