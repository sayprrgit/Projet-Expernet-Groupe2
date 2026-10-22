<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Formation } from '@/types/formation';

const props = defineProps<{
  formation: Formation | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'apply', formation: Formation): void;
}>();

const closeButtonRef = ref<HTMLButtonElement | null>(null);

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    closeButtonRef.value?.focus();
  }, 50);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  document.body.style.overflow = '';
});

const onApply = () => {
  if (props.formation) {
    emit('apply', props.formation);
    emit('close');
  }
};
</script>

<template>
  <div
    v-if="formation"
    class="modal-backdrop"
    @click.self="emit('close')"
  >
    <div
      class="modal-dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`modal-title-${formation.id}`"
    >
      <!-- En-tête de la modale -->
      <header class="modal-header">
        <div class="modal-header__meta">
          <span class="badge badge--level">{{ formation.levelLabel }}</span>
          <span v-if="formation.rncpCode" class="badge badge--rncp">
            Code RNCP : {{ formation.rncpCode }}
          </span>
          <span v-if="formation.isCpfEligible" class="badge badge--cpf">
            Éligible CPF
          </span>
        </div>

        <button
          ref="closeButtonRef"
          type="button"
          class="modal-close-btn"
          aria-label="Fermer la fiche détaillée"
          @click="emit('close')"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 :id="`modal-title-${formation.id}`" class="modal-title">
          {{ formation.title }}
        </h2>
        <p class="modal-partner">
          🎓 Organisme certificateur : <strong>{{ formation.certifyingPartner }}</strong>
        </p>
      </header>

      <!-- Corps de la fiche -->
      <div class="modal-body">
        <!-- Bandeau d'infos clés -->
        <div class="quick-facts">
          <div class="fact-box">
            <span class="fact-title">Type d'offre</span>
            <span class="fact-desc">{{ formation.typeLabel }}</span>
          </div>
          <div class="fact-box">
            <span class="fact-title">Durée</span>
            <span class="fact-desc">{{ formation.duration }}</span>
          </div>
          <div class="fact-box">
            <span class="fact-title">Rythme</span>
            <span class="fact-desc">{{ formation.pace }}</span>
          </div>
          <div class="fact-box">
            <span class="fact-title">Lieu(x)</span>
            <span class="fact-desc">{{ formation.campus.join(', ') }}</span>
          </div>
        </div>

        <!-- Section 1 : Prérequis -->
        <section class="modal-section" aria-labelledby="section-prereq">
          <h3 id="section-prereq" class="section-title">
            <span class="section-icon" aria-hidden="true">📋</span>
            Prérequis d'admission
          </h3>
          <ul class="modal-list">
            <li v-for="(item, idx) in formation.prerequisites" :key="idx">
              {{ item }}
            </li>
          </ul>
        </section>

        <!-- Section 2 : Objectifs pédagogiques -->
        <section class="modal-section" aria-labelledby="section-objectives">
          <h3 id="section-objectives" class="section-title">
            <span class="section-icon" aria-hidden="true">🎯</span>
            Objectifs pédagogiques &amp; Compétences visées
          </h3>
          <ul class="modal-list modal-list--check">
            <li v-for="(item, idx) in formation.objectives" :key="idx">
              {{ item }}
            </li>
          </ul>
        </section>

        <!-- Section 3 : Modalités d'accès -->
        <section class="modal-section" aria-labelledby="section-modalities">
          <h3 id="section-modalities" class="section-title">
            <span class="section-icon" aria-hidden="true">🚀</span>
            Modalités d'accès &amp; Processus d'admission
          </h3>
          <ul class="modal-list">
            <li v-for="(item, idx) in formation.admissionModalities" :key="idx">
              {{ item }}
            </li>
          </ul>
        </section>

        <!-- Section 4 : Débouchés métiers -->
        <section class="modal-section" aria-labelledby="section-outcomes">
          <h3 id="section-outcomes" class="section-title">
            <span class="section-icon" aria-hidden="true">💼</span>
            Débouchés professionnels &amp; Métiers
          </h3>
          <div class="careers-chips">
            <span
              v-for="(job, idx) in formation.careerOutcomes"
              :key="idx"
              class="career-chip"
            >
              {{ job }}
            </span>
          </div>
        </section>
      </div>

      <!-- Pied de la modale -->
      <footer class="modal-footer">
        <button
          type="button"
          class="btn btn--secondary"
          @click="emit('close')"
        >
          Fermer
        </button>

        <button
          type="button"
          class="btn btn--primary"
          @click="onApply"
        >
          <span>Candidater à cette formation</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background-color: rgba(11, 26, 45, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-dialog {
  background: #ffffff;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl), 0 0 0 1px rgba(255, 255, 255, 0.2);
  overflow: hidden;
  animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  position: relative;
  padding: 1.75rem 2rem 1.25rem;
  background: var(--exp-navy-950);
  color: #ffffff;
  border-bottom: 3px solid var(--exp-orange);
}

.modal-header__meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
}

.badge--level {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.badge--rncp {
  background: var(--exp-blue-subtle);
  color: #7dd3fc;
  border: 1px solid var(--exp-blue);
}

.badge--cpf {
  background: var(--exp-orange-subtle);
  color: #fed7aa;
  border: 1px solid var(--exp-orange);
}

.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-title {
  font-size: 1.55rem;
  font-weight: 900;
  line-height: 1.3;
  color: #ffffff;
  margin-bottom: 0.5rem;
  padding-right: 2rem;
}

.modal-partner {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.8);
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.quick-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  background: var(--color-bg-page);
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
}

.fact-box {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.fact-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--exp-blue);
  text-transform: uppercase;
}

.fact-desc {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--exp-navy-950);
}

.modal-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--exp-navy-900);
}

.section-icon {
  font-size: 1.15rem;
}

.modal-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-list li {
  position: relative;
  padding-left: 1.5rem;
  font-size: 0.95rem;
  color: var(--color-text-main);
  line-height: 1.5;
}

.modal-list li::before {
  content: '•';
  position: absolute;
  left: 0.5rem;
  color: var(--exp-orange);
  font-weight: 900;
  font-size: 1.2rem;
  line-height: 1;
}

.modal-list--check li::before {
  content: '✓';
  color: #047857;
  font-size: 0.95rem;
  left: 0.35rem;
}

.careers-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.career-chip {
  padding: 0.4rem 0.85rem;
  background: var(--exp-blue-light);
  color: var(--exp-blue-dark);
  border: 1px solid rgba(69, 161, 195, 0.3);
  border-radius: var(--radius-full);
  font-size: 0.88rem;
  font-weight: 700;
}

.modal-footer {
  padding: 1.25rem 2rem;
  background: #fafcff;
  border-top: 1px solid var(--color-border-subtle);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.4rem;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn--secondary {
  background: var(--color-bg-page);
  color: var(--exp-navy-900);
  border: 1px solid var(--color-border-strong);
}

.btn--secondary:hover {
  background: #e2e8f0;
}

.btn--primary {
  background: var(--exp-orange);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(242, 140, 5, 0.4);
}

.btn--primary:hover {
  background: var(--exp-orange-hover);
  transform: translateY(-1px);
}
</style>
