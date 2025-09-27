<template>
  <v-card class="d-flex flex-column pa-6 elevation-5 rounded-lg" style="width: 100%; max-width: 800px;">
    <v-card-title>{{ isEditing ? 'Edit Active Object' : 'Create a New Active Object' }}</v-card-title>
    <v-card-subtitle class="mb-4">Fill in the fields below</v-card-subtitle>

    <v-form
      ref="formRef"
      v-model="isValid"
      fast-fail
      @submit.prevent="save"
      :lazy-validation="true"
    >
      <!-- Alias -->
      <v-text-field
        v-model="activeObjectsStore.form.axo_alias"
        label="Alias"
        variant="filled"
        prepend-inner-icon="mdi-tag"
      />

      <!-- Endpoint asociado -->
      <v-select
        v-model="activeObjectsStore.form.axo_endpoint_id"
        :items="availableEndpoints"
        item-title="name"
        item-value="endpoint_id"
        label="Endpoint"
        variant="filled"
        prepend-inner-icon="mdi-cube-outline"
      />

      <!-- Servicio (guía) -->
      <v-select
        v-model="selectedService"
        :items="servicesStore.services"
        item-title="name"
        item-value="service_id"
        label="Service"
        variant="filled"
        prepend-inner-icon="mdi-cube-outline"
        @update:model-value="onServiceChange"
      />

      <!-- Microservice -->
      <v-select
        v-model="selectedMicroservice"
        :items="microservices"
        item-title="name"
        item-value="microservice_id"
        label="Microservice"
        variant="filled"
        prepend-inner-icon="mdi-cogs"
        :disabled="!selectedService || microservices.length === 0"
        @update:model-value="onMicroserviceChange"
      />

      <!-- Version editable -->
      <v-text-field
        v-model="activeObjectsStore.form.axo_version"
        label="Version"
        variant="filled"
        prepend-inner-icon="mdi-numeric"
        :rules="[rules.required, rules.numeric]"
        required
        type="text"
      />

      <!-- Dependencias -->
      <v-combobox
        v-model="activeObjectsStore.form.axo_dependencies"
        multiple
        label="Dependencies"
        variant="filled"
        prepend-inner-icon="mdi-package-variant"
        placeholder="Add dependencies one by one"
        chips
        clearable
      />

      <!-- Validación oculta del código -->
      <v-textarea
        v-model="activeObjectsStore.form.axo_code"
        label="Code"
        variant="filled"
        :rules="[rules.codeRequired]"
        required
        style="display: none"
      />

      <!-- Botón Guardar -->
      <div class="d-flex mt-4">
        <v-btn
          data-step="persistency-button"
          :loading="activeObjectsStore.loading"
          color="#11222eff"
          size="large"
          type="submit"
          variant="elevated"
          block
          :disabled="!isValid"
        >
          {{ isEditing ? 'Update' : 'Persistency' }}
        </v-btn>
      </div>
    </v-form>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="bottom center"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>

    <v-divider class="my-4"></v-divider>
  </v-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useActiveObjectsStore } from '@/store/active_objects'
import { useEndpointsStore } from '@/store/endpoints'
import { useMicroservicesStore } from '@/store/microservices'
import { useServicesStore } from '@/store/services'

const activeObjectsStore = useActiveObjectsStore()
const endpointsStore = useEndpointsStore()
const microservicesStore = useMicroservicesStore()
const servicesStore = useServicesStore()

const availableEndpoints = ref([])
const microservices = ref([]) // Microservices filtrados por service
const selectedService = ref(null)
const selectedServiceName = ref('')
const selectedMicroservice = ref(null)

const isValid = ref(false)
const formRef = ref(null)
const isEditing = ref(false)

const snackbar = ref({ show: false, text: '', color: 'success' })
const rules = {
  required: v => !!v || 'Field required',
  numeric: v => !isNaN(v) || 'Must be a number',
  codeRequired: v => (v && v.trim().length > 0) || 'Code is required'
}

const route = useRoute()

// --- Cargar formulario ---
const loadForm = (editQuery) => {
  if (editQuery) {
    isEditing.value = true
    const aoToEdit = activeObjectsStore.activeObjects.find(e => e.active_object_id === editQuery)
    if (aoToEdit) {
      activeObjectsStore.form = { ...aoToEdit }
      selectedMicroservice.value = aoToEdit.axo_microservice_id

      // Asignar service correspondiente
      const ms = microservicesStore.microservices.find(m => m.microservice_id === aoToEdit.axo_microservice_id)
      selectedService.value = ms ? ms.service_id : null
      selectedServiceName.value = ms ? servicesStore.services.find(s => s.service_id === ms.service_id)?.name || '' : ''

      // Filtrar microservices del service
      if (selectedService.value) {
        microservices.value = microservicesStore.microservices
          .filter(m => m.service_id === selectedService.value)
          .map(m => ({
            microservice_id: m.microservice_id,
            name: m.name,
            service_name: servicesStore.services.find(s => s.service_id === m.service_id)?.name || ''
          }))
      }
    }
  } else {
    isEditing.value = false
    activeObjectsStore.resetForm()
    formRef.value.resetValidation()
    isValid.value = false
    selectedMicroservice.value = null
    selectedService.value = null
    selectedServiceName.value = ''
  }
}

// --- Al montar ---
onMounted(async () => {
  await endpointsStore.get_endpoints()
  availableEndpoints.value = endpointsStore.endpoints.map(e => ({ name: e.name, endpoint_id: e.endpoint_id }))

  await servicesStore.get_services()
  await microservicesStore.get_microservices()

  // Inicialmente todos los microservices
  microservices.value = microservicesStore.microservices.map(ms => {
    const svc = servicesStore.services.find(s => s.service_id === ms.service_id)
    return {
      microservice_id: ms.microservice_id,
      name: ms.name,
      service_name: svc ? svc.name : ''
    }
  })

  loadForm(route.query.edit)
})

// --- Cambiar service seleccionado ---
const onServiceChange = (serviceId) => {
  selectedService.value = serviceId

  // Filtrar microservices
  const filteredMS = microservicesStore.microservices.filter(ms => ms.service_id === serviceId)
  microservices.value = filteredMS.map(ms => ({
    microservice_id: ms.microservice_id,
    name: ms.name,
    service_name: servicesStore.services.find(s => s.service_id === ms.service_id)?.name || ''
  }))

  // Limpiar microservice si no pertenece al service
  if (!microservices.value.find(m => m.microservice_id === selectedMicroservice.value)) {
    selectedMicroservice.value = null
    activeObjectsStore.form.axo_microservice_id = null
  }
}

// --- Cambiar microservice seleccionado ---
const onMicroserviceChange = (msId) => {
  const ms = microservices.value.find(m => m.microservice_id === msId)
  if (ms) {
    selectedServiceName.value = ms.service_name
    activeObjectsStore.form.axo_microservice_id = ms.microservice_id
  } else {
    selectedServiceName.value = ''
    activeObjectsStore.form.axo_microservice_id = null
  }
}

// --- Guardar ---
const save = async () => {
  let result
  if (isEditing.value) {
    result = await activeObjectsStore.updateActiveObject(route.query.edit)
  } else {
    result = await activeObjectsStore.createActiveObject()
  }

  if (result.color === 'success') {
    snackbar.value = {
      show: true,
      text: isEditing.value
        ? `Active Object updated successfully: ${result.data.axo_class_name}`
        : `Active Object created successfully: ${result.data.axo_class_name}`,
      color: 'success'
    }

    formRef.value.resetValidation()
    if (!isEditing.value) {
      isValid.value = false
      activeObjectsStore.resetForm()
      selectedService.value = null
      selectedServiceName.value = ''
      selectedMicroservice.value = null
    }
  } else {
    snackbar.value = { show: true, text: 'Error: ' + result.message, color: 'error' }
  }
}

// --- Al desmontar ---
onBeforeUnmount(() => {
  activeObjectsStore.resetForm()
  formRef.value.resetValidation()
  isValid.value = false
  selectedService.value = null
  selectedServiceName.value = ''
  selectedMicroservice.value = null
})
</script>
