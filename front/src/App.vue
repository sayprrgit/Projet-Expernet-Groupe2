<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();
// Les pages d'application (ex. messagerie Teams) s'affichent en plein écran, sans navbar ni footer
const pleinEcran = computed(() => route.meta.pleinEcran === true);
</script>

<template>
  <a v-if="!pleinEcran" class="skip-link" href="#main-content">Aller au contenu principal</a>
  <Navbar v-if="!pleinEcran" />
  <main id="main-content" class="site-main" tabindex="-1">
    <RouterView />
  </main>
  <Footer v-if="!pleinEcran" />
</template>

<style scoped>
.site-main {
  flex: 1 0 auto;
  outline: none;
}
</style>
