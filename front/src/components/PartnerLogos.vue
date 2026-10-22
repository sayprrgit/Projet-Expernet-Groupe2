<script setup lang="ts">
import { PARTNER_LOGOS } from '@/data/images';
</script>

<template>
  <div class="partners-marquee" aria-label="Logos de nos partenaires">
    <div class="partners-track">
      <div v-for="partner in PARTNER_LOGOS" :key="`a-${partner.name}`" class="partner-item">
        <img :src="partner.image" :alt="partner.name" loading="lazy" decoding="async" />
      </div>
      <div v-for="partner in PARTNER_LOGOS" :key="`b-${partner.name}`" class="partner-item" aria-hidden="true">
        <img :src="partner.image" :alt="partner.name" loading="lazy" decoding="async" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.partners-marquee {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-subtle);
  background: var(--color-bg-inset);
  padding: 0.9rem 0;
  margin: 1.25rem 0;
  mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
}

.partners-marquee::before,
.partners-marquee::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  z-index: 1;
  pointer-events: none;
}

.partners-marquee::before {
  left: 0;
  background: linear-gradient(90deg, var(--color-bg-inset) 0%, transparent 100%);
}

.partners-marquee::after {
  right: 0;
  background: linear-gradient(90deg, transparent 0%, var(--color-bg-inset) 100%);
}

.partners-track {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  width: max-content;
  animation: partners-scroll 24s linear infinite;
  will-change: transform;
}

.partners-marquee:hover .partners-track {
  animation-play-state: paused;
}

.partner-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  height: 52px;
}

.partner-item img {
  height: 40px;
  width: auto;
  max-width: 140px;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.8;
}

@keyframes partners-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (max-width: 640px) {
  .partners-track {
    gap: 1.8rem;
    animation-duration: 18s;
  }

  .partner-item {
    min-width: 130px;
  }

  .partner-item img {
    height: 34px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .partners-track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .partners-marquee {
    mask-image: none;
    -webkit-mask-image: none;
  }

  .partners-marquee::before,
  .partners-marquee::after {
    display: none;
  }
}
</style>
