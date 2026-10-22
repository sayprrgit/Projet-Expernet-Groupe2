<script setup lang="ts">
import type { Accent } from '@/data/univers';

withDefaults(
  defineProps<{
    eyebrow?: string;
    title: string;
    description?: string;
    accent?: Accent;
    compact?: boolean;
    image?: string;
    imageAlt?: string;
  }>(),
  { accent: 'orange', compact: false },
);
</script>

<template>
  <section
    class="page-hero"
    :class="[`accent-${accent}`, { 'page-hero--compact': compact, 'page-hero--with-image': image }]"
  >
    <div class="page-hero__glow" aria-hidden="true"></div>
    <div class="container page-hero__inner">
      <div class="page-hero__text">
        <p v-if="eyebrow" class="page-hero__eyebrow">{{ eyebrow }}</p>
        <h1 class="page-hero__title">{{ title }}</h1>
        <p v-if="description" class="page-hero__desc">{{ description }}</p>
        <div v-if="$slots.actions" class="page-hero__actions">
          <slot name="actions" />
        </div>
        <slot />
      </div>

      <figure v-if="image" class="page-hero__figure">
        <img :src="image" :alt="imageAlt || title" loading="lazy" decoding="async" />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  overflow: hidden;
  color: #ffffff;
  padding: 4rem 0 3.25rem;
  background: linear-gradient(180deg, var(--exp-blue-dark) 0%, var(--exp-navy-950) 100%);
  border-bottom: 3px solid var(--accent);
}

.page-hero--compact {
  padding: 3rem 0 2.5rem;
}

.page-hero__glow {
  position: absolute;
  top: -60%;
  right: -10%;
  width: 640px;
  height: 640px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent) 0%, transparent 65%);
  opacity: 0.22;
  filter: blur(70px);
  pointer-events: none;
}

.page-hero__inner {
  position: relative;
  z-index: 1;
  max-width: 860px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
  align-items: center;
}

.page-hero:not(.page-hero--with-image) .page-hero__inner {
  max-width: 920px;
  text-align: center;
  justify-items: center;
}

.page-hero:not(.page-hero--with-image) .page-hero__text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-hero:not(.page-hero--with-image) .page-hero__eyebrow {
  margin-left: auto;
  margin-right: auto;
}

.page-hero:not(.page-hero--with-image) .page-hero__title {
  text-align: center;
}

.page-hero:not(.page-hero--with-image) .page-hero__desc {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.page-hero:not(.page-hero--with-image) .page-hero__actions {
  justify-content: center;
}


.page-hero--with-image .page-hero__inner {
  max-width: 1180px;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
}

.page-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--accent) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-hero__title {
  font-size: clamp(1.9rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.page-hero__desc {
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.82);
  max-width: 68ch;
}

.page-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.75rem;
}

.page-hero__actions :deep(.btn--outline) {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.45);
}

.page-hero__actions :deep(.btn--outline:hover) {
  background: rgba(255, 255, 255, 0.12);
  border-color: #ffffff;
  color: #ffffff;
}

.page-hero__figure {
  position: relative;
  margin: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: var(--shadow-xl);
}

.page-hero__figure img {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 420px;
  object-fit: cover;
}

@media (max-width: 900px) {
  .page-hero--with-image .page-hero__inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .page-hero__figure img {
    max-height: 260px;
  }
}
</style>
