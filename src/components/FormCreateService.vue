<template>
  <v-card class="d-flex flex-column pa-6 elevation-5 rounded-lg" style="width: 100%; max-width: 600px;">
    <v-card-title>{{ isEditing ? 'Edit Service' : 'Create a New Service' }}</v-card-title>
    <v-card-subtitle class="mb-4">Fill in the fields below</v-card-subtitle>

    <v-form
      ref="formRef"
      v-model="isValid"
      fast-fail
      @submit.prevent="save"
      :lazy-validation="true"
    >
      <!-- Name -->
      <v-text-field
        v-model="servicesStore.form.name"
        label="Service Name"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-briefcase"
      />

      <!-- Security Policy (sp_id) -->
      <v-select
        v-model="servicesStore.form.security_policy"
        :items="availablePolicies"
        item-title="name"
        item-value="sp_id"
        label="Security Policy"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-shield-lock"
      />

      <!-- Recursos -->
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="servicesStore.form.resources.cpu"
            label="CPU"
            type="number"
            variant="filled"
            :rules="[rules.required]"
            required
            prepend-inner-icon="mdi-chip"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="servicesStore.form.resources.ram"
            label="RAM (e.g. 1GB)"
            variant="filled"
            :rules="[rules.required]"
            required
            prepend-inner-icon="mdi-memory"
          />
        </v-col>
      </v-row>


      <!-- Botón Guardar -->
      <div class="d-flex mt-4">
        <v-btn
          data-step="save-service-button"
          :loading="servicesStore.loading"
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
  </v-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useServicesStore } from '@/store/services'
import { useSecurityPoliciesStore } from '@/store/security_policy'
import { useMicroservicesStore } from '@/store/microservices'

const servicesStore = useServicesStore()
const securityPoliciesStore = useSecurityPoliciesStore()
const microservicesStore = useMicroservicesStore()

const availablePolicies = ref([])

const isValid = ref(false)
const formRef = ref(null)
const isEditing = ref(false)
const snackbar = ref({ show: false, text: '', color: 'success' })

const rules = { required: v => !!v || 'Field required' }
const route = useRoute()

// --- Computed: microservices asociados ---
const associatedMicroservices = computed(() => {
  if (!servicesStore.form.service_id) return []
  return microservicesStore.microservices.filter(
    ms => ms.service_id === servicesStore.form.service_id
  )
})

// --- Cargar formulario ---
const loadForm = (editQuery) => {
  if (editQuery) {
    isEditing.value = true
    const serviceToEdit = servicesStore.services.find(s => s.service_id === editQuery)
    if (serviceToEdit) {
      servicesStore.form = { ...serviceToEdit }
    }
  } else {
    isEditing.value = false
    servicesStore.resetForm()
    formRef.value.resetValidation()
    isValid.value = false
  }
}

// --- Al montar ---
onMounted(async () => {
  await securityPoliciesStore.get_policies()
  availablePolicies.value = securityPoliciesStore.policies.map(p => ({
    sp_id: p.sp_id,
    name: p.name ?? p.sp_id
  }))

  await microservicesStore.get_microservices()
  loadForm(route.query.edit)
})

// --- Al cambiar ruta ---
onBeforeRouteUpdate((to) => loadForm(to.query.edit))

// --- Al desmontar ---
onBeforeUnmount(() => {
  servicesStore.resetForm()
  formRef.value.resetValidation()
  isValid.value = false
})

// --- Guardar ---
const save = async () => {
  let result
  if (isEditing.value) {
    result = await servicesStore.update_service(route.query.edit)
  } else {
    result = await servicesStore.create_service()
  }

  if (result.color === 'success') {
    snackbar.value = {
      show: true,
      text: isEditing.value
        ? `Service updated successfully: ${result.data.name}`
        : `Service created successfully: ${result.data.name}`,
      color: 'success'
    }
    formRef.value.resetValidation()
    if (!isEditing.value) servicesStore.resetForm()
  } else {
    snackbar.value = { show: true, text: 'Error: ' + result.message, color: 'error' }
  }
}
</script>
