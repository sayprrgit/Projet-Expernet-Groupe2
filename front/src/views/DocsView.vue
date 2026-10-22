<script setup lang="ts">
import { RouterLink } from 'vue-router';
import SwaggerUI from '@/components/SwaggerUI.vue';

const specUrl = '/api/openapi.json';
</script>

<template>
  <div class="docs-page">
    <header class="docs-navbar">
      <div class="container docs-navbar__inner">
        <RouterLink to="/" class="back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Retour au portail Expernet</span>
        </RouterLink>
        <span class="docs-tag">Swagger UI / OpenAPI v3</span>
      </div>
    </header>

    <div class="container docs-container">
      <div class="docs__header">
        <h1>Documentation interactive de l'API</h1>
        <p class="docs__intro">
          Spécification OpenAPI générée par le backend NestJS pour le portail Expernet.
          <a :href="specUrl" target="_blank" rel="noopener" class="json-link">Voir le spec JSON brut</a>
        </p>
      </div>

      <SwaggerUI :url="specUrl" />
    </div>
  </div>
</template>

<style scoped>
.docs-page {
  min-height: 100vh;
  background: #ffffff;
}

.docs-navbar {
  background: var(--exp-navy-950);
  color: #ffffff;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.docs-navbar__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.1);
  transition: background 0.2s ease;
}

.back-link:hover {
  background: var(--exp-orange-500);
}

.docs-tag {
  font-size: 0.8rem;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-full);
}

.docs-container {
  padding: 2.5rem 1.5rem 4rem;
}

.docs__header {
  margin-bottom: 2rem;
}

.docs__header h1 {
  font-size: 2rem;
  font-weight: 900;
  color: var(--exp-navy-950);
  margin-bottom: 0.5rem;
}

.docs__intro {
  font-size: 1rem;
  color: var(--color-text-muted);
}

.json-link {
  color: var(--exp-orange-500);
  font-weight: 600;
  margin-left: 0.5rem;
  text-decoration: underline;
}
</style>
