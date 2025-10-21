<template>
  <v-card class="rounded-xl elevation-6 pa-4 scrollable-content" max-width="700">
    <!-- Encabezado -->
    <v-card-title class="d-flex align-center py-4">
      <v-avatar size="36" color="primary" class="mr-3">
        <v-icon>mdi-pail-plus</v-icon>
      </v-avatar>
      <div>
        <h2 class="text-h6 font-weight-bold mb-1">
          Bucket Configuration
        </h2>
        <span class="text-caption text-grey">
          {{ bucket.id || "Storage Bucket" }}
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
          <!-- sink_bucket_id -->
<v-col cols="12" md="6">
  <v-text-field
    v-model="form.sink_bucket_id"
    label="Bucket ID"
    hint="ID of the bucket where the result will be stored"
    persistent-hint
    variant="outlined"
    density="comfortable"
    clearable
    prepend-inner-icon="mdi-bucket"
  >
    <!-- Ícono abrir en nueva pestaña (solo si hay valor) -->
    <template #append-inner>
      <v-tooltip
        v-if="hasSinkBucket"
        text="Open bucket metadata in a new tab"
        location="top"
      >
        <template #activator="{ props }">
          <v-icon
            v-bind="props"
            aria-label="Open bucket metadata in a new tab"
            class="open-link-icon ml-1"
            role="button"
            tabindex="0"
            @click="openSinkMetadata"
            @keyup.enter="openSinkMetadata"
          >
            mdi-open-in-new
          </v-icon>
        </template>
      </v-tooltip>

      <v-icon
        v-else
        class="open-link-icon--disabled ml-1"
      >
        mdi-open-in-new
      </v-icon>
    </template>
  </v-text-field>
</v-col>


          <!-- sink_key -->
          <!-- <v-col cols="12" md="6">
            <v-text-field
              v-model="form.sink_key"
              label="Sink Key"
              hint="Nombre del archivo o clave de salida"
              persistent-hint
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-key-variant"
            /> -->
          <!-- </v-col> -->
        </v-row>
      </v-card>
    </v-card-text>

    <v-divider></v-divider>

    <!-- Botones de acción -->
    <v-card-actions class="d-flex justify-end mt-2">
      <v-btn
        variant="outlined"
        color="red"
        class="rounded-lg"
        @click="$emit('close')"
      >
        <v-icon start>mdi-close</v-icon>
        Cancel
      </v-btn>

      <v-btn
        variant="outlined"
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
import { reactive, watch,computed  } from "vue"
import {MICTLANX_BASE_URL} from "@/config"

const props = defineProps({
  bucket: { type: Object, required: true }, // el nodo bucket seleccionado
})

const emit = defineEmits(["save", "close"])

const form = reactive({
  sink_bucket_id: "",
  // sink_key: "",  
})

watch(
  () => props.bucket,
  (bucket) => {
    if (!bucket) return
    form.sink_bucket_id = bucket.sink_bucket_id ?? ""
    // form.sink_key = bucket.sink_key ?? "" 
  },
  { immediate: true }
)


const hasSinkBucket = computed(() => !!String(form.sink_bucket_id || "").trim())

const openSinkMetadata = () => {
  const raw = String(form.sink_bucket_id || "").trim()
  if (!raw) return
  const bucketId = encodeURIComponent(raw)
  const url = `${MICTLANX_BASE_URL}/api/v4/buckets/${bucketId}/metadata`
  // const url = `https://apix.tamps.cinvestav.mx/mictlanxx/api/v4/buckets/${bucketId}/metadata`
  // Abrir en nueva pestaña de manera segura
  window.open(url, "_blank", "noopener")
}

const saveConfig = () => {
  emit("save", {
    sink_bucket_id: form.sink_bucket_id,
    // sink_key: form.sink_key,
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
