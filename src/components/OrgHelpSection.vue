<template>
  <div class="pa-4 pa-md-8">
    <!-- Encabezado -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <h1 class="text-h5 text-md-h4 font-weight-bold mb-1">{{ title }}</h1>
        <div class="text-body-2 text-medium-emphasis">
          {{ subtitle }}
        </div>
      </div>

      <v-avatar size="44" color="primary" variant="tonal" class="d-none d-md-flex">
        <v-icon icon="mdi-information-outline" />
      </v-avatar>
    </div>

    <v-card class="rounded-xl elevation-4">
      <v-card-text>
        <!-- App / versión -->
        <div class="mb-2">
          <div class="text-subtitle-1 font-weight-medium">{{ appName }}</div>
          <div class="text-body-2 text-medium-emphasis">
            {{ $tVersion }} {{ version }}
          </div>
        </div>

        <v-divider class="my-4" />

        <!-- Contáctanos -->
        <div class="mb-2">
          <div class="text-subtitle-1 font-weight-bold mb-2">{{ $tContactUs }}</div>
          <div class="text-body-2 text-medium-emphasis mb-4" v-if="contactIntro">
            {{ contactIntro }}
          </div>
        </div>

        <!-- Lista de enlaces -->
        <v-list density="comfortable" class="rounded-lg">
          <v-list-item
            v-for="(link, i) in links"
            :key="i"
            :to="link.to || undefined"
            :href="link.href || undefined"
            :target="link.href ? '_blank' : undefined"
            rel="noopener"
            class="rounded-lg mb-1"
          >
            <template #prepend>
              <v-icon :icon="link.icon" class="mr-3" />
            </template>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
            <template #append>
              <v-icon icon="mdi-chevron-right" class="text-medium-emphasis" />
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-divider class="my-2" />

      <!-- Footer -->
      <v-card-actions class="d-flex justify-space-between">
        <div class="text-caption text-medium-emphasis">
          © {{ orgName }} {{ year }}
        </div>
        <div class="text-caption text-disabled" v-if="legalNote">
          {{ legalNote }}
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Encabezado
  title: { type: String, default: 'Help' },
  subtitle: { type: String, default: '' },

  // App
  appName: { type: String, default: '' },
  version: { type: String, default: '0.0.1a2' },

  // Contacto
  contactIntro: {
    type: String,
    default: 'Nos gustaría saber qué piensas. Contáctanos o revisa los recursos de ayuda.'
  },

  // Organización
  orgName: { type: String, default: 'Tu Organización' },
  legalNote: { type: String, default: '' },

  // Enlaces
  links: {
    type: Array,
    default: () => ([
      // Ejemplos:
      // { text: 'Contáctanos', icon: 'mdi-email-outline', href: 'mailto:soporte@org.com' },
      // { text: 'Centro de ayuda', icon: 'mdi-lifebuoy', to: '/help-center' },
    ])
  },

  // Textos (por si quieres internacionalizar rápido sin i18n)
  tVersion: { type: String, default: 'Versión' },
  tContactUs: { type: String, default: 'Contáctanos' }
})

const year = computed(() => new Date().getFullYear())

// Mappers para mantener flexibilidad si cambias idioma luego
const $tVersion = computed(() => props.tVersion)
const $tContactUs = computed(() => props.tContactUs)
</script>

<style scoped>
/* Sutiles mejoras visuales */
.v-list-item:hover {
  background: rgba(0,0,0,.04);
}
@media (prefers-color-scheme: dark) {
  .v-list-item:hover {
    background: rgba(255,255,255,.06);
  }
}
</style>
