<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { IMAGES } from '@/data/images';
import BaseButton from '@/components/BaseButton.vue';
import SeoMeta from '@/components/SeoMeta.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const redirect = (route.query.redirect as string) || '/galia/espace';

const form = reactive({
  email: '',
  password: '',
  remember: false,
});

const errors = reactive({ email: '', password: '' });
const isLoading = ref(false);
const submitError = ref('');

const validateEmail = (email: string) => {
  if (!email.trim()) return 'L\'email est obligatoire.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Format d\'email invalide.';
  return '';
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  errors.email = validateEmail(form.email);
  errors.password = form.password ? '' : 'Le mot de passe est obligatoire.';
  if (errors.email || errors.password) return;

  isLoading.value = true;
  submitError.value = '';

  const res = await authStore.login(form.email, form.password);
  if (res.success) {
    router.push(redirect);
  } else {
    submitError.value = res.message;
  }
  isLoading.value = false;
};
</script>

<template>
  <div class="login-page">
    <SeoMeta title="Connexion — Galia Expernet" description="Accédez à votre espace apprenant, formateur ou administrateur." />

    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <img :src="IMAGES.logoMarkBlue" alt="Expernet" class="login-logo" width="64" height="64" />
          <h1>Connexion à Galia</h1>
          <p class="login-subtitle">Votre espace personnel Expernet</p>
        </div>

        <form @submit="handleSubmit" class="login-form" novalidate>
          <div v-if="submitError" class="form-alert error">{{ submitError }}</div>

          <div class="form-group">
            <label for="email" class="form-label">Adresse email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              placeholder="votre@email.re"
              :disabled="isLoading"
              @blur="errors.email = validateEmail(form.email)"
            />
            <span v-if="errors.email" class="form-error">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <div class="form-group-header">
              <label for="password" class="form-label">Mot de passe</label>
            </div>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              placeholder="••••••••"
              :disabled="isLoading"
              @input="errors.password = ''"
            />
            <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
          </div>

          <div class="form-options">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="form.remember" :disabled="isLoading" />
              <span>Se souvenir de moi</span>
            </label>
            <a href="#" class="forgot-link">Mot de passe oublié ?</a>
          </div>

          <BaseButton type="submit" :loading="isLoading" class="btn-submit" size="lg">
            Se connecter
            <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </BaseButton>
        </form>

        <div class="login-footer">
          <p>Pas encore de compte ? <RouterLink to="/candidature">Déposez votre candidature</RouterLink></p>
          <p class="demo-hint">
            <strong>Comptes démo :</strong><br>
            Admin : marie.payet@expernet.re / Password123!<br>
            Formateur : jean.hoarau@expernet.re / Password123!<br>
            Étudiant : lynho.rasoamanana@exemple.re / Password123!
          </p>
        </div>
      </div>

      <aside class="login-illustration" aria-hidden="true">
        <img :src="IMAGES.heroGalia" alt="Galia - Espace apprenant Expernet" />
        <div class="illustration-overlay">
          <h2>GALIA</h2>
          <p>Votre plateforme d'apprentissage<br>emploi du temps, notes, progression</p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--exp-navy-950) 0%, var(--exp-navy-800) 100%);
  padding: 2rem 1rem;
}

.login-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  margin: 0 auto;
  min-height: calc(100vh - 4rem);
  background: #ffffff;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
}

.login-card {
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-logo {
  margin-bottom: 1rem;
}

.login-header h1 {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--exp-navy-950);
  margin-bottom: 0.25rem;
}

.login-subtitle {
  color: var(--color-text-muted);
  font-size: 1rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-alert {
  padding: 0.85rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
}

.form-alert.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--exp-navy-900);
}

.form-control {
  width: 100%;
  padding: 0.85rem 1rem;
  font-size: 1rem;
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: #ffffff;
  color: var(--color-text-main);
  transition: all 0.2s ease;
}

.form-control:focus {
  border-color: var(--exp-orange);
  box-shadow: 0 0 0 3px rgba(242, 140, 5, 0.2);
  outline: none;
}

.form-control.is-invalid {
  border-color: #ef4444;
  background: #fef2f2;
}

.form-error {
  font-size: 0.8rem;
  font-weight: 600;
  color: #dc2626;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.88rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.forgot-link {
  color: var(--exp-blue);
  font-weight: 600;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.btn-submit {
  margin-top: 0.5rem;
}

.login-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border-subtle);
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.login-footer p {
  margin: 0.5rem 0;
}

.demo-hint {
  background: var(--color-bg-inset);
  padding: 1rem;
  border-radius: var(--radius-md);
  font-size: 0.78rem !important;
  line-height: 1.6;
  text-align: left;
  color: var(--color-text-main);
}

.login-illustration {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--exp-navy-950);
}

.login-illustration img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.35;
}

.illustration-overlay {
  position: absolute;
  color: #ffffff;
  text-align: center;
  padding: 2rem;
}

.illustration-overlay h2 {
  font-size: 3rem;
  font-weight: 900;
  color: var(--exp-orange);
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
}

.illustration-overlay p {
  font-size: 1.1rem;
  line-height: 1.7;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .login-wrapper {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .login-illustration {
    min-height: 200px;
  }
  .login-card {
    padding: 2rem 1.5rem;
  }
}
</style>