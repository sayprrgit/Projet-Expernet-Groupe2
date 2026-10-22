<script setup lang="ts">
defineProps<{
  activeType: string;
}>();

const emit = defineEmits<{
  (e: 'selectType', type: string): void;
}>();
</script>

<template>
  <section class="hero" aria-labelledby="hero-heading">
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="container hero__inner">
      <div class="hero__content">
        <!-- Badges d'ancrage régional & certification -->
        <div class="hero__badges">
          <span class="badge badge--tech">
            <span class="badge-dot"></span>
            La Réunion • Le Port &amp; Sainte-Clotilde &amp; Saint-Pierre
          </span>
          <span class="badge badge--qualiopi">
            CFA Qualiopi • Titres RNCP d'État &amp; Partenaires ENI, IPI, ESD, Digital Campus
          </span>
        </div>

        <h1 id="hero-heading" class="hero__title">
          L'écosystème <span class="highlight-orange">Tech &amp; Digital</span> de référence à <span class="highlight-blue">La Réunion</span>
        </h1>

        <p class="hero__subtitle">
          Découvrez toutes nos formations : <strong>Expernet Campus</strong> pour vos diplômes du Bac+2 au Bac+5 en alternance 100% financée et <strong>Expernet Pro</strong> pour la montée en compétences, les certifications éditeurs et le CPF.
        </p>

        <!-- Sélecteur rapide d'univers -->
        <div class="hero__switcher" role="tablist" aria-label="Filtrer l'affichage par univers">
          <button
            type="button"
            role="tab"
            :aria-selected="activeType === 'all'"
            class="switch-btn"
            :class="{ 'switch-btn--active': activeType === 'all' }"
            @click="emit('selectType', 'all')"
          >
            <span class="switch-icon">🌐</span>
            <span>Toutes les formations</span>
          </button>

          <button
            type="button"
            role="tab"
            :aria-selected="activeType === 'campus'"
            class="switch-btn switch-btn--campus"
            :class="{ 'switch-btn--active': activeType === 'campus' }"
            @click="emit('selectType', 'campus')"
          >
            <span class="switch-icon">🎓</span>
            <span>Expernet Campus (Alternance)</span>
          </button>

          <button
            type="button"
            role="tab"
            :aria-selected="activeType === 'pro'"
            class="switch-btn switch-btn--pro"
            :class="{ 'switch-btn--active': activeType === 'pro' }"
            @click="emit('selectType', 'pro')"
          >
            <span class="switch-icon">💼</span>
            <span>Expernet Pro (CPF &amp; Salariés)</span>
          </button>
        </div>

        <!-- Chiffres clés / Réassurance -->
        <div class="hero__stats">
          <div class="stat-card">
            <span class="stat-value">92%</span>
            <span class="stat-label">Taux d'insertion en entreprise à La Réunion</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">+20 ans</span>
            <span class="stat-label">Pionnier de la formation tech depuis 2002</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">0€</span>
            <span class="stat-label">Frais de scolarité en alternance</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">100%</span>
            <span class="stat-label">Titres certifiés RNCP &amp; Diplômes d'État</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  background: linear-gradient(180deg, var(--exp-navy-950) 0%, var(--exp-navy-900) 100%);
  color: #ffffff;
  padding: 4.5rem 0 3.5rem;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.hero__glow {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 850px;
  height: 420px;
  background: radial-gradient(circle, rgba(242, 140, 5, 0.18) 0%, rgba(69, 161, 195, 0.15) 50%, transparent 80%);
  pointer-events: none;
  filter: blur(80px);
}

.hero__content {
  position: relative;
  z-index: 2;
  max-width: 980px;
  margin: 0 auto;
  text-align: center;
}

.hero__badges {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.badge--tech {
  background: var(--exp-blue-subtle);
  color: #7dd3fc;
  border: 1px solid rgba(69, 161, 195, 0.4);
}

.badge-dot {
  width: 7px;
  height: 7px;
  background: var(--exp-blue);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--exp-blue);
}

.badge--qualiopi {
  background: var(--exp-orange-subtle);
  color: #fbcfe8;
  color: #fed7aa;
  border: 1px solid rgba(242, 140, 5, 0.4);
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  line-height: 1.18;
  letter-spacing: -0.03em;
  margin-bottom: 1.25rem;
}

.highlight-orange {
  color: var(--exp-orange);
}

.highlight-blue {
  color: var(--exp-blue);
}

.hero__subtitle {
  font-size: clamp(1.05rem, 2vw, 1.2rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
  max-width: 820px;
  margin: 0 auto 2.5rem;
}

.hero__subtitle strong {
  color: #ffffff;
}

.hero__switcher {
  display: inline-flex;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.4rem;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.12);
  gap: 0.35rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 3.5rem;
}

.switch-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.2rem;
  border-radius: var(--radius-md);
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.92rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.switch-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.switch-btn--active {
  background: var(--exp-orange);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(242, 140, 5, 0.4);
}

.switch-btn--active.switch-btn--pro {
  background: var(--exp-blue);
  box-shadow: 0 4px 14px rgba(69, 161, 195, 0.4);
}

.switch-icon {
  font-size: 1.1rem;
}

.hero__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: var(--exp-blue);
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  line-height: 1.3;
}

@media (max-width: 640px) {
  .hero {
    padding: 3.5rem 0 2rem;
  }
  .switch-btn {
    width: 100%;
    justify-content: center;
  }
  .hero__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
