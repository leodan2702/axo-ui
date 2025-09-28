<template>
  <v-card class="d-flex flex-column pa-6 elevation-5 rounded-lg" style="width: 100%; max-width: 600px;">
    <!-- Título y subtítulo -->
    <v-card-title>{{ isEditing ? 'Edit Microservice' : 'Create a New Microservice' }}</v-card-title>
    <v-card-subtitle class="mb-4">Fill in the fields below</v-card-subtitle>

    <!-- Formulario -->
    <v-form
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
          <v-text-field
            v-model="microservicesStore.form.resources.cpu"
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
            v-model="microservicesStore.form.resources.ram"
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
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

// --- Cargar formulario ---
const loadForm = (editQuery) => {
  if (editQuery) {
    isEditing.value = true
    const msToEdit = microservicesStore.microservices.find(m => m.microservice_id === editQuery)
    if (msToEdit) {
      microservicesStore.form = { ...msToEdit }
    }
  } else {
    isEditing.value = false
    microservicesStore.resetForm()
    formRef.value.resetValidation()
    isValid.value = false
  }
}

// --- Al montar ---
onMounted(async () => {
  await servicesStore.get_services()
  availableServices.value = servicesStore.services.map(s => ({ service_id: s.service_id, name: s.name }))
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
})

// --- Guardar ---
const save = async () => {
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
      isValid.value = false
      formRef.value.resetValidation()
    }
  } else {
    snackbar.value = { show: true, text: 'Error: ' + result.message, color: 'error' }
  }
}
</script>
