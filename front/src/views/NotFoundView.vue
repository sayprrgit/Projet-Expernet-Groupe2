<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue';
</script>

<template>
  <section class="not-found">
    <div class="container not-found__inner">
      <p class="not-found__code">404</p>
      <h1>Cette page n’existe pas (encore)</h1>
      <p class="not-found__text">
        Le lien est peut-être obsolète ou la page a été déplacée. Retrouvez votre chemin depuis l’accueil ou le
        catalogue des formations.
      </p>
      <div class="not-found__actions">
        <BaseButton to="/" size="lg">Retour à l’accueil</BaseButton>
        <BaseButton to="/formations" variant="outline" size="lg">Voir les formations</BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 5rem 0;
  background: var(--color-bg-page);
}

.not-found__inner {
  max-width: 640px;
  text-align: center;
}

.not-found__code {
  font-size: clamp(4rem, 12vw, 7rem);
  font-weight: 900;
  line-height: 1;
  color: var(--exp-orange);
  letter-spacing: -0.04em;
}

.not-found h1 {
  margin: 0.5rem 0 0.75rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 900;
  color: var(--exp-navy-950);
}

.not-found__text {
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  justify-content: center;
}
</style>
