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
      <!-- Module -->
      <v-text-field
        v-model="activeObjectsStore.form.axo_module"
        label="Module"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-cube-outline"
      />

      <!-- Class Name -->
      <v-text-field
        v-model="activeObjectsStore.form.axo_class_name"
        label="Class Name"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-file-document-outline"
      />

      <!-- Endpoint asociado -->
      <v-select
        v-model="activeObjectsStore.form.axo_endpoint_id"
        :items="availableEndpoints"
        item-title="name"
        item-value="endpoint_id"
        label="Associated Endpoint"
        variant="filled"
        prepend-inner-icon="mdi-api"
      />

      <!-- Read Only -->
      <v-switch
        v-model="activeObjectsStore.form.axo_is_read_only"
        label="Read Only"
      />

      <!-- Version editable (sin spinner) -->
      <v-text-field
        v-model="activeObjectsStore.form.axo_version"
        label="Version"
        variant="filled"
        prepend-inner-icon="mdi-numeric"
        :rules="[rules.required, rules.numeric]"
        required
        type="text"
      />

      <!-- Alias -->
      <v-text-field
        v-model="activeObjectsStore.form.axo_alias"
        label="Alias"
        variant="filled"
        prepend-inner-icon="mdi-tag"
      />

      <!-- URI -->
      <v-text-field
        v-model="activeObjectsStore.form.axo_uri"
        label="URI"
        variant="filled"
        prepend-inner-icon="mdi-link-variant"
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
      ></v-combobox>


      <!-- Botón Guardar -->
      <div class="d-flex mt-4">
        <v-btn
          :loading="activeObjectsStore.loading"
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

const activeObjectsStore = useActiveObjectsStore()
const endpointsStore = useEndpointsStore()

const availableEndpoints = ref([])
const isValid = ref(false)
const formRef = ref(null)
const isEditing = ref(false)

const snackbar = ref({ show: false, text: '', color: 'success' })
const rules = {
  required: v => !!v || 'Field required',
  numeric: v => !isNaN(v) || 'Must be a number'
}

const route = useRoute()

// --- Cargar formulario ---
const loadForm = (editQuery) => {
  if (editQuery) {
    isEditing.value = true
    const aoToEdit = activeObjectsStore.activeObjects.find(e => e.active_object_id === editQuery)
    if (aoToEdit) activeObjectsStore.form = { ...aoToEdit }
  } else {
    isEditing.value = false
    activeObjectsStore.resetForm()
    formRef.value.resetValidation()
    isValid.value = false
  }
}

// --- Al montar ---
onMounted(async () => {
  await endpointsStore.get_endpoints()
  availableEndpoints.value = endpointsStore.endpoints.map(e => ({ name: e.name, endpoint_id: e.endpoint_id }))
  loadForm(route.query.edit)
})

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
})
</script>
