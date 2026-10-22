<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
</script>

<template>
  <a class="skip-link" href="#main-content">Aller au contenu principal</a>
  <Navbar />
  <main id="main-content" class="site-main" tabindex="-1">
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped>
.site-main {
  flex: 1 0 auto;
  outline: none;
}
</style>
