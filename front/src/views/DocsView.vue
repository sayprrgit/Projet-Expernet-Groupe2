<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SwaggerUI from '@/components/SwaggerUI.vue';

const specUrl = '/api/openapi.json';
</script>

<template>
  <div class="docs-page">
    <div class="container docs-container">
      <div class="docs__header">
        <span class="docs-tag">Swagger UI / OpenAPI v3</span>
        <h1>Documentation interactive de l’API</h1>
        <p class="docs__intro">
          Spécification OpenAPI générée par le backend NestJS pour le portail Expernet.
          <a :href="specUrl" target="_blank" rel="noopener" class="json-link">Voir le spec JSON brut</a>
        </p>
        <RouterLink to="/" class="back-link">← Retour au portail Expernet</RouterLink>
      </div>

      <SwaggerUI :url="specUrl" />
    </div>
  </div>
</template>

<style scoped>
.docs-page {
  background: #ffffff;
}

.docs-container {
  padding: 2.5rem 1.5rem 4rem;
}

.docs__header {
  margin-bottom: 2rem;
}

.docs-tag {
  display: inline-block;
  margin-bottom: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  background: rgba(56, 189, 248, 0.15);
  color: #0369a1;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.docs__header h1 {
  margin-bottom: 0.5rem;
  font-size: clamp(1.6rem, 3vw, 2rem);
  font-weight: 900;
  color: var(--exp-navy-950);
}

.docs__intro {
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--color-text-muted);
}

.json-link {
  margin-left: 0.5rem;
  color: var(--exp-orange-dark);
  font-weight: 700;
  text-decoration: underline;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--exp-navy-900);
}

.back-link:hover {
  color: var(--exp-orange-dark);
}
</style>
