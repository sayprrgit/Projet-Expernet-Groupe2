<script setup lang="ts">
import { IMAGES } from '@/data/images';
import { RESEAUX_SOCIAUX } from '@/data/reseaux';

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="app-footer" role="contentinfo">
    <div class="container footer-inner">
      <div class="footer-grid">
        <!-- Colonne 1 : Brand & Mission -->
        <div class="footer-col footer-col--brand">
          <div class="footer-logo">
            <img class="brand-mark" :src="IMAGES.logoMarkWhite" alt="Logo Expernet" width="42" height="40" />
            <div class="brand-text">
              <span class="brand-title">EXPERNET</span>
              <span class="brand-subtitle">CAMPUS &amp; PRO • LA RÉUNION</span>
            </div>
          </div>
          <p class="footer-text">
            Depuis 2002, Expernet et Expernet Campus forment les experts de la Tech, de l'Informatique, de la Cybersécurité et du Digital à La Réunion.
          </p>
          <div class="footer-badges">
            <img class="f-badge-image" :src="IMAGES.qualiopiWide" alt="Centre de formation certifié Qualiopi" loading="lazy" />
            <span class="f-badge">CFA Certifié Qualiopi</span>
            <span class="f-badge">Partenaires ENI, IPI, ESD, Digital Campus</span>
          </div>
          <nav class="footer-socials" aria-label="Expernet Campus sur les réseaux sociaux">
            <p class="footer-socials__title">Suivez-nous</p>
            <ul>
              <li v-for="reseau in RESEAUX_SOCIAUX" :key="reseau.nom">
                <a :href="reseau.url" class="social-link" target="_blank" rel="noopener noreferrer">
                  {{ reseau.nom }}
                  <svg class="social-link__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  <span class="sr-only">(nouvelle fenêtre)</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Colonne 2 : Campus Réunion -->
        <div class="footer-col">
          <h3 class="footer-heading">Notre campus à La Réunion</h3>
          <ul class="footer-list">
            <li class="campus-item">
              <strong>📍 Campus Le Port</strong>
              <span>6 rue Raymond Mondon, 97420 Le Port</span>
              <a href="tel:+262262219045" class="contact-link">📞 0262 21 90 45</a>
            </li>
          </ul>
        </div>

        <!-- Colonne 3 : Filières phares -->
        <div class="footer-col">
          <h3 class="footer-heading">Formations Référence</h3>
          <ul class="footer-list footer-links">
            <li><RouterLink to="/formations?type=campus">BTS SIO (SISR &amp; SLAM)</RouterLink></li>
            <li><RouterLink to="/formations?type=campus">Bac+4 Administrateur Système &amp; Réseau (ENI)</RouterLink></li>
            <li><RouterLink to="/formations?type=campus">Bac+4 Concepteur Développeur d'Applications (ENI)</RouterLink></li>
            <li><RouterLink to="/formations?type=campus">Bachelor Chef de Projet Digital (Digital Campus)</RouterLink></li>
            <li><RouterLink to="/formations?type=campus">Bac+5 Hacking &amp; Cybersécurité (ESD)</RouterLink></li>
            <li><RouterLink to="/formations?type=campus">Bac+5 Directeur de Projet Informatique (IPI)</RouterLink></li>
            <li><RouterLink to="/formations?type=pro">Certifications Microsoft 365, Copilot &amp; TOSA</RouterLink></li>
          </ul>
        </div>

        <!-- Colonne 4 : Espaces & Légal -->
        <div class="footer-col">
          <h3 class="footer-heading">Espaces &amp; Légal</h3>
          <ul class="footer-list footer-links">
            <li><RouterLink to="/galia">GALIA — Espace apprenant</RouterLink></li>
            <li><RouterLink to="/teams">Teams — Espace collaboratif</RouterLink></li>
            <li><RouterLink to="/planning">Planning des sessions</RouterLink></li>
            <li><RouterLink to="/a-propos">Notre histoire &amp; notre équipe</RouterLink></li>
            <li><RouterLink to="/docs">Documentation API</RouterLink></li>
            <li>
              <span class="rgaa-status">
                Accessibilité numérique : <strong>Conformité RGAA</strong>
              </span>
            </li>
            <li><RouterLink to="/candidature">Dépôt de candidature en ligne</RouterLink></li>
            <li><RouterLink to="/a-propos">Mentions légales &amp; RGPD</RouterLink></li>
          </ul>
        </div>
      </div>

      <!-- Bas de page copyright -->
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Expernet SAS &amp; Expernet Campus Réunion. Tous droits réservés.</p>
        <p class="tagline">Façonner les talents tech et digitaux de l'océan Indien.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--exp-navy-950);
  color: #ffffff;
  padding: 4.5rem 0 2rem;
  border-top: 3px solid var(--exp-orange);
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1.3fr 1fr 1fr;
  gap: 2.5rem;
  margin-bottom: 3.5rem;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.brand-mark {
  display: block;
  height: 40px;
  width: auto;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.35rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.1;
}

.brand-subtitle {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--exp-blue);
}

.footer-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.footer-badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.f-badge-image {
  height: 34px;
  width: auto;
  padding: 0.2rem 0.5rem;
  background: #ffffff;
  border-radius: var(--radius-sm);
  object-fit: contain;
}

.f-badge {
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-sm);
  color: rgba(255, 255, 255, 0.85);
}

.footer-heading {
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 1.25rem;
  letter-spacing: -0.01em;
}

.footer-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.campus-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
}

.campus-item strong {
  color: #ffffff;
}

.contact-link {
  color: var(--exp-blue);
  font-weight: 700;
  margin-top: 0.25rem;
  display: inline-block;
}

.contact-link:hover {
  text-decoration: underline;
  color: #7dd3fc;
}

.footer-links {
  gap: 0.6rem;
}

.footer-links a {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--exp-orange);
}

.rgaa-status {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.06);
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  display: inline-block;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.6);
}

.tagline {
  color: var(--exp-orange);
  font-weight: 600;
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
.footer-socials {
  margin-top: 1.5rem;
}

.footer-socials__title {
  margin-bottom: 0.6rem;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}

.footer-socials ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.85rem;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  border-radius: var(--radius-full);
  font-size: 0.84rem;
  font-weight: 800;
  color: #ffffff;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.social-link:hover {
  border-color: var(--exp-orange);
  background: var(--exp-orange);
  color: var(--exp-navy-950);
}
</style>
