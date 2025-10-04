<template>
  <v-card class="d-flex flex-column pa-6 elevation-5 rounded-lg" style="width: 100%; max-width: 600px;">
    <!-- Título y subtítulo -->
    <v-card-title>{{ isEditing ? 'Edit Endpoint' : 'Create a New Endpoint' }}</v-card-title>
    <v-card-subtitle class="mb-4">Fill in the fields below</v-card-subtitle>

    <!-- Formulario -->
    <v-form
      ref="formRef"
      v-model="isValid"
      fast-fail
      @submit.prevent="save"
      :lazy-validation="true"
    >
      <!-- Nombre del endpoint -->
      <v-text-field
        v-model="endpointsStore.form.name"
        label="Endpoint Name"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-api"
      />

      <!-- Imagen -->
      <v-select
        v-model="endpointsStore.form.image"
        :items="availableImages"
        label="Image"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-image"
      />

      <!-- Recursos -->
      <v-row>
        <v-col cols="6">
          <v-number-input
            v-model="endpointsStore.form.resources.cpu"
            label="CPU"
            variant="filled"
            :rules="[rules.required]"
            required
            prepend-inner-icon="mdi-chip"
            min="1"
          />
        </v-col>
        <v-col cols="6">
          <v-number-input
            v-model="ramNumber"
            label="RAM"
            variant="filled"
            :rules="[rules.required]"
            required
            prepend-inner-icon="mdi-memory"
            min="1"
          />
        </v-col>
      </v-row>

      <!-- Security Policy -->
      <v-select
        v-model="endpointsStore.form.security_policy"
        :items="availablePolicies"
        item-title="name"
        item-value="sp_id"
        label="Security Policy"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-shield-lock"
      />

      <!-- Botón Guardar -->
      <div class="d-flex mt-4">
        <v-btn
          data-step="save-endpoint-button"
          :loading="endpointsStore.loading"
          color="#11222eff"
          size="large"
          type="submit"
          variant="elevated"
          block
          :disabled="!isValid"
        >
          {{ isEditing ? 'Update' : 'Save' }}
        </v-btn>
      </div>
    </v-form>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="2000"
      location="bottom center"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-divider class="my-4"></v-divider>
  </v-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useEndpointsStore } from '@/store/endpoints'
import { useSecurityPoliciesStore } from '@/store/security_policy'

const endpointsStore = useEndpointsStore()
const securityPoliciesStore = useSecurityPoliciesStore()

const availablePolicies = ref([])

const isValid = ref(false)
const formRef = ref(null)
const isEditing = ref(false)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const rules = {
  required: v => !!v || 'Field required'
}

const route = useRoute()

// --- RAM Number + Computed para enviar string "4GB" ---
const ramNumber = ref(
  endpointsStore.form.resources?.ram
    ? parseInt(endpointsStore.form.resources.ram.replace("GB", ""))
    : 1
)
const ramString = computed({
  get: () => `${ramNumber.value}GB`,
  set: val => {
    ramNumber.value = parseInt(val.replace("GB", "")) || 1
  }
})

// --- Cargar formulario ---
const loadForm = (editQuery) => {
  if (editQuery) {
    isEditing.value = true
    const epToEdit = endpointsStore.endpoints.find(e => e.endpoint_id === editQuery)
    if (epToEdit) {
      endpointsStore.form = { ...epToEdit }
      // Inicializar CPU y RAM si faltan
      if (!epToEdit.resources?.cpu || epToEdit.resources.cpu < 1) {
        endpointsStore.form.resources.cpu = 1
      }
      if (epToEdit.resources?.ram) {
        ramNumber.value = parseInt(epToEdit.resources.ram.replace("GB", "")) || 1
      }
      endpointsStore.form.security_policy = epToEdit.security_policy || ''
    }
  } else {
    isEditing.value = false
    endpointsStore.resetForm()
    formRef.value?.resetValidation()
    isValid.value = false
    endpointsStore.form.resources.cpu = 1
    ramNumber.value = 1
  }
}

const availableImages = ref([
  "nachocode/axo:endpoint-0.0.3a1"
])

// --- Al montar ---
onMounted(async () => {
  await securityPoliciesStore.get_policies()
  availablePolicies.value = securityPoliciesStore.policies.map(p => ({
    sp_id: p.sp_id,
    name: p.name ?? p.sp_id
  }))
  loadForm(route.query.edit)
})

// --- Al cambiar ruta ---
onBeforeRouteUpdate((to) => {
  loadForm(to.query.edit)
})

// --- Al desmontar ---
onBeforeUnmount(() => {
  endpointsStore.resetForm()
  formRef.value?.resetValidation()
  isValid.value = false
  ramNumber.value = 1
})

// --- Guardar ---
const save = async () => {
  // Convertir RAM a string antes de enviar
  endpointsStore.form.resources.ram = ramString.value

  let result
  if (isEditing.value) {
    // Actualizar endpoint existente
    result = await endpointsStore.update_endpoint(route.query.edit);
  } else {
    // Crear y desplegar endpoint en un solo paso
    result = await endpointsStore.deploy_endpoint();
  }

  snackbar.value = {
    show: true,
    text: result.color === "success"
      ? `Endpoint deployed successfully: ${result.data.name}`
      : `Error: ${result.message ?? ''}`,
    color: result.color === 'success' ? 'success' : 'error'
  }

  if (result.color === "success" || result.data) {
    formRef.value.resetValidation();
    if (!isEditing.value) {
      isValid.value = false
      endpointsStore.resetForm()
      ramNumber.value = 1
    }
  } else {
    snackbar.value = { show: true, text: 'Error: ' + result.message, color: 'error' }
  }
}
</script>