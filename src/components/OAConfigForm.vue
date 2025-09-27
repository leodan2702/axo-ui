<template>
  <v-card class="rounded-xl elevation-6 pa-4 scrollable-content" max-width="700">
    <!-- Encabezado -->
    <v-card-title class="d-flex align-center py-4">
      <v-avatar size="36" color="primary" class="mr-3">
        <v-icon>mdi-cube-outline</v-icon>
      </v-avatar>
      <div>
        <h2 class="text-h6 font-weight-bold mb-1">
          Active Object Configuration
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
            <v-col v-for="param in schema.init_params" :key="param.name" cols="12" md="6">
              <v-text-field
                v-model="form.init[param.name]"
                :label="`${param.name} (${param.type || 'any'})`"
                :hint="param.description || ''"
                persistent-hint
                variant="outlined"
                density="comfortable"
                clearable
                prepend-inner-icon="mdi-tune"
              />
            </v-col>
          </v-row>
        </v-card>
      </div>

      <!-- Método seleccionado -->
      <v-card class="pa-4 rounded-lg outlined">
        <h3 class="text-subtitle-1 font-weight-medium mb-3">
          <v-icon size="18" class="mr-2">mdi-function-variant</v-icon>
          Method: {{ oa.originData.method }}()
        </h3>
        <v-row dense>
          <v-col v-for="param in schema.call_params" :key="param.name" cols="12" md="6">
            <v-text-field
              v-model="form.params[param.name]"
              :label="`${param.name} (${param.type || 'any'})`"
              :hint="param.description || ''"
              persistent-hint
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-code-braces"
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
  oa: { type: Object, required: true },
  schema: { type: Object, required: true }, // schema = { init_params: [...], call_params: [...] }
})

const emit = defineEmits(["save", "close"])

const form = reactive({ init: {}, params: {} })

watch(
  () => props.schema,
  (schema) => {
    if (!schema) return

    // Constructor (__init__)
    form.init = {}
    schema.init_params?.forEach((p) => {
      form.init[p.name] = p.default ?? ""
    })

    // Método (call_params)
    form.params = {}
    schema.call_params?.forEach((p) => {
      form.params[p.name] = p.default ?? ""
    })
  },
  { immediate: true }
)

const saveConfig = () => {
  emit("save", {
    oaId: props.oa.originData.active_object_id,
    method: props.oa.originData.method,
    config: JSON.parse(JSON.stringify(form)),
  })
}
</script>

<style>
.scrollable-content {
  max-height: 80%;
  overflow-y: auto;
  padding-right: 8px;
}

/* Scroll discreto en navegadores WebKit */
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
