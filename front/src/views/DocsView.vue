<script setup lang="ts">
import SwaggerUI from '@/components/SwaggerUI.vue'

const specUrl = '/api/openapi.json'
</script>

<template>
  <section class="docs">
    <div class="docs__header">
      <h1>Documentation de l'API</h1>
      <p class="docs__intro">
        Spécification OpenAPI générée par le backend NestJS.
        <a :href="specUrl" target="_blank" rel="noopener">Voir le spec JSON brut</a>
      </p>
    </div>

    <SwaggerUI :url="specUrl" />
  </section>
</template>

<style scoped>
.docs {
  grid-column: 1 / -1;
  width: 100%;
}

.docs__header {
  margin-bottom: 1.5rem;
}

.docs__intro {
  color: var(--color-text);
  opacity: 0.75;
}
</style>
