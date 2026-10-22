<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
import TheWelcome from '@/components/TheWelcome.vue'
import { ref, onMounted } from 'vue';
import axios from 'axios';
const message = ref('Chargement...');

onMounted(async () => {
  try {
    // Grâce au proxy Vite, l'appel cible directement http://localhost:3000/api
    const response = await axios.get('/api');
    message.value = response.data;
  } catch (error) {
    console.error("Erreur lors de l'appel API :", error);
    message.value = "Impossible de joindre le serveur.";
  }
});
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="../assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <h1>Message du Backend :</h1>
    <p>{{ message }}</p>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
