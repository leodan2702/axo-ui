<template>
  <v-card class="rounded-xl elevation-6 pa-4 scrollable-content" max-width="700">
    <!-- Encabezado -->
    <v-card-title class="d-flex align-center py-4">
      <v-avatar size="36" color="primary" class="mr-3">
        <v-icon>mdi-cube-outline</v-icon>
      </v-avatar>
      <div>
        <h2 class="text-h6 font-weight-bold mb-1">
          Configuración del Objeto Activo
        </h2>
        <span class="text-caption text-grey">
          {{ oa.data?.label || oa.label }}
        </span>
      </div>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pt-4">
      <!-- Constructor -->
      <div v-if="Object.keys(form.init).length">
        <v-card class="mb-6 pa-4 rounded-lg outlined">
          <h3 class="text-subtitle-1 font-weight-medium mb-3">
            <v-icon size="18" class="mr-2">mdi-cog-outline</v-icon>
            Constructor (__init__)
          </h3>
          <v-row dense>
            <v-col
              v-for="(value, param) in form.init"
              :key="param"
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.init[param]"
                :label="param"
                variant="outlined"
                density="comfortable"
                clearable
                prepend-inner-icon="mdi-tune"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- Métodos -->
      <div
        v-for="(params, method) in form.methods"
        :key="method"
        class="mb-6"
      >
        <v-card class="pa-4 rounded-lg outlined">
          <h3 class="text-subtitle-1 font-weight-medium mb-3">
            <v-icon size="18" class="mr-2">mdi-function-variant</v-icon>
            Método: {{ method }}()
          </h3>
          <v-row dense>
            <v-col
              v-for="(value, param) in params"
              :key="param"
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.methods[method][param]"
                :label="param"
                variant="outlined"
                density="comfortable"
                clearable
                prepend-inner-icon="mdi-code-braces"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
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
        Cancelar
      </v-btn>

      <v-btn
        color="primary"
        class="rounded-lg"
        @click="saveConfig"
      >
        <v-icon start>mdi-content-save</v-icon>
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { reactive, watch } from "vue"

const props = defineProps({
  oa: { type: Object, required: true },
  schema: { type: Object, required: true },
})

const emit = defineEmits(["save", "close"])

const form = reactive({ init: {}, methods: {} })

watch(
  () => props.schema,
  (schema) => {
    if (!schema) return
    form.init = {}
    schema.init?.forEach((p) => (form.init[p] = ""))

    form.methods = {}
    Object.entries(schema.methods || {}).forEach(([method, params]) => {
      form.methods[method] = {}
      params.forEach((p) => (form.methods[method][p] = ""))
    })
  },
  { immediate: true }
)

const saveConfig = () => {
  emit("save", {
    oaId: props.oa.originData.active_object_id,
    config: JSON.parse(JSON.stringify(form)),
  })
}
</script>

<style>
.scrollable-content {
  max-height: 80%; /* ajusta según prefieras */
  overflow-y: auto;
  padding-right: 8px;
}

/* Scroll discreto en navegadores basados en WebKit (Chrome, Edge, Safari) */
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

/* Scroll delgado en Firefox */
.scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
}
</style>