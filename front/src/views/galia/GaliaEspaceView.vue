<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SeoMeta from '@/components/SeoMeta.vue';
import GaliaHeader from '@/components/galia/GaliaHeader.vue';
import EtudiantDashboard from '@/components/galia/EtudiantDashboard.vue';
import EtudiantEmploiDuTemps from '@/components/galia/EtudiantEmploiDuTemps.vue';
import EtudiantNotes from '@/components/galia/EtudiantNotes.vue';
import EtudiantProgression from '@/components/galia/EtudiantProgression.vue';
import EtudiantAbsences from '@/components/galia/EtudiantAbsences.vue';
import FormateurDashboard from '@/components/galia/FormateurDashboard.vue';
import AdminDashboard from '@/components/galia/AdminDashboard.vue';

const auth = useAuthStore();
const router = useRouter();
const section = ref('dashboard');
const ready = ref(false);

const studentItems = [
  { key: 'dashboard', label: 'Tableau de bord', icon: '🏠' },
  { key: 'emploi-du-temps', label: 'Emploi du temps', icon: '📅' },
  { key: 'notes', label: 'Mes notes', icon: '📝' },
  { key: 'progression', label: 'Progression', icon: '📈' },
  { key: 'absences', label: 'Absences', icon: '📋' },
];

const formateurItems = [
  { key: 'dashboard', label: 'Tableau de bord', icon: '🏠' },
];

const adminItems = [
  { key: 'dashboard', label: 'Pilotage', icon: '⚙️' },
];

const items = computed(() => {
  if (auth.isAdmin) return adminItems;
  if (auth.isFormateur) return formateurItems;
  return studentItems;
});

function selectSection(key: string) {
  section.value = key;
}

function logout() {
  auth.logout();
  router.replace('/');
}

onMounted(async () => {
  await auth.ensureSession();
  if (!auth.user) {
    router.replace({ name: 'login', query: { redirect: '/galia/espace' } });
    return;
  }
  ready.value = true;
});

watch(
  () => auth.user,
  (user) => {
    if (ready.value && !user) {
      router.replace({ name: 'login', query: { redirect: '/galia/espace' } });
    }
  },
);
</script>

<template>
  <div class="galia-layout">
    <SeoMeta
      title="GALIA — Mon espace Expernet"
      description="Espace privé Expernet : emploi du temps, notes, progression, suivi pédagogique et administration."
    />

    <GaliaHeader
      :user="auth.user"
      :items="items"
      :active="section"
      @select="selectSection"
      @logout="logout"
    />

    <main class="galia-main">
      <div v-if="!ready" class="loading-screen">
        <div class="spinner"></div>
        <p>Chargement de votre espace Galia…</p>
      </div>

      <div v-else class="galia-container">
        <template v-if="auth.isEtudiant">
          <EtudiantDashboard v-if="section === 'dashboard'" @navigate="selectSection" />
          <EtudiantEmploiDuTemps v-else-if="section === 'emploi-du-temps'" />
          <EtudiantNotes v-else-if="section === 'notes'" />
          <EtudiantProgression v-else-if="section === 'progression'" />
          <EtudiantAbsences v-else-if="section === 'absences'" />
        </template>

        <template v-else-if="auth.isFormateur">
          <FormateurDashboard />
        </template>

        <template v-else-if="auth.isAdmin">
          <AdminDashboard />
        </template>

        <div v-else class="access-denied">
          <h2>Accès non autorisé</h2>
          <p>Votre rôle ne permet pas d'accéder à cet espace.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.galia-layout {
  min-height: 100vh;
  background: var(--color-bg-page);
  display: flex;
  flex-direction: column;
}

.galia-main {
  flex: 1;
  padding: 1.75rem 0 3rem;
}

.galia-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.loading-screen {
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--color-text-muted);
}

.spinner {
  width: 42px;
  height: 42px;
  border: 3px solid rgba(15, 23, 42, 0.1);
  border-top-color: var(--exp-orange);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.access-denied {
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  text-align: center;
  background: #ffffff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.access-denied h2 {
  color: var(--exp-navy-950);
  margin-bottom: 1rem;
}

.access-denied p {
  color: var(--color-text-muted);
}

@media (max-width: 640px) {
  .galia-container { padding: 0 1rem; }
}
</style>
