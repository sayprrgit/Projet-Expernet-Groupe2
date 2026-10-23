<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const route = useRoute();
const bare = computed(() => route.meta.bare === true);
</script>

<template>
  <a class="skip-link" href="#main-content">Aller au contenu principal</a>
  <Navbar v-if="!bare" />
  <main id="main-content" class="site-main" tabindex="-1">
    <RouterView />
  </main>
  <Footer v-if="!bare" />
</template>

<style scoped>
.site-main {
  flex: 1 0 auto;
  outline: none;
}
</style>
