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
          <!-- Constructor (__init__) -->
          <v-row dense>
            <v-col v-for="param in schema.init_params" :key="param.name" cols="12" md="6">
              <v-radio-group v-model="formMode.init[param.name]" row density="compact" class="mb-2">
                <v-radio label="Literal" value="literal"></v-radio>
                <v-radio label="Ref" value="ref"></v-radio>
              </v-radio-group>

              <!-- Campo literal -->
              <v-text-field v-if="formMode.init[param.name] === 'literal'" v-model="form.init[param.name]"
                :label="`${param.name} (${param.type || 'any'})`" :hint="param.description || ''" persistent-hint
                variant="outlined" density="comfortable" clearable prepend-inner-icon="mdi-tune" />

              <!-- Campo ref -->
              <v-text-field v-else v-model="form.initRefs[param.name]" :label="`${param.name} ($ref)`"
                hint="MictlanX reference (mictlanx://...)" persistent-hint variant="outlined" density="comfortable"
                clearable prepend-inner-icon="mdi-link-variant" />
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
            <v-radio-group v-model="formMode.call[param.name]" row density="compact" class="mb-2">
              <v-radio label="Literal" value="literal"></v-radio>
              <v-radio label="Ref" value="ref"></v-radio>
            </v-radio-group>

            <!-- Campo literal -->
            <v-text-field v-if="formMode.call[param.name] === 'literal'" v-model="form.params[param.name]"
              :label="`${param.name} (${param.type || 'any'})`" :hint="param.description || ''" persistent-hint
              variant="outlined" density="comfortable" clearable prepend-inner-icon="mdi-code-braces" />

            <!-- Campo ref -->
            <v-text-field v-else v-model="form.paramRefs[param.name]" :label="`${param.name} ($ref)`"
              hint="Referencia MictlanX (mictlanx://...)" persistent-hint variant="outlined" density="comfortable"
              clearable prepend-inner-icon="mdi-link-variant" />
          </v-col>
        </v-row>

      </v-card>
    </v-card-text>

    <v-divider></v-divider>

    <!-- Botones de acción -->
    <v-card-actions class="d-flex justify-end mt-2">
      <v-btn variant="outlined" color="grey" class="rounded-lg" @click="$emit('close')">
        <v-icon start>mdi-close</v-icon>
        Cancel
      </v-btn>

      <v-btn color="primary" class="rounded-lg" @click="saveConfig">
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
  schema: { type: Object, required: true },
})

const emit = defineEmits(["save", "close"])

const form = reactive({
  init: {},       
  initRefs: {},   
  params: {},
  paramRefs: {},
})

const formMode = reactive({ init: {}, call: {} })

watch(
  () => props.schema,
  (schema) => {
    if (!schema) return

    // Constructor (__init__)
    schema.init_params?.forEach((p) => {
      const saved = props.oa.originData.parameters?.init?.[p.name]

      if (saved && typeof saved === "object" && "ref" in saved) {
        // si estaba guardado como ref
        formMode.init[p.name] = "ref"
        form.initRefs[p.name] = saved.ref
        form.init[p.name] = ""  // vaciamos literal
      } else {
        formMode.init[p.name] = "literal"
        form.init[p.name] = saved ?? p.default ?? ""
        form.initRefs[p.name] = ""
      }
    })

    // Método (call_params)
    schema.call_params?.forEach((p) => {
      const saved = props.oa.originData.parameters?.call?.[p.name]

      if (saved && typeof saved === "object" && saved.ref !== undefined) {
        // Si estaba guardado como ref
        formMode.call[p.name] = "ref"
        form.paramRefs[p.name] = saved.ref
        form.params[p.name] = "" // limpiar literal
      } else if (typeof saved === "string" || typeof saved === "number" || typeof saved === "boolean") {
        // Si estaba guardado como literal
        formMode.call[p.name] = "literal"
        form.params[p.name] = saved
        form.paramRefs[p.name] = ""
      } else {
        // Si no había nada, usar default
        formMode.call[p.name] = "literal"
        form.params[p.name] = p.default ?? ""
        form.paramRefs[p.name] = ""
      }
    })

  },
  { immediate: true }
)


const buildParams = (values, refs, modes) => {
  const out = {}
  for (const key of Object.keys(modes)) {
    if (modes[key] === "ref") {
      out[key] = { ref: refs[key] || "" }   // Si es ref, usar refs
    } else if (modes[key] === "literal") {
      out[key] = values[key] || ""          // Si es literal, usar values
    }
  }
  return out
}


const saveConfig = () => {
  emit("save", {
    oaId: props.oa.originData.active_object_id,
    method: props.oa.originData.method,
    config: {
      init: buildParams(form.init, form.initRefs, formMode.init),
      call: buildParams(form.params, form.paramRefs, formMode.call),
    },
  })
}
</script>
