<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { IMAGES } from '@/data/images';
import type { Role, User } from '@/types/user';
import BaseButton from '@/components/BaseButton.vue';

interface NavItem {
  key: string;
  label: string;
  icon: string;
}

const props = defineProps<{
  user: User | null;
  items: NavItem[];
  active: string;
}>();

defineEmits<{
  (e: 'select', key: string): void;
  (e: 'logout'): void;
}>();

const roleLabels: Record<Role, { label: string; icon: string; color: string }> = {
  ADMIN: { label: 'Administrateur', icon: '🛡️', color: '#7c3aed' },
  FORMATEUR: { label: 'Formateur', icon: '🎓', color: '#1d4ed8' },
  ETUDIANT: { label: 'Étudiant', icon: '📚', color: '#047857' },
};

const currentRole = computed(() => roleLabels[props.user?.role ?? 'ETUDIANT']);
</script>

<template>
  <header class="galia-header" role="banner">
    <div class="galia-header__inner">
      <RouterLink to="/galia" class="brand-link">
        <img :src="IMAGES.logoMarkWhite" alt="Galia" class="brand-mark" width="36" height="36" />
        <span class="brand-text">
          <strong>GALIA</strong>
          <span class="brand-subtitle">Espace apprenant Expernet</span>
        </span>
      </RouterLink>

      <nav class="galia-nav" aria-label="Navigation Galia">
        <button
          v-for="item in items"
          :key="item.key"
          type="button"
          class="nav-link"
          :class="{ 'nav-link--active': active === item.key }"
          @click="$emit('select', item.key)"
        >
          <span class="nav-icon" aria-hidden="true">{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>

      <div class="galia-user">
        <div class="user-info">
          <span class="role-badge" :style="{ background: currentRole.color }">
            <span aria-hidden="true">{{ currentRole.icon }}</span>
            {{ currentRole.label }}
          </span>
          <span class="user-name">{{ user?.prenom }} {{ user?.nom }}</span>
        </div>
        <BaseButton variant="outline" size="sm" @click="$emit('logout')">
          Déconnexion
        </BaseButton>
      </div>
    </div>
  </header>
</template>

<style scoped>
.galia-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--exp-navy-950);
  border-bottom: 2px solid var(--exp-orange);
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

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #ffffff;
  flex-shrink: 0;
}

.brand-mark {
  display: block;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-text strong {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.brand-subtitle {
  font-size: 0.63rem;
  font-weight: 600;
  color: var(--exp-blue);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.galia-nav {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
  flex-wrap: wrap;
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
  background: var(--exp-orange);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(242, 140, 5, 0.4);
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

.user-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: 0.68rem;
  font-weight: 800;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.user-name {
  font-size: 0.86rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 1100px) {
  .galia-nav {
    justify-content: flex-start;
    overflow-x: auto;
  }
  .user-name {
    display: none;
  }
}

@media (max-width: 780px) {
  .brand-subtitle,
  .role-badge {
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
</style>
