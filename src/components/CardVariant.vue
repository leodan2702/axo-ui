<template>
  <v-card
    class="mx-auto mb-4"
    elevation="4"
    rounded="xl"
    max-width="800"
    height="90"
    hover
  >
    <div class="d-flex align-center h-100 px-3">
      <!-- Imagen dinámica -->
      <v-avatar size="50" class="mr-4" rounded>
        <v-img v-if="image" :src="image" alt="Active Object" cover />
        <v-icon v-else size="32" color="grey">mdi-image-off</v-icon>
      </v-avatar>

      
      <div class="flex-grow-1 overflow-hidden">
        <v-card-title class="entity-name text-h6 mb-0">
          {{ truncatedTitle }}
        </v-card-title>
        <v-card-subtitle class="text-body-2">
          {{ description }}
        </v-card-subtitle>
      </div>
      <v-card-actions class="d-flex align-center justify-end ml-4">
        <v-chip size="small" color="grey-lighten-2" text-color="black" class="mr-2">
          <v-icon size="14" start>mdi-account</v-icon>
          {{ autor }}
        </v-chip>
        <slot name="button"></slot>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'  
 
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  }
})

const truncatedTitle = computed(() =>
  props.title.length > 32 ? props.title.slice(0, 32) + '…' : props.title
)
</script>

<style scoped>
.v-card {
  transition: transform 0.3s ease;
}

.v-card:hover {
  transform: scale(1.03);
}

.entity-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
