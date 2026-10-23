<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { IMAGES } from '@/data/images';
import type { Role, User } from '@/types/user';

interface NavItem {
  key: string;
  label: string;
  icon: string;
}

const props = defineProps<{
  user: User | null;
  items: NavItem[];
  active: string;
  /** Motif d'icônes de bananes en fond de la navigation (tableau de bord formateur) */
  motifBananes?: boolean;
}>();

defineEmits<{
  (e: 'select', key: string): void;
  (e: 'logout'): void;
}>();

const ROLES: Record<Role, string> = {
  ADMIN: 'Administrateur',
  FORMATEUR: 'Formateur',
  ETUDIANT: 'Étudiant',
};

const role = computed<Role>(() => props.user?.role ?? 'ETUDIANT');
const initiales = computed(() =>
  `${props.user?.prenom?.charAt(0) ?? ''}${props.user?.nom?.charAt(0) ?? ''}`.toUpperCase(),
);
</script>

<template>
  <header class="galia-header">
    <div class="galia-header__inner">
      <RouterLink to="/galia" class="space-brand" aria-label="GALIA, retour à la présentation de l’espace">
        <img :src="IMAGES.logoMarkWhite" alt="" width="34" height="32" />
        <span class="space-brand__text">
          <span class="space-brand__name">EXPERNET <strong>GALIA</strong></span>
          <span class="space-brand__subtitle">Espace apprenant</span>
        </span>
      </RouterLink>

      <nav class="galia-nav" :class="{ 'galia-nav--bananes': motifBananes }" aria-label="Navigation Galia">
        <button
          v-for="item in items"
          :key="item.key"
          type="button"
          class="nav-link"
          :class="{ 'nav-link--active': active === item.key }"
          :aria-current="active === item.key ? 'page' : undefined"
          @click="$emit('select', item.key)"
        >
          <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>

      <div class="galia-user">
        <div v-if="user" class="space-user">
          <span class="space-user__avatar" :class="`space-user__avatar--${role.toLowerCase()}`" aria-hidden="true">
            {{ initiales }}
          </span>
          <span class="space-user__info">
            <strong>{{ user.prenom }} {{ user.nom }}</strong>
            <span>{{ ROLES[role] }}</span>
          </span>
        </div>
        <button type="button" class="space-logout" @click="$emit('logout')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.galia-header {
  --space-accent: var(--exp-gold);
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--exp-navy-950);
  border-bottom: 2px solid var(--space-accent);
  box-shadow: var(--shadow-md);
}

.galia-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  gap: 1.5rem;
  padding: 0 1.5rem;
  max-width: 1440px;
  margin: 0 auto;
}






.galia-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
}

/* Motif décoratif de bananes (exigence du sujet pour le tableau de bord formateur) */
.galia-nav--bananes {
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-md);
  background-color: rgba(255, 195, 41, 0.06);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='40'%3E%3Ctext x='4' y='18' font-size='14' opacity='0.22'%3E%F0%9F%8D%8C%3C/text%3E%3Ctext x='32' y='36' font-size='14' opacity='0.22' transform='rotate(25 39 31)'%3E%F0%9F%8D%8C%3C/text%3E%3C/svg%3E");
  background-size: 56px 40px;
  box-shadow: inset 0 0 0 1px rgba(255, 195, 41, 0.25);
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.9rem;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  font-size: 0.86rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.nav-link--active {
  background: var(--space-accent);
  color: var(--exp-navy-950);
  box-shadow: 0 2px 8px rgba(255, 195, 41, 0.35);
}

.nav-link:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.nav-icon {
  font-size: 0.95rem;
}

.galia-user {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-shrink: 0;
}







@media (max-width: 1100px) {
  .galia-nav {
    justify-content: flex-start;
    overflow-x: auto;
  }
  .space-user__info {
    display: none;
  }
}

@media (max-width: 780px) {
  .space-brand__subtitle {
    display: none;
  }
  .galia-header__inner {
    height: auto;
    flex-wrap: wrap;
    padding: 0.6rem 1rem;
  }
  .galia-user {
    margin-left: auto;
  }
}

/* ---- En-tête d'espace : structure commune GALIA / Teams ---- */
.space-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
  color: #ffffff;
  text-decoration: none;
}

.space-brand img {
  width: 32px;
  height: auto;
}

.space-brand__text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.space-brand__name {
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.space-brand__name strong {
  color: var(--space-accent);
}

.space-brand__subtitle {
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.space-user {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.space-user__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 900;
}

.space-user__avatar--admin {
  background: var(--exp-navy-700);
}

.space-user__avatar--formateur {
  background: #4a4c86;
}

.space-user__avatar--etudiant {
  background: var(--exp-blue-dark);
}

.space-user__info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.space-user__info strong {
  font-size: 0.86rem;
  font-weight: 800;
  color: #ffffff;
}

.space-user__info span {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.7);
}

.space-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.95rem;
  border: 1.5px solid rgba(255, 255, 255, 0.55);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.space-logout:hover {
  border-color: #ffffff;
  background: #ffffff;
  color: var(--exp-navy-950);
}

.space-brand:focus-visible,
.space-logout:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
.galia-nav--bananes .nav-link:not(.nav-link--active) {
  background: rgba(11, 26, 45, 0.72);
}
</style>
