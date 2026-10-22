<script setup lang="ts">
import { watchEffect } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    totalFormations?: number;
  }>(),
  {
    title: 'Expernet & Expernet Campus La Réunion | Formations Tech, Alternance & CPF',
    description:
      'Portail unifié Expernet et Expernet Campus à La Réunion (974). Formations d’excellence du Bac+2 au Bac+5 en alternance (BTS SIO, Bachelors, Mastères) et certifications continues éligibles CPF.',
    keywords:
      'Expernet, Expernet Campus, La Réunion, BTS SIO, Bachelor développeur web, Cybersécurité, Alternance 974, Formation CPF, Titre RNCP, Sainte-Clotilde, Saint-Pierre',
    url: 'https://expernet.re/',
    totalFormations: 12,
  },
);

watchEffect(() => {
  // Titre dynamique
  document.title = props.title;

  // Mise à jour ou création des meta tags dynamiques
  const setMeta = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('description', props.description);
  setMeta('keywords', props.keywords);
  setMeta('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');

  // Open Graph
  setMeta('og:title', props.title, true);
  setMeta('og:description', props.description, true);
  setMeta('og:url', props.url, true);
  setMeta('og:type', 'website', true);
  setMeta('og:locale', 'fr_FR', true);

  // Schema.org JSON-LD structured data
  const existingScript = document.getElementById('schema-org-jsonld');
  if (existingScript) {
    existingScript.remove();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://expernet.re/#organization',
        name: 'Expernet & Expernet Campus Réunion',
        url: 'https://expernet.re',
        logo: 'https://expernet-campus.re/wp-content/uploads/2022/02/expernet-campus-informatique-et-marketing-digital.png',
        description: props.description,
        telephone: '+262262294020',
        address: [
          {
            '@type': 'PostalAddress',
            streetAddress: '2 rue Émile Hugot, Parc Technologique Universitaire',
            addressLocality: 'Sainte-Clotilde',
            postalCode: '97490',
            addressCountry: 'FR',
          },
          {
            '@type': 'PostalAddress',
            addressLocality: 'Saint-Pierre',
            postalCode: '97410',
            addressCountry: 'FR',
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://expernet.re/#website',
        url: 'https://expernet.re',
        name: 'Expernet Formation Tech Réunion',
        publisher: {
          '@id': 'https://expernet.re/#organization',
        },
      },
    ],
  };

  const script = document.createElement('script');
  script.id = 'schema-org-jsonld';
  script.type = 'application/ld+json';
  script.text = JSON.stringify(jsonLd);
  document.head.appendChild(script);
});
</script>

<template>
  <span class="sr-only" aria-hidden="true">SEO et métadonnées configurés pour Expernet Réunion</span>
</template>
