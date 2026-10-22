<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { IMAGES } from '@/data/images';

const route = useRoute();
const isMenuOpen = ref(false);
const isSpacesOpen = ref(false);

const NAV_LINKS = [
  { label: 'Accueil', to: '/' },
  { label: 'Formations', to: '/formations' },
  { label: 'Campus', to: '/campus' },
  { label: 'Pro', to: '/expernet-pro' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Planning', to: '/planning' },
];

const SPACES = [
  { label: 'GALIA — Espace apprenant', to: '/galia' },
  { label: 'Teams — Espace collaboratif', to: '/teams' },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
  isSpacesOpen.value = false;
};

watch(() => route.fullPath, closeMenu);
</script>

<template>
  <header class="navbar" role="banner">
    <div class="container navbar__inner">
      <RouterLink to="/" class="brand-link" aria-label="Accueil Expernet et Expernet Campus Réunion">
        <span class="brand-logo-badge">
          <img class="brand-mark" :src="IMAGES.logoMarkWhite" alt="Logo Expernet" width="44" height="42" />
          <span class="brand-text">
            <span class="brand-title">EXPERNET</span>
            <span class="brand-subtitle">CAMPUS &amp; PRO • LA RÉUNION</span>
          </span>
        </span>
      </RouterLink>

      <nav class="navbar__nav" aria-label="Navigation principale">
        <ul class="nav-list">
          <li v-for="link in NAV_LINKS" :key="link.to">
            <RouterLink :to="link.to" class="nav-link">{{ link.label }}</RouterLink>
          </li>
          <li class="nav-item--dropdown" @mouseleave="isSpacesOpen = false">
            <button
              type="button"
              class="nav-link nav-link--button"
              :aria-expanded="isSpacesOpen"
              aria-haspopup="true"
              @click="isSpacesOpen = !isSpacesOpen"
            >
              Espaces
              <span class="nav-caret" aria-hidden="true">▾</span>
            </button>
            <ul v-show="isSpacesOpen" class="nav-dropdown">
              <li v-for="space in SPACES" :key="space.to">
                <RouterLink :to="space.to" class="nav-dropdown__link" @click="isSpacesOpen = false">
                  {{ space.label }}
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div class="navbar__actions">
        <RouterLink to="/candidature" class="btn btn--primary">
          <span>Candidater</span>
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </RouterLink>

        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="isMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'"
          @click="toggleMenu"
        >
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
        </button>
      </div>
    </div>

    <div
      v-if="isMenuOpen"
      id="mobile-menu"
      class="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu mobile"
    >
      <div class="container mobile-menu__inner">
        <nav aria-label="Navigation mobile">
          <ul class="mobile-nav-list">
            <li v-for="link in [...NAV_LINKS, ...SPACES]" :key="link.to">
              <RouterLink :to="link.to" class="mobile-nav-link" @click="closeMenu">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>
        <div class="mobile-menu__cta">
          <RouterLink to="/candidature" class="btn btn--primary btn--full" @click="closeMenu">
            Candidater
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(11, 26, 45, 0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 2px solid var(--exp-orange);
  color: var(--color-text-white);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 76px;
  gap: 1.5rem;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.brand-logo-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-mark {
  display: block;
  height: 42px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.45rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #ffffff;
  line-height: 1.1;
}

.brand-subtitle {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--exp-blue);
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 1.35rem;
  list-style: none;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.2s ease;
  padding: 0.5rem 0.25rem;
  position: relative;
}

.nav-link:hover {
  color: var(--exp-orange);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: var(--exp-orange);
  transition: width 0.2s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link.router-link-active {
  color: var(--exp-orange);
}

.nav-link.router-link-active::after {
  width: 100%;
}

.nav-item--dropdown {
  position: relative;
}

.nav-link--button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.nav-caret {
  font-size: 0.7rem;
  margin-left: 0.1rem;
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 50%;
  transform: translateX(-50%);
  min-width: 270px;
  padding: 0.5rem;
  list-style: none;
  background: var(--exp-navy-900);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top: 2px solid var(--exp-orange);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  z-index: 20;
}

.nav-dropdown__link {
  display: block;
  padding: 0.7rem 0.85rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}

.nav-dropdown__link:hover,
.nav-dropdown__link.router-link-active {
  background: rgba(255, 255, 255, 0.08);
  color: var(--exp-orange);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.65rem 1.35rem;
  border-radius: var(--radius-md);
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn--primary {
  background: var(--exp-orange);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(242, 140, 5, 0.4);
}

.btn--primary:hover {
  background: var(--exp-orange-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(242, 140, 5, 0.5);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
}

.menu-bar {
  width: 100%;
  height: 2px;
  background: #ffffff;
  border-radius: 2px;
}

@media (max-width: 1100px) {
  .navbar__nav {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .mobile-menu {
    position: absolute;
    top: 76px;
    left: 0;
    right: 0;
    background: var(--exp-navy-950);
    border-bottom: 2px solid var(--exp-orange);
    padding: 1.5rem 0 2rem;
    box-shadow: var(--shadow-xl);
  }

  .mobile-nav-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .mobile-nav-link {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .mobile-nav-link:hover {
    color: var(--exp-orange);
  }

  .mobile-nav-link.router-link-active {
    color: var(--exp-orange);
  }

  .btn--full {
    width: 100%;
  }
}
</style>
