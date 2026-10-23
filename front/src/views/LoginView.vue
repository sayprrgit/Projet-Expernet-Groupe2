<script setup lang="ts">
import { nextTick, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { IMAGES } from '@/data/images';
import SeoMeta from '@/components/SeoMeta.vue';
import type { Role } from '@/types/user';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Après connexion : retour à la page demandée, sinon l'espace GALIA
const redirect = (route.query.redirect as string) || '/galia/espace';

const ROLES: Record<Role, string> = {
  ADMIN: 'Administrateur',
  FORMATEUR: 'Formateur',
  ETUDIANT: 'Étudiant',
};

// Comptes créés par le seed (développement uniquement) : un clic remplit l'email
const COMPTES_DEMO: { email: string; libelle: string; role: Role }[] = [
  { email: 'marie.payet@expernet.re', libelle: 'Marie Payet', role: 'ADMIN' },
  { email: 'jean.hoarau@expernet.re', libelle: 'Jean Hoarau', role: 'FORMATEUR' },
  { email: 'lynho.rasoamanana@exemple.re', libelle: 'Lynho Rasoamanana', role: 'ETUDIANT' },
  { email: 'sarah.grondin@exemple.re', libelle: 'Sarah Grondin', role: 'ETUDIANT' },
];

const form = reactive({ email: '', password: '' });
const errors = reactive({ email: '', password: '' });
const submitError = ref('');
const champMotDePasse = ref<HTMLInputElement | null>(null);

const validateEmail = (email: string) => {
  if (!email.trim()) return "L'email est obligatoire.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Format d'email invalide.";
  return '';
};

async function handleSubmit() {
  errors.email = validateEmail(form.email);
  errors.password = form.password ? '' : 'Le mot de passe est obligatoire.';
  if (errors.email || errors.password || authStore.isLoading) return;

  submitError.value = '';
  const res = await authStore.login(form.email, form.password);
  if (res.success) {
    form.password = '';
    router.push(redirect);
  } else {
    submitError.value = res.message;
    nextTick(() => champMotDePasse.value?.focus());
  }
}

function remplirCompteDemo(email: string) {
  form.email = email;
  errors.email = '';
  submitError.value = '';
  nextTick(() => champMotDePasse.value?.focus());
}

function initiales(libelle: string) {
  return libelle
    .split(' ')
    .map((mot) => mot.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
</script>

<template>
  <div class="login-screen accent-gold">
    <SeoMeta
      title="Connexion | GALIA Expernet"
      description="Accédez à votre espace GALIA : emploi du temps, notes, progression et suivi de votre formation."
    />

    <div class="login-glow" aria-hidden="true"></div>

    <RouterLink to="/galia" class="login-back">← Retour à l’espace GALIA</RouterLink>

    <section class="login-card" aria-labelledby="titre-connexion">
      <div class="login-brand">
        <img :src="IMAGES.logoMarkWhite" alt="" width="44" height="42" />
        <span>EXPERNET <strong>GALIA</strong></span>
      </div>

      <h1 id="titre-connexion" class="login-title">Connexion à votre espace GALIA</h1>
      <p class="login-desc">
        Retrouvez votre emploi du temps, vos notes, votre progression et le suivi de votre formation.
      </p>

      <form class="login-form" novalidate @submit.prevent="handleSubmit">
        <div class="field">
          <label for="connexion-email">Adresse email</label>
          <input
            id="connexion-email"
            v-model="form.email"
            type="email"
            autocomplete="username"
            required
            placeholder="prenom.nom@expernet.re"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'erreur-email' : undefined"
            @blur="errors.email = form.email ? validateEmail(form.email) : ''"
          />
          <span v-if="errors.email" id="erreur-email" class="field-error">{{ errors.email }}</span>
        </div>

        <div class="field">
          <label for="connexion-mot-de-passe">Mot de passe</label>
          <input
            id="connexion-mot-de-passe"
            ref="champMotDePasse"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            required
            :aria-invalid="!!errors.password"
            :aria-describedby="errors.password ? 'erreur-mot-de-passe' : undefined"
            @input="errors.password = ''"
          />
          <span v-if="errors.password" id="erreur-mot-de-passe" class="field-error">{{ errors.password }}</span>
        </div>

        <p v-if="submitError" class="login-error" role="alert">{{ submitError }}</p>

        <button
          type="submit"
          class="btn btn--primary btn--block btn--lg"
          :disabled="authStore.isLoading"
        >
          {{ authStore.isLoading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>

      <p class="login-footer">
        Pas encore de compte ? <RouterLink to="/candidature">Déposez votre candidature</RouterLink>
      </p>

      <details class="demo-accounts">
        <summary>Comptes de démonstration</summary>
        <p>Mot de passe commun : <code>Password123!</code> (données de test, à retirer en production).</p>
        <ul class="account-list">
          <li v-for="compte in COMPTES_DEMO" :key="compte.email">
            <button type="button" class="account" @click="remplirCompteDemo(compte.email)">
              <span class="avatar" :class="`avatar--${compte.role.toLowerCase()}`" aria-hidden="true">
                {{ initiales(compte.libelle) }}
              </span>
              <span class="account__info">
                <strong>{{ compte.libelle }}</strong>
                <span>{{ compte.email }} · {{ ROLES[compte.role] }}</span>
              </span>
              <span class="account__arrow" aria-hidden="true">→</span>
            </button>
          </li>
        </ul>
      </details>
    </section>
  </div>
</template>

<style scoped>
/* Même mise en page que l'écran de connexion Teams, avec l'accent doré de GALIA */
.login-screen {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 4rem 1rem 2rem;
  overflow: hidden;
  background: linear-gradient(180deg, var(--exp-blue-dark) 0%, var(--exp-navy-950) 100%);
}

.login-glow {
  position: absolute;
  top: -25%;
  right: -10%;
  width: 640px;
  height: 640px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent) 0%, transparent 65%);
  opacity: 0.25;
  filter: blur(70px);
  pointer-events: none;
}

.login-back {
  position: absolute;
  top: 1.25rem;
  left: 1.5rem;
  z-index: 1;
  font-size: 0.88rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
}

.login-back:hover {
  color: #ffffff;
}

.login-back:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 460px;
  padding: 2rem;
  background: var(--color-bg-card);
  border-top: 4px solid var(--accent);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
}

.login-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.25rem;
  padding: 0.45rem 0.9rem 0.45rem 0.5rem;
  border-radius: var(--radius-md);
  background: var(--exp-navy-950);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.login-brand img {
  width: 30px;
  height: auto;
}

.login-brand strong {
  color: var(--accent);
}

.login-title {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 1.2;
  color: var(--color-text-main);
}

.login-desc {
  margin-bottom: 1.25rem;
  font-size: 0.93rem;
  line-height: 1.6;
  color: var(--color-text-muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.field input {
  padding: 0.75rem 0.9rem;
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-text-main);
}

.field input:focus {
  outline: none;
  border-color: var(--accent-strong);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.field input[aria-invalid='true'] {
  border-color: #dc2626;
}

.field-error {
  font-size: 0.78rem;
  font-weight: 700;
  color: #b91c1c;
}

.login-error {
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  background: #fef2f2;
  font-size: 0.88rem;
  color: #b91c1c;
}

.login-footer {
  margin-top: 1rem;
  font-size: 0.85rem;
  text-align: center;
  color: var(--color-text-muted);
}

.login-footer a {
  font-weight: 800;
  color: var(--exp-orange-dark);
}

.demo-accounts {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border-subtle);
}

.demo-accounts summary {
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--accent-strong);
  cursor: pointer;
}

.demo-accounts p {
  margin: 0.6rem 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.demo-accounts code {
  padding: 0.05rem 0.35rem;
  border-radius: var(--radius-sm);
  background: var(--color-bg-card-subtle);
  font-size: 0.8rem;
  color: var(--color-text-main);
}

.account-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.account {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1.5px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  background: var(--color-bg-card);
  font-family: var(--font-body);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease, transform 0.15s ease;
}

.account:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
  transform: translateY(-1px);
}

.account:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.avatar {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 900;
}

.avatar--admin {
  background: var(--exp-navy-700);
}

.avatar--formateur {
  background: var(--accent-strong);
}

.avatar--etudiant {
  background: var(--exp-blue-dark);
}

.account__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.account__info strong {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--color-text-main);
}

.account__info span {
  overflow: hidden;
  font-size: 0.76rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--color-text-muted);
}

.account__arrow {
  font-weight: 900;
  color: var(--accent-strong);
}

@media (prefers-reduced-motion: reduce) {
  .account {
    transition: none;
  }
}
</style>
