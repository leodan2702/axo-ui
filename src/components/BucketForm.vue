<template>
  <v-card class="rounded-xl elevation-6 pa-4 scrollable-content" max-width="700">
    <!-- Encabezado -->
    <v-card-title class="d-flex align-center py-4">
      <v-avatar size="36" color="primary" class="mr-3">
        <v-icon>mdi-database</v-icon>
      </v-avatar>
      <div>
        <h2 class="text-h6 font-weight-bold mb-1">
          Bucket Configuration
        </h2>
        <span class="text-caption text-grey">
          {{ bucket.label || "Storage Bucket" }}
        </span>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <!-- Contenido -->
    <v-card-text class="pt-4">
      <v-card class="pa-4 rounded-lg outlined">
        <h3 class="text-subtitle-1 font-weight-medium mb-3">
          <v-icon size="18" class="mr-2">mdi-cog</v-icon>
          Storage Settings
        </h3>
        <v-row dense>
          <!-- sink_bucket_id -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.sink_bucket_id"
              label="Sink Bucket ID"
              hint="ID del bucket donde se almacenará el resultado"
              persistent-hint
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-database"
            />
          </v-col>

          <!-- sink_key -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.sink_key"
              label="Sink Key"
              hint="Nombre del archivo o clave de salida"
              persistent-hint
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-key-variant"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-card-text>

    <v-divider></v-divider>

    <!-- Botones de acción -->
    <v-card-actions class="d-flex justify-end mt-2">
      <v-btn
        variant="outlined"
        color="grey"
        class="rounded-lg"
        @click="$emit('close')"
      >
        <v-icon start>mdi-close</v-icon>
        Cancel
      </v-btn>

      <v-btn
        color="primary"
        class="rounded-lg"
        @click="saveConfig"
      >
        <v-icon start>mdi-content-save</v-icon>
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { reactive, watch } from "vue"

const props = defineProps({
  bucket: { type: Object, required: true }, // el nodo bucket seleccionado
})

const emit = defineEmits(["save", "close"])

const form = reactive({
  sink_bucket_id: "",
  sink_key: "",
})

watch(
  () => props.bucket,
  (bucket) => {
    if (!bucket) return
    form.sink_bucket_id = bucket.sink_bucket_id ?? ""
    form.sink_key = bucket.sink_key ?? ""
  },
  { immediate: true }
)

const saveConfig = () => {
  emit("save", {
    sink_bucket_id: form.sink_bucket_id,
    sink_key: form.sink_key,
  })
}
</script>

<style scoped>
.scrollable-content {
  max-height: 80%;
  overflow-y: auto;
  padding-right: 8px;
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}
.scrollable-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
.scrollable-content::-webkit-scrollbar-track {
  background: transparent;
}

.scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
}
</style>
