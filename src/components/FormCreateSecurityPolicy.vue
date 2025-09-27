<template>
  <v-card class="d-flex flex-column pa-6 elevation-5 rounded-lg" style="width: 100%; max-width: 600px;">
    <v-card-title>{{ isEditing ? 'Edit Security Policy' : 'Create a New Security Policy' }}</v-card-title>
    <v-card-subtitle class="mb-4">Fill in the fields below</v-card-subtitle>

    <v-form ref="formRef" v-model="isValid" fast-fail @submit.prevent="save" :lazy-validation="true">
      
      <!-- Name -->
      <v-text-field
        v-model="securityPoliciesStore.form.name"
        label="Policy Name"
        variant="filled"
        :rules="[rules.required]"
        required
      />

      <!-- Roles -->
      <v-select
        v-model="securityPoliciesStore.form.roles"
        :items="availableRoles"
        item-title="name"
        item-value="role_id"
        label="Roles"
        multiple
        chips
        clearable
        variant="filled"
        :rules="[rules.minOne]"
        required
      />

      <!-- Requiere autenticación -->
      <v-switch
        v-model="securityPoliciesStore.form.requires_authentication"
        label="Requires authentication?"
        color="#11222eff"
      />

      <!-- Botón Guardar -->
      <div class="d-flex mt-4" data-step="save-policy-button">
        <v-btn
          :loading="securityPoliciesStore.loading"
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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useRolesStore } from '@/store/roles'
import { useSecurityPoliciesStore } from '@/store/security_policy'

const rolesStore = useRolesStore()
const securityPoliciesStore = useSecurityPoliciesStore()
const availableRoles = ref([])

const isValid = ref(false)
const formRef = ref(null)
const snackbar = ref({ show: false, text: '', color: 'success' })

const rules = {
  required: v => !!v || 'This field is required',
  minOne: v => (v && v.length > 0) || 'Select at least one role'
}

const route = useRoute()
const isEditing = ref(false)

// Cargar roles para combobox
onMounted(async () => {
  await rolesStore.get_roles()
  availableRoles.value = rolesStore.roles.map(r => ({ role_id: r.role_id, name: r.name }))

  loadForm(route.query.edit)
})

// Función para cargar formulario al editar
const loadForm = (editQuery) => {
  if (editQuery) {
    isEditing.value = true
    const policyToEdit = securityPoliciesStore.policies.find(p => p.sp_id === editQuery)
    if (policyToEdit) securityPoliciesStore.form = { ...policyToEdit }
  } else {
    isEditing.value = false
    securityPoliciesStore.resetForm()
    nextTick(() => formRef.value.resetValidation())
    isValid.value = false
  }
}

// Ejecutar cuando la ruta cambia
onBeforeRouteUpdate((to) => {
  loadForm(to.query.edit)
})

// Limpiar al salir del componente
onBeforeUnmount(() => {
  securityPoliciesStore.resetForm()
  formRef.value.resetValidation()
  isValid.value = false
})

// Guardar / actualizar policy
const save = async () => {
  let result
  const spId = route.query.edit

  if (isEditing.value) {
    result = await securityPoliciesStore.update_policy(spId)
  } else {
    result = await securityPoliciesStore.create_policy()
  }

  if (result.color === 'success') {
    snackbar.value = {
      show: true,
      text: isEditing.value
        ? `Policy updated successfully: ${result.data.name}`
        : `Policy created successfully: ${result.data.name}`,
      color: 'success'
    }

    formRef.value.resetValidation()
    if (!isEditing.value) {
      isValid.value = false
      securityPoliciesStore.resetForm()
    }
  } else {
    snackbar.value = { show: true, text: 'Error: ' + result.message, color: 'error' }
  }
}
</script>

