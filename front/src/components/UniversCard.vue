<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Univers } from '@/data/univers';

defineProps<{
  univers: Univers;
}>();
</script>

<template>
  <article class="univers-card" :class="`accent-${univers.accent}`">
    <figure class="univers-card__media">
      <img :src="univers.image" :alt="univers.name" loading="lazy" decoding="async" />
    </figure>

    <header class="univers-card__head">
      <span class="univers-card__icon" aria-hidden="true">{{ univers.icon }}</span>
      <span class="univers-card__label">{{ univers.label }}</span>
    </header>

    <h3 class="univers-card__title">{{ univers.name }}</h3>
    <p class="univers-card__tagline">{{ univers.tagline }}</p>
    <p class="univers-card__desc">{{ univers.description }}</p>

    <ul class="univers-card__list">
      <li v-for="item in univers.highlights" :key="item">{{ item }}</li>
    </ul>

    <RouterLink :to="univers.route" class="univers-card__link">
      {{ univers.cta }}
      <span aria-hidden="true">→</span>
    </RouterLink>
  </article>
</template>

<style scoped>
.univers-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0 1.75rem 1.75rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-subtle);
  border-top: 4px solid var(--accent);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.univers-card__media {
  margin: 0 -1.75rem 0.75rem;
  overflow: hidden;
}

.univers-card__media img {
  display: block;
  width: 100%;
  height: 190px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.univers-card:hover .univers-card__media img {
  transform: scale(1.05);
}

.univers-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.univers-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.univers-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 1.35rem;
  border-radius: 12px;
  background: var(--accent-soft);
}

.univers-card__label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-strong);
}

.univers-card__title {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--color-text-main);
  margin-top: 0.35rem;
}

.univers-card__tagline {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--accent-strong);
}

.univers-card__desc {
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.univers-card__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin: 0.5rem 0 1rem;
}

.univers-card__list li {
  position: relative;
  padding-left: 1.35rem;
  font-size: 0.88rem;
  color: var(--color-text-main);
}

.univers-card__list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-strong);
  font-weight: 900;
}

.univers-card__link {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--accent-strong);
}

.univers-card__link:hover {
  gap: 0.7rem;
}
</style>
