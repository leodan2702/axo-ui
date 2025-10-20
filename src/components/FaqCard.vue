<template>
  <v-card
    class="faq-card rounded-xl"
    :elevation="isOpen ? 6 : 2"
    @click="toggle"
    @keyup.enter.space.prevent="toggle"
    role="button"
    :aria-expanded="isOpen.toString()"
    :aria-controls="contentId"
    tabindex="0"
  >
    <v-card-text class="d-flex align-start">
      <v-avatar class="mr-3" size="40" color="primary" variant="tonal">
        <v-icon :icon="icon" size="24" />
      </v-avatar>

      <div class="flex-grow-1">
        <div class="d-flex align-center justify-space-between">
          <h3 class="text-subtitle-1 font-weight-medium mb-1 faq-title">
            {{ title }}
          </h3>
          <v-btn
            variant="text"
            density="compact"
            icon
            :aria-label="isOpen ? 'Contraer' : 'Expandir'"
            @click.stop="toggle"
          >
            <v-icon :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"/>
          </v-btn>
        </div>

        <p v-if="subtitle" class="text-body-2 text-medium-emphasis mb-0">
          {{ subtitle }}
        </p>

        <v-expand-transition>
          <div v-show="isOpen" :id="contentId" class="mt-3">
            <div class="text-body-2 faq-answer">
              <slot>{{ answer }}</slot>
            </div>

            <div v-if="actions?.length" class="mt-3 d-flex flex-wrap gap-2">
              <v-btn
                v-for="(act, i) in actions"
                :key="i"
                :to="act.to || undefined"
                :href="act.href || undefined"
                :target="act.href ? '_blank' : undefined"
                rel="noopener"
                color="primary"
                variant="tonal"
                size="small"
                class="rounded-lg"
                @click.stop
              >
                <v-icon v-if="act.icon" :icon="act.icon" start class="mr-1" />
                {{ act.label }}
              </v-btn>
            </div>
          </div>
        </v-expand-transition>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  icon: { type: String, default: 'mdi-help-circle-outline' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  answer: { type: String, default: '' },
  defaultOpen: { type: Boolean, default: false },
  id: { type: [String, Number], default: '' },
  actions: {
    type: Array,
    default: () => [] // [{ label, to?, href?, icon? }]
  }
})

const isOpen = ref(props.defaultOpen)
const contentId = computed(() => `faq-content-${props.id || props.title.replace(/\s+/g, '-').toLowerCase()}`)

const toggle = () => { isOpen.value = !isOpen.value }
</script>

<style scoped>
.faq-card {
  transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
  border: 1px solid rgba(0,0,0,0.06);
  background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.96));
}
.faq-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  border-color: rgba(0,0,0,0.12);
}
.faq-title {
  line-height: 1.2;
}
.faq-answer {
  line-height: 1.6;
}
.gap-2 {
  gap: .5rem;
}
</style>
