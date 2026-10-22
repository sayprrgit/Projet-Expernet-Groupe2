<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <header class="navbar" role="banner">
    <!-- Skip link pour conformité RGAA -->
    <a href="#formations" class="skip-link">Aller directement aux formations</a>
    <a href="#candidature-section" class="skip-link">Aller au formulaire de candidature</a>

    <div class="container navbar__inner">
      <div class="navbar__brand">
        <a href="#top" class="brand-link" aria-label="Accueil Expernet et Expernet Campus Réunion">
          <div class="brand-logo-badge">
            <span class="brand-icon">⚡</span>
            <div class="brand-text">
              <span class="brand-title">EXPERNET</span>
              <span class="brand-subtitle">CAMPUS &amp; PRO • LA RÉUNION</span>
            </div>
          </div>
        </a>
      </div>

      <!-- Navigation desktop sans api doc -->
      <nav class="navbar__nav" aria-label="Navigation principale">
        <ul class="nav-list">
          <li>
            <a href="#formations" class="nav-link">Toutes les Formations</a>
          </li>
          <li>
            <a href="#expernet-campus" class="nav-link">Expernet Campus (Alternance)</a>
          </li>
          <li>
            <a href="#expernet-pro" class="nav-link">Expernet Pro (CPF &amp; Salariés)</a>
          </li>
          <li>
            <a href="#candidature-section" class="nav-link">Candidature</a>
          </li>
        </ul>
      </nav>

      <!-- CTA -->
      <div class="navbar__actions">
        <a href="#candidature-section" class="btn btn--primary">
          <span>Candidater</span>
          <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>

        <!-- Bouton menu mobile -->
        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Ouvrir le menu de navigation"
          @click="toggleMenu"
        >
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
        </button>
      </div>
    </div>

    <!-- Menu mobile déroulant -->
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
            <li>
              <a href="#formations" class="mobile-nav-link" @click="closeMenu">Toutes les Formations</a>
            </li>
            <li>
              <a href="#expernet-campus" class="mobile-nav-link" @click="closeMenu">Expernet Campus (Alternance)</a>
            </li>
            <li>
              <a href="#expernet-pro" class="mobile-nav-link" @click="closeMenu">Expernet Pro (CPF &amp; Entreprises)</a>
            </li>
            <li>
              <a href="#candidature-section" class="mobile-nav-link" @click="closeMenu">Déposer une Candidature</a>
            </li>
          </ul>
        </nav>
        <div class="mobile-menu__cta">
          <a href="#candidature-section" class="btn btn--primary btn--full" @click="closeMenu">
            Candidater maintenant (Rentrée 2026-2027)
          </a>
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

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--exp-orange), #ff9f24);
  color: #fff;
  font-size: 1.25rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(242, 140, 5, 0.4);
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
  gap: 1.75rem;
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

@media (max-width: 992px) {
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

  .btn--full {
    width: 100%;
  }
}
</style>
