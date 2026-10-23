<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import type { Formation, CandidatureFormInput, CandidatureResponse } from '@/types/formation';
import { apiService } from '@/services/api';

const props = defineProps<{
  formations: Formation[];
  preselectedFormationId?: string;
}>();

const form = reactive<CandidatureFormInput>({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  codePostal: '97400',
  formationId: '',
  typeDemarche: 'campus',
  statutActuel: 'etudiant',
  message: '',
  rgpdConsent: false,
});

const errors = reactive<Record<string, string>>({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  codePostal: '',
  formationId: '',
  rgpdConsent: '',
});

const isSubmitting = ref(false);
const submitResult = ref<CandidatureResponse | null>(null);

// Mettre à jour la formation pré-sélectionnée quand elle change
watch(
  () => props.preselectedFormationId,
  (newId) => {
    if (newId) {
      form.formationId = newId;
    }
  },
  { immediate: true },
);

// Regex de validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_CLEAN_REGEX = /[\s.-]/g;

const validateField = (field: keyof CandidatureFormInput) => {
  switch (field) {
    case 'nom':
      if (!form.nom.trim()) {
        errors.nom = 'Le nom de famille est obligatoire.';
      } else if (form.nom.trim().length < 2) {
        errors.nom = 'Le nom doit comporter au moins 2 caractères.';
      } else {
        errors.nom = '';
      }
      break;

    case 'prenom':
      if (!form.prenom.trim()) {
        errors.prenom = 'Le prénom est obligatoire.';
      } else if (form.prenom.trim().length < 2) {
        errors.prenom = 'Le prénom doit comporter au moins 2 caractères.';
      } else {
        errors.prenom = '';
      }
      break;

    case 'email':
      if (!form.email.trim()) {
        errors.email = "L'adresse email est obligatoire.";
      } else if (!EMAIL_REGEX.test(form.email.trim())) {
        errors.email = 'Veuillez saisir une adresse email valide (ex : nom@domaine.re).';
      } else {
        errors.email = '';
      }
      break;

    case 'telephone': {
      const cleanPhone = form.telephone.replace(PHONE_CLEAN_REGEX, '');
      const isReunion = /^(?:(?:\+|00)262|0)(?:262|692|693)\d{6}$/.test(cleanPhone);
      const isFrance = /^(?:(?:\+|00)33|0)[1-9]\d{8}$/.test(cleanPhone);

      if (!cleanPhone) {
        errors.telephone = 'Le numéro de téléphone est obligatoire.';
      } else if (!isReunion && !isFrance) {
        errors.telephone = 'Numéro invalide. Formats acceptés : 0692 XX XX XX, 0693 XX XX XX, 0262 XX XX XX ou +262...';
      } else {
        errors.telephone = '';
      }
      break;
    }

    case 'codePostal':
      if (!/^\d{5}$/.test(form.codePostal.trim())) {
        errors.codePostal = 'Code postal invalide (5 chiffres, ex: 97400).';
      } else {
        errors.codePostal = '';
      }
      break;

    case 'formationId':
      if (!form.formationId) {
        errors.formationId = 'Veuillez sélectionner une formation dans la liste.';
      } else {
        errors.formationId = '';
      }
      break;

    case 'rgpdConsent':
      if (!form.rgpdConsent) {
        errors.rgpdConsent = 'Le consentement RGPD est requis pour le traitement de votre candidature.';
      } else {
        errors.rgpdConsent = '';
      }
      break;
  }
};

const validateAll = (): boolean => {
  validateField('nom');
  validateField('prenom');
  validateField('email');
  validateField('telephone');
  validateField('codePostal');
  validateField('formationId');
  validateField('rgpdConsent');

  const hasError = Object.values(errors).some((err) => err !== '');
  if (hasError) {
    const firstInvalidKey = Object.keys(errors).find((k) => errors[k] !== '');
    if (firstInvalidKey) {
      const el = document.getElementById(`field-${firstInvalidKey}`);
      el?.focus();
    }
    return false;
  }
  return true;
};

const handleSubmit = async () => {
  if (!validateAll()) return;

  isSubmitting.value = true;
  try {
    const res = await apiService.submitCandidature({ ...form });
    submitResult.value = res;
  } catch (err) {
    console.error('Erreur lors de la soumission :', err);
  } finally {
    isSubmitting.value = false;
  }
};

const resetForm = () => {
  submitResult.value = null;
  form.nom = '';
  form.prenom = '';
  form.email = '';
  form.telephone = '';
  form.message = '';
  form.rgpdConsent = false;
};
</script>

<template>
  <section id="candidature-section" class="candidature-section" aria-labelledby="form-heading">
    <div class="container">
      <div class="candidature-card">
        <!-- Message de succès après soumission -->
        <div
          v-if="submitResult"
          class="success-banner"
          role="region"
          aria-live="polite"
          aria-label="Confirmation de candidature"
        >
          <div class="success-icon" aria-hidden="true">✓</div>
          <h3 class="success-title">Candidature enregistrée avec succès !</h3>
          <p class="success-message">
            Merci <strong>{{ form.prenom }} {{ form.nom }}</strong>. Votre demande a bien été transmise aux équipes d'Expernet.
          </p>

          <div class="dossier-ref">
            <span class="ref-label">Référence de votre dossier :</span>
            <span class="ref-code">{{ submitResult.reference }}</span>
          </div>

          <div class="next-steps">
            <h4>Prochaines étapes :</h4>
            <ol>
              <li>Un conseiller formation Expernet étudie votre profil sous <strong>48 heures ouvrées</strong>.</li>
              <li>Vous serez contacté(e) au <strong>{{ form.telephone }}</strong> ou par email pour fixer votre entretien d'orientation.</li>
              <li>Pour l'alternance, nous transmettons directement votre CV à nos <strong>entreprises partenaires à La Réunion</strong>.</li>
            </ol>
          </div>

          <button
            type="button"
            class="btn btn--primary"
            @click="resetForm"
          >
            Déposer une nouvelle candidature
          </button>
        </div>

        <!-- Formulaire de saisie -->
        <div v-else>
          <div class="candidature-header">
            <span class="badge badge--candidature">Rentrée 2026-2027</span>
            <h2 id="form-heading" class="candidature-title">
              Candidature &amp; Contact Direct
            </h2>
            <p class="candidature-desc">
              Déposez votre candidature pour une formation en alternance (Expernet Campus) ou votre demande de prise en charge continue / CPF (Expernet Pro).
            </p>
          </div>

          <form class="candidature-form" novalidate @submit.prevent="handleSubmit">
            <!-- Type de démarche -->
            <fieldset class="form-fieldset">
              <legend class="fieldset-legend">1. Type de démarche</legend>
              <div class="radio-cards">
                <label class="radio-card" :class="{ 'radio-card--selected': form.typeDemarche === 'campus' }">
                  <input
                    type="radio"
                    name="typeDemarche"
                    value="campus"
                    v-model="form.typeDemarche"
                  />
                  <div class="radio-card__content">
                    <span class="radio-card__title">🎓 Alternance Campus</span>
                    <span class="radio-card__desc">Bac+2 à Bac+5 • 100% financé &amp; rémunéré</span>
                  </div>
                </label>

                <label class="radio-card" :class="{ 'radio-card--selected-pro': form.typeDemarche === 'pro' }">
                  <input
                    type="radio"
                    name="typeDemarche"
                    value="pro"
                    v-model="form.typeDemarche"
                  />
                  <div class="radio-card__content">
                    <span class="radio-card__title">💼 Formation Pro / CPF</span>
                    <span class="radio-card__desc">Reconversion ou montée en compétences</span>
                  </div>
                </label>

                <label class="radio-card" :class="{ 'radio-card--selected': form.typeDemarche === 'info' }">
                  <input
                    type="radio"
                    name="typeDemarche"
                    value="info"
                    v-model="form.typeDemarche"
                  />
                  <div class="radio-card__content">
                    <span class="radio-card__title">ℹ️ Simple renseignement</span>
                    <span class="radio-card__desc">Échange avec un conseiller d'orientation</span>
                  </div>
                </label>
              </div>
            </fieldset>

            <!-- Formation souhaitée -->
            <fieldset class="form-fieldset">
              <legend class="fieldset-legend">2. Choix de la formation</legend>
              <div class="form-row">
                <div class="form-group">
                  <label for="field-formationId" class="form-label">
                    Formation souhaitée <span class="required" aria-hidden="true">*</span>
                  </label>
                  <select
                    id="field-formationId"
                    v-model="form.formationId"
                    class="form-select"
                    :class="{ 'is-invalid': errors.formationId }"
                    :aria-invalid="!!errors.formationId"
                    aria-describedby="formationId-error"
                    @blur="validateField('formationId')"
                    @keydown.space.prevent.stop
                  >
                    <option value="" disabled>-- Choisissez une formation du catalogue --</option>
                    <option
                      v-for="item in formations"
                      :key="item.id"
                      :value="item.id"
                    >
                      [{{ item.levelLabel }}] {{ item.title }}
                    </option>
                  </select>
                  <span
                    v-if="errors.formationId"
                    id="formationId-error"
                    class="form-error"
                    role="alert"
                  >
                    {{ errors.formationId }}
                  </span>
                </div>
              </div>
            </fieldset>

            <!-- Identité & Coordonnées -->
            <fieldset class="form-fieldset">
              <legend class="fieldset-legend">3. Vos coordonnées</legend>
              <div class="form-row">
                <div class="form-group">
                  <label for="field-nom" class="form-label">
                    Nom de famille <span class="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="field-nom"
                    v-model="form.nom"
                    type="text"
                    autocomplete="family-name"
                    class="form-control"
                    :class="{ 'is-invalid': errors.nom }"
                    :aria-invalid="!!errors.nom"
                    aria-describedby="nom-error"
                    placeholder="Ex : Payet"
                    @blur="validateField('nom')"
                  />
                  <span v-if="errors.nom" id="nom-error" class="form-error" role="alert">
                    {{ errors.nom }}
                  </span>
                </div>

                <div class="form-group">
                  <label for="field-prenom" class="form-label">
                    Prénom <span class="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="field-prenom"
                    v-model="form.prenom"
                    type="text"
                    autocomplete="given-name"
                    class="form-control"
                    :class="{ 'is-invalid': errors.prenom }"
                    :aria-invalid="!!errors.prenom"
                    aria-describedby="prenom-error"
                    placeholder="Ex : Aurélie"
                    @blur="validateField('prenom')"
                  />
                  <span v-if="errors.prenom" id="prenom-error" class="form-error" role="alert">
                    {{ errors.prenom }}
                  </span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="field-email" class="form-label">
                    Adresse email <span class="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="field-email"
                    v-model="form.email"
                    type="email"
                    autocomplete="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    :aria-invalid="!!errors.email"
                    aria-describedby="email-error"
                    placeholder="aurelie.payet@email.re"
                    @blur="validateField('email')"
                  />
                  <span v-if="errors.email" id="email-error" class="form-error" role="alert">
                    {{ errors.email }}
                  </span>
                </div>

                <div class="form-group">
                  <label for="field-telephone" class="form-label">
                    Téléphone (+262 ou métropole) <span class="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="field-telephone"
                    v-model="form.telephone"
                    type="tel"
                    autocomplete="tel"
                    class="form-control"
                    :class="{ 'is-invalid': errors.telephone }"
                    :aria-invalid="!!errors.telephone"
                    aria-describedby="telephone-error"
                    placeholder="0692 XX XX XX"
                    @blur="validateField('telephone')"
                  />
                  <span v-if="errors.telephone" id="telephone-error" class="form-error" role="alert">
                    {{ errors.telephone }}
                  </span>
                </div>

                <div class="form-group flex-small">
                  <label for="field-codePostal" class="form-label">
                    Code postal <span class="required" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="field-codePostal"
                    v-model="form.codePostal"
                    type="text"
                    maxlength="5"
                    autocomplete="postal-code"
                    class="form-control"
                    :class="{ 'is-invalid': errors.codePostal }"
                    :aria-invalid="!!errors.codePostal"
                    aria-describedby="codePostal-error"
                    placeholder="97400"
                    @blur="validateField('codePostal')"
                  />
                  <span v-if="errors.codePostal" id="codePostal-error" class="form-error" role="alert">
                    {{ errors.codePostal }}
                  </span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="field-statutActuel" class="form-label">
                    Votre statut actuel
                  </label>
                  <select
                    id="field-statutActuel"
                    v-model="form.statutActuel"
                    class="form-select"
                    @keydown.space.prevent.stop
                  >
                    <option value="etudiant">Étudiant(e) en cours d'études</option>
                    <option value="lyceen">Lycéen(ne) / Futur bachelier</option>
                    <option value="reconversion">Demandeur d'emploi / En reconversion</option>
                    <option value="salarie">Salarié(e) en poste</option>
                  </select>
                </div>
              </div>

              <!-- Message / Précisions -->
              <div class="form-group">
                <label for="field-message" class="form-label">
                  Précisions ou projet professionnel (facultatif)
                </label>
                <textarea
                  id="field-message"
                  v-model="form.message"
                  rows="3"
                  class="form-control form-textarea"
                  placeholder="Décrivez brièvement vos motivations, votre niveau d'études ou votre projet en entreprise..."
                ></textarea>
              </div>
            </fieldset>

            <!-- Consentement RGPD -->
            <div class="form-group form-group--rgpd">
              <label class="checkbox-container" for="field-rgpdConsent">
                <input
                  id="field-rgpdConsent"
                  v-model="form.rgpdConsent"
                  type="checkbox"
                  class="checkbox-real"
                  :aria-invalid="!!errors.rgpdConsent"
                  aria-describedby="rgpdConsent-error"
                  @change="validateField('rgpdConsent')"
                />
                <span class="checkbox-visual" aria-hidden="true"></span>
                <span class="checkbox-label-text">
                  J'accepte qu'Expernet collecte et traite mes données personnelles dans le cadre strict de l'examen de ma candidature et de mon orientation professionnelle, conformément à la politique de confidentialité (RGPD). <span class="required">*</span>
                </span>
              </label>
              <span
                v-if="errors.rgpdConsent"
                id="rgpdConsent-error"
                class="form-error"
                role="alert"
              >
                {{ errors.rgpdConsent }}
              </span>
            </div>

            <!-- Bouton de soumission -->
            <div class="form-actions">
              <button
                type="submit"
                class="btn btn--submit"
                :disabled="isSubmitting"
              >
                <span v-if="!isSubmitting">Envoyer ma candidature</span>
                <span v-else>Traitement en cours...</span>
                <svg v-if="!isSubmitting" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.candidature-section {
  padding: 4.5rem 0;
  background: linear-gradient(180deg, var(--color-bg-page) 0%, var(--color-bg-card-subtle) 100%);
}

.candidature-card {
  background: #ffffff;
  border-radius: var(--radius-lg);
  padding: 2.75rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border-subtle);
  border-top: 4px solid var(--exp-orange);
  max-width: 900px;
  margin: 0 auto;
}

.candidature-header {
  margin-bottom: 2rem;
  text-align: center;
}

.badge--candidature {
  background: var(--exp-orange-light);
  color: var(--exp-orange-dark);
  border: 1px solid rgba(242, 140, 5, 0.3);
  padding: 0.3rem 0.85rem;
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.candidature-title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--exp-navy-950);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.candidature-desc {
  font-size: 1rem;
  color: var(--color-text-muted);
  max-width: 650px;
  margin: 0 auto;
}

.candidature-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.fieldset-legend {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--exp-navy-900);
  padding-bottom: 0.65rem;
  border-bottom: 2px solid var(--color-border-subtle);
  width: 100%;
  margin-bottom: 0.5rem;
}

.radio-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.radio-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 1rem 1.2rem;
  background: var(--color-bg-inset);
  border: 2px solid var(--color-border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-card:hover {
  border-color: var(--exp-orange);
}

.radio-card--selected {
  border-color: var(--exp-orange);
  background: var(--exp-orange-light);
  box-shadow: 0 4px 12px rgba(242, 140, 5, 0.15);
}

.radio-card--selected-pro {
  border-color: var(--exp-blue);
  background: var(--exp-blue-light);
  box-shadow: 0 4px 12px rgba(69, 161, 195, 0.15);
}

.radio-card input {
  margin-right: 0.75rem;
  margin-top: 0.25rem;
  accent-color: var(--exp-orange);
}

.radio-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.radio-card__title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--exp-navy-950);
}

.radio-card__desc {
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.form-row {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex: 1;
  min-width: 220px;
}

.flex-small {
  flex: 0.8;
  min-width: 120px;
}

.form-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--exp-navy-900);
}

.required {
  color: var(--exp-orange-dark);
}

.form-control,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  background: #ffffff;
  border: 1.5px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text-main);
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--exp-orange);
  box-shadow: 0 0 0 3px rgba(242, 140, 5, 0.2);
  outline: none;
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.form-error {
  font-size: 0.8rem;
  font-weight: 600;
  color: #dc2626;
  margin-top: 0.15rem;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group--rgpd {
  padding-top: 0.5rem;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-real {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-visual {
  width: 22px;
  height: 22px;
  border: 2px solid var(--color-border-strong);
  border-radius: 4px;
  background: #ffffff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
  transition: all 0.2s ease;
}

.checkbox-real:checked + .checkbox-visual {
  background: var(--exp-orange);
  border-color: var(--exp-orange);
}

.checkbox-real:checked + .checkbox-visual::after {
  content: '✓';
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
}

.checkbox-label-text {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.45;
}

.form-actions {
  display: flex;
  justify-content: center;
}

.btn--submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  padding: 0.95rem 2.5rem;
  border-radius: var(--radius-md);
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--exp-navy-950);
  background: var(--exp-orange);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(242, 140, 5, 0.4);
  transition: all 0.2s ease;
}

.btn--submit:hover:not(:disabled) {
  background: var(--exp-orange-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(242, 140, 5, 0.5);
}

.btn--submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Success View */
.success-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
}

.success-icon {
  width: 68px;
  height: 68px;
  background: #10b981;
  color: #ffffff;
  font-size: 2.2rem;
  font-weight: 900;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
}

.success-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--exp-navy-950);
  margin-bottom: 0.5rem;
}

.success-message {
  font-size: 1.05rem;
  color: var(--color-text-muted);
  max-width: 600px;
  margin-bottom: 1.5rem;
}

.dossier-ref {
  background: #f1f5f9;
  border: 1px dashed var(--exp-orange);
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.ref-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--exp-navy-900);
}

.ref-code {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--exp-orange-dark);
  letter-spacing: 0.05em;
}

.next-steps {
  background: var(--color-bg-inset);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  text-align: left;
  max-width: 600px;
  width: 100%;
  margin-bottom: 2rem;
}

.next-steps h4 {
  font-size: 1rem;
  font-weight: 800;
  color: var(--exp-navy-900);
  margin-bottom: 0.75rem;
}

.next-steps ol {
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.92rem;
  color: var(--color-text-main);
}

@media (max-width: 640px) {
  .candidature-card {
    padding: 1.5rem;
  }
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
