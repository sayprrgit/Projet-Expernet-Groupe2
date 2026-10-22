<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="app-header__brand">Portal Expernet</RouterLink>

    <nav class="app-header__nav">
      <RouterLink to="/">Accueil</RouterLink>
      <RouterLink to="/docs">Documentation API</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
.app-header {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.app-header__brand {
  font-size: 1.25rem;
  font-weight: 600;
}

.app-header__nav {
  display: flex;
  gap: 1.25rem;
}

.app-header__nav :deep(a.router-link-active) {
  font-weight: 600;
}
</style>
