<script setup lang="ts">
import type { Formation } from '@/types/formation';

defineProps<{
  formation: Formation;
}>();

const emit = defineEmits<{
  (e: 'viewDetails', formation: Formation): void;
  (e: 'apply', formation: Formation): void;
}>();
</script>

<template>
  <article class="formation-card" :aria-labelledby="`card-title-${formation.id}`">
    <div class="formation-card__header">
      <!-- Badges du haut -->
      <div class="card-badges">
        <span class="badge badge--level">
          {{ formation.levelLabel }}
        </span>
        <span v-if="formation.isAlternance" class="badge badge--alternance">
          ⚡ 100% Alternance
        </span>
        <span v-if="formation.isCpfEligible" class="badge badge--cpf">
          Éligible CPF
        </span>
      </div>

      <span v-if="formation.badge" class="badge-feature">
        {{ formation.badge }}
      </span>
    </div>

    <div class="formation-card__body">
      <span class="formation-category">{{ formation.categoryLabel }}</span>
      <h3 :id="`card-title-${formation.id}`" class="formation-title">
        {{ formation.title }}
      </h3>
      <p class="formation-desc">
        {{ formation.shortDescription }}
      </p>

      <!-- Métadonnées clés -->
      <ul class="formation-meta" aria-label="Informations pratiques">
        <li class="meta-item">
          <span class="meta-icon" aria-hidden="true">⏱️</span>
          <span><strong>Durée :</strong> {{ formation.duration }}</span>
        </li>
        <li class="meta-item">
          <span class="meta-icon" aria-hidden="true">📅</span>
          <span><strong>Rythme :</strong> {{ formation.pace }}</span>
        </li>
        <li class="meta-item">
          <span class="meta-icon" aria-hidden="true">📍</span>
          <span><strong>Campus :</strong> {{ formation.campus.join(', ') }}</span>
        </li>
      </ul>

      <!-- Débouchés métiers phares -->
      <div class="formation-outcomes">
        <span class="outcomes-label">Débouchés métiers :</span>
        <div class="outcomes-tags">
          <span
            v-for="(job, index) in formation.careerOutcomes.slice(0, 3)"
            :key="index"
            class="outcome-tag"
          >
            {{ job }}
          </span>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="formation-card__footer">
      <button
        type="button"
        class="btn btn--outline"
        :aria-haspopup="'dialog'"
        :aria-label="`Consulter la fiche détaillée de ${formation.title}`"
        @click="emit('viewDetails', formation)"
      >
        <span>Fiche détaillée</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      <button
        type="button"
        class="btn btn--primary"
        :aria-label="`Candidater à la formation ${formation.title}`"
        @click="emit('apply', formation)"
      >
        <span>Candidater</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  </article>
</template>

<style scoped>
.formation-card {
  display: flex;
  flex-direction: column;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-subtle);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(11, 26, 45, 0.04);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.formation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px -8px rgba(11, 26, 45, 0.12);
  border-color: rgba(242, 140, 5, 0.4);
}

.formation-card__header {
  padding: 1.25rem 1.25rem 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-badges {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.badge--level {
  background: rgba(11, 26, 45, 0.08);
  color: var(--exp-navy-900);
}

.badge--alternance {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.badge--cpf {
  background: var(--exp-blue-light);
  color: var(--exp-blue-dark);
  border: 1px solid rgba(69, 161, 195, 0.3);
}

.badge-feature {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--exp-orange-dark);
  background: var(--exp-orange-light);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(242, 140, 5, 0.2);
}

.formation-card__body {
  padding: 0.85rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.formation-category {
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--exp-orange);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.4rem;
}

.formation-title {
  font-size: 1.18rem;
  font-weight: 800;
  color: var(--exp-navy-950);
  line-height: 1.35;
  margin-bottom: 0.65rem;
}

.formation-desc {
  font-size: 0.92rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.formation-meta {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.85rem 1rem;
  background: var(--color-bg-page);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-main);
}

.meta-icon {
  font-size: 0.95rem;
}

.formation-outcomes {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.outcomes-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-light);
  text-transform: uppercase;
}

.outcomes-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.outcome-tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  background: #f1f5f9;
  color: var(--exp-navy-800);
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.formation-card__footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 1.15rem 1.25rem;
  background: #fafcff;
  border-top: 1px solid var(--color-border-subtle);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 0.85rem;
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn--outline {
  background: transparent;
  color: var(--exp-navy-900);
  border: 1.5px solid var(--color-border-strong);
}

.btn--outline:hover {
  background: var(--exp-blue-light);
  color: var(--exp-blue-dark);
  border-color: var(--exp-blue);
}

.btn--primary {
  background: var(--exp-orange);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(242, 140, 5, 0.3);
}

.btn--primary:hover {
  background: var(--exp-orange-hover);
}
</style>
