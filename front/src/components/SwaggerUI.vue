<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle.js'
import SwaggerUIStandalonePreset from 'swagger-ui-dist/swagger-ui-standalone-preset.js'
import 'swagger-ui-dist/swagger-ui.css'

const props = defineProps<{ url: string }>()

const container = ref<HTMLElement | null>(null)
let instance: { unmount(): void } | null = null

onMounted(() => {
  if (!container.value) return

  instance = SwaggerUIBundle({
    url: props.url,
    domNode: container.value,
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: 'StandaloneLayout',
    docExpansion: 'list',
    defaultModelsExpandDepth: 1,
    tryItOutEnabled: true,
  })
})

onBeforeUnmount(() => {
  instance?.unmount()
  instance = null
})
</script>

<template>
  <div ref="container" class="swagger-ui"></div>
</template>

<style scoped>
.swagger-ui :deep(.swagger-ui .topbar) {
  display: none;
}
</style>
