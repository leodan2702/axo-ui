<template>
  <v-card class="d-flex flex-column pa-6 elevation-5 rounded-lg" style="width: 100%; max-width: 600px;">
    <!-- Título y subtítulo -->
    <v-card-title>{{ isEditing ? 'Edit Microservice' : 'Create a New Microservice' }}</v-card-title>
    <v-card-subtitle class="mb-4">Fill in the fields below</v-card-subtitle>

    <!-- Formulario -->
    <v-form
      data-step="create-service-button"
      ref="formRef"
      v-model="isValid"
      fast-fail
      @submit.prevent="save"
      :lazy-validation="true"
    >
      <!-- Nombre del microservice -->
      <v-text-field
        v-model="microservicesStore.form.name"
        label="Microservice Name"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-server"
      />

      <!-- Selección de servicio -->
      <v-select
        v-model="microservicesStore.form.service_id"
        :items="availableServices"
        item-title="name"
        item-value="service_id"
        label="Service"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-cog"
      />

      <!-- Recursos -->
      <v-row>
        <v-col cols="6">
          <v-number-input
            v-model="microservicesStore.form.resources.cpu"
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

      <!-- Botón Guardar -->
      <div class="d-flex mt-4">
        <v-btn
          data-step="save-microservice-button"
          :loading="microservicesStore.loading"
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
      timeout="3000"
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
import { useMicroservicesStore } from '@/store/microservices'
import { useServicesStore } from '@/store/services'

const microservicesStore = useMicroservicesStore()
const servicesStore = useServicesStore()

const availableServices = ref([])
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
  microservicesStore.form.resources?.ram
    ? parseInt(microservicesStore.form.resources.ram.replace("GB", ""))
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
    const msToEdit = microservicesStore.microservices.find(m => m.microservice_id === editQuery)
    if (msToEdit) {
      microservicesStore.form = { ...msToEdit }

      // Asegurar que CPU y RAM tengan valores válidos
      if (!msToEdit.resources?.cpu || msToEdit.resources.cpu < 1) {
        microservicesStore.form.resources.cpu = 1
      }
      if (msToEdit.resources?.ram) {
        ramNumber.value = parseInt(msToEdit.resources.ram.replace("GB", "")) || 1
      }
    }
  } else {
    isEditing.value = false
    microservicesStore.resetForm()
    formRef.value.resetValidation()
    isValid.value = false

    // Valores por defecto
    microservicesStore.form.resources.cpu = 1
    ramNumber.value = 1
  }
}

// --- Al montar ---
onMounted(async () => {
  await servicesStore.get_services()
  availableServices.value = servicesStore.services.map(s => ({
    service_id: s.service_id,
    name: s.name ?? s.service_id
  }))
  loadForm(route.query.edit)
})

// --- Al cambiar ruta ---
onBeforeRouteUpdate((to) => {
  loadForm(to.query.edit)
})

// --- Al desmontar ---
onBeforeUnmount(() => {
  microservicesStore.resetForm()
  formRef.value.resetValidation()
  isValid.value = false
  ramNumber.value = 1
})

// --- Guardar ---
const save = async () => {
  // Convertir RAM a string "4GB" antes de enviar
  microservicesStore.form.resources.ram = ramString.value

  let result
  if (isEditing.value) {
    result = await microservicesStore.update_microservice(route.query.edit)
  } else {
    result = await microservicesStore.create_microservice()
  }

  if (result.color === 'success') {
    snackbar.value = {
      show: true,
      text: isEditing.value
        ? `Microservice updated successfully: ${result.data.name}`
        : `Microservice created successfully: ${result.data.name}`,
      color: 'success'
    }

    if (!isEditing.value) {
      microservicesStore.resetForm()
      formRef.value.resetValidation()
      ramNumber.value = 1
      isValid.value = false
    }
  } else {
    snackbar.value = { show: true, text: 'Error: ' + result.message, color: 'error' }
  }
}
</script>
