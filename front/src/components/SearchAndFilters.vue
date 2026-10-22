<script setup lang="ts">
import { ref } from 'vue';
import type { FormationFilters } from '@/types/formation';

const props = defineProps<{
  filters: FormationFilters;
  totalResults: number;
  totalAll: number;
}>();

const emit = defineEmits<{
  (e: 'update:filters', filters: FormationFilters): void;
  (e: 'reset'): void;
}>();

const showAdvancedFilters = ref(false);

const updateField = (key: keyof FormationFilters, value: any) => {
  emit('update:filters', {
    ...props.filters,
    [key]: value,
  });
};

const hasActiveFilters = () => {
  return (
    props.filters.search !== '' ||
    props.filters.category !== 'all' ||
    props.filters.level !== 'all' ||
    props.filters.type !== 'all' ||
    props.filters.cpfOnly === true ||
    props.filters.campus !== 'all'
  );
};
</script>

<template>
  <div class="search-bar-wrapper">
    <div class="container">
      <div class="search-box">
        <!-- Barre de recherche principale -->
        <div class="search-main-row">
          <div class="input-container">
            <svg class="search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              id="search-input"
              type="search"
              class="search-input-field"
              placeholder="Rechercher une formation (BTS SIO, Cybersécurité, ENI, CPF, Master, Cloud...)"
              :value="filters.search"
              @input="updateField('search', ($event.target as HTMLInputElement).value)"
              aria-label="Rechercher une formation"
            />
            <button
              v-if="filters.search"
              type="button"
              class="clear-btn"
              aria-label="Effacer la recherche"
              @click="updateField('search', '')"
            >
              ✕
            </button>
          </div>

          <!-- Bouton bascule filtres avancés -->
          <button
            type="button"
            class="toggle-filters-btn"
            :class="{ 'toggle-filters-btn--active': showAdvancedFilters || hasActiveFilters() }"
            @click="showAdvancedFilters = !showAdvancedFilters"
            :aria-expanded="showAdvancedFilters"
            aria-controls="advanced-filters"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span>Filtres détaillés</span>
            <span v-if="hasActiveFilters()" class="filter-count-badge">●</span>
          </button>
        </div>

        <!-- Filtres à facettes (dépliables pour filtrer plus en détail) -->
        <div
          v-show="showAdvancedFilters || hasActiveFilters()"
          id="advanced-filters"
          class="advanced-filters-panel"
        >
          <div class="filters-grid">
            <!-- Facette : Filière -->
            <div class="filter-col">
              <label for="filter-category" class="filter-label">Filière / Métier</label>
              <select
                id="filter-category"
                class="filter-select"
                :value="filters.category"
                @change="updateField('category', ($event.target as HTMLSelectElement).value)"
              >
                <option value="all">Toutes les filières</option>
                <option value="dev">💻 Informatique &amp; Développement Web</option>
                <option value="reseaux">🛡️ Systèmes, Réseaux &amp; Cybersécurité</option>
                <option value="marketing">🚀 Marketing Digital, Design &amp; Com</option>
                <option value="management">📈 Management IT &amp; Bureautique</option>
              </select>
            </div>

            <!-- Facette : Niveau RNCP -->
            <div class="filter-col">
              <label for="filter-level" class="filter-label">Niveau d'études</label>
              <select
                id="filter-level"
                class="filter-select"
                :value="filters.level"
                @change="updateField('level', ($event.target as HTMLSelectElement).value)"
              >
                <option value="all">Tous les niveaux</option>
                <option value="bac+2">Bac +2 (BTS SIO, Titre Pro)</option>
                <option value="bac+3">Bac +3 / Bac +4 (Bachelor, Titre ENI)</option>
                <option value="bac+5">Bac +5 (Mastère, Titre ESD/IPI)</option>
                <option value="certification">Certifications courtes / Éditeur</option>
              </select>
            </div>

            <!-- Facette : Campus -->
            <div class="filter-col">
              <label for="filter-campus" class="filter-label">Campus Réunion</label>
              <select
                id="filter-campus"
                class="filter-select"
                :value="filters.campus"
                @change="updateField('campus', ($event.target as HTMLSelectElement).value)"
              >
                <option value="all">Tous les campus (974)</option>
                <option value="Sainte-Clotilde">📍 Sainte-Clotilde (Nord)</option>
                <option value="Saint-Pierre">📍 Saint-Pierre (Sud)</option>
                <option value="Distanciel">🌐 Distanciel / Hybride</option>
              </select>
            </div>

            <!-- Facette : Éligible CPF -->
            <div class="filter-col filter-col--checkbox">
              <label class="cpf-toggle" for="filter-cpf">
                <input
                  id="filter-cpf"
                  type="checkbox"
                  class="cpf-checkbox"
                  :checked="filters.cpfOnly"
                  @change="updateField('cpfOnly', ($event.target as HTMLInputElement).checked)"
                />
                <span class="cpf-custom-check" aria-hidden="true"></span>
                <span class="cpf-text">
                  <strong>Financement CPF</strong>
                  <small>MonCompteFormation</small>
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Compteur et reset -->
        <div class="search-status-bar">
          <div class="counter-display" aria-live="polite">
            <span class="status-num">{{ totalResults }}</span>
            <span class="status-text">
              {{ totalResults === totalAll ? 'formations au catalogue' : 'formation(s) trouvée(s)' }}
            </span>
          </div>

          <button
            v-if="hasActiveFilters()"
            type="button"
            class="reset-btn"
            @click="emit('reset')"
          >
            Effacer les filtres
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-bar-wrapper {
  margin-top: -1.75rem;
  position: relative;
  z-index: 10;
  padding-bottom: 1.5rem;
}

.search-box {
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.75rem;
  box-shadow: 0 10px 25px -5px rgba(11, 26, 45, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.9);
  border-top: 3px solid var(--exp-orange);
}

.search-main-row {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 1.1rem;
  color: var(--exp-blue);
  pointer-events: none;
}

.search-input-field {
  width: 100%;
  padding: 0.85rem 2.8rem 0.85rem 3.25rem;
  font-size: 1.05rem;
  color: var(--color-text-main);
  background-color: var(--color-bg-inset);
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.search-input-field:focus {
  background-color: #ffffff;
  border-color: var(--exp-orange);
  box-shadow: 0 0 0 3px rgba(242, 140, 5, 0.18);
  outline: none;
}

.clear-btn {
  position: absolute;
  right: 0.85rem;
  background: rgba(0, 0, 0, 0.08);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.clear-btn:hover {
  background: rgba(0, 0, 0, 0.15);
}

.toggle-filters-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.25rem;
  background: var(--color-bg-inset);
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--exp-navy-900);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.toggle-filters-btn:hover {
  border-color: var(--exp-blue);
  color: var(--exp-blue);
}

.toggle-filters-btn--active {
  border-color: var(--exp-blue);
  background: var(--exp-blue-light);
  color: var(--exp-blue);
}

.filter-count-badge {
  color: var(--exp-orange);
  font-size: 1.1rem;
}

.advanced-filters-panel {
  padding-top: 1.25rem;
  margin-top: 1.25rem;
  border-top: 1px solid var(--color-border-subtle);
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1.25rem;
  align-items: flex-end;
}

.filter-col {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--exp-navy-900);
}

.filter-select {
  width: 100%;
  padding: 0.65rem 0.85rem;
  font-size: 0.92rem;
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: #ffffff;
  color: var(--color-text-main);
  cursor: pointer;
}

.filter-select:focus {
  border-color: var(--exp-orange);
  outline: none;
}

.filter-col--checkbox {
  justify-content: flex-end;
}

.cpf-toggle {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.85rem;
  background: var(--exp-blue-light);
  border: 1.5px solid rgba(69, 161, 195, 0.4);
  border-radius: var(--radius-md);
  cursor: pointer;
  user-select: none;
}

.cpf-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
}

.cpf-custom-check {
  width: 20px;
  height: 20px;
  border: 2px solid var(--exp-blue);
  border-radius: 4px;
  background: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.cpf-checkbox:checked + .cpf-custom-check {
  background-color: var(--exp-blue);
  border-color: var(--exp-blue);
}

.cpf-checkbox:checked + .cpf-custom-check::after {
  content: '✓';
  color: #ffffff;
  font-size: 13px;
  font-weight: 900;
}

.cpf-text {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
  line-height: 1.2;
  color: var(--exp-navy-900);
}

.cpf-text small {
  font-size: 0.72rem;
  color: var(--exp-blue-hover);
}

.search-status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--color-border-subtle);
  font-size: 0.9rem;
}

.counter-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--exp-navy-950);
  color: #ffffff;
  font-weight: 800;
  padding: 0.15rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
}

.status-text {
  color: var(--color-text-muted);
  font-weight: 600;
}

.reset-btn {
  background: none;
  border: none;
  color: var(--exp-orange);
  font-weight: 700;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}

.reset-btn:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .search-main-row {
    flex-direction: column;
  }
  .toggle-filters-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
