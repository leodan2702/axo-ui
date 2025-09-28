<template>
  <v-card class="d-flex flex-column pa-6 elevation-5 rounded-lg" style="width: 100%; max-width: 600px;">
    <!-- Título y subtítulo -->
    <v-card-title>{{ isEditing ? 'Edit Role' : 'Create a New Role' }}</v-card-title>
    <v-card-subtitle class="mb-4">Fill in the fields below</v-card-subtitle>

    <!-- Formulario -->
    <v-form
      ref="formRef"
      v-model="isValid"
      fast-fail
      @submit.prevent="save"
      :lazy-validation="true"
    >
      <!-- Nombre del rol -->
      <v-text-field
        v-model="rolesStore.form.name"
        label="Role Name"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-account"
      />

      <!-- Descripción -->
      <v-textarea
        v-model="rolesStore.form.description"
        label="Description"
        variant="filled"
        rows="2"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-text"
      />

      <!-- Permisos -->
      <v-select
        v-model="rolesStore.form.permissions"
        :items="availablePermissions"
        label="Permissions"
        multiple
        chips
        clearable
        variant="filled"
        :rules="[rules.minOne]"
        prepend-inner-icon="mdi-lock"
        required
        @focus="permissionsTouched = true"
      />

      <!-- Botones -->
      <div class="d-flex mt-4" data-step="rol-button">
        <v-btn
          :loading="rolesStore.loading"
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
import { useRolesStore } from '@/store/roles'

const availablePermissions = ref(['Read', 'Write', 'Delete'])
const rolesStore = useRolesStore()
const isValid = ref(false)
const formRef = ref(null)
const permissionsTouched = ref(false)

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const rules = {
  required: v => !!v || 'Field required',
  minOne: v => (permissionsTouched.value ? (v && v.length > 0 || 'Select at least one permission') : true)
}

const route = useRoute()
const isEditing = ref(false)

const loadForm = (editQuery) => {
  if (editQuery) {
    isEditing.value = true
    const roleToEdit = rolesStore.roles.find(role => role.role_id === editQuery)
    if (roleToEdit) rolesStore.form = { ...roleToEdit }
  } else {
    isEditing.value = false
    rolesStore.resetForm()
    permissionsTouched.value = false
    formRef.value.resetValidation()
    isValid.value = false
  }
}

onMounted(() => {
  loadForm(route.query.edit)
})

onBeforeRouteUpdate((to) => {
  loadForm(to.query.edit)
})

onBeforeUnmount(() => {
  rolesStore.resetForm()
  permissionsTouched.value = false
  formRef.value.resetValidation()
  isValid.value = false
})

const save = async () => {
  let result
  if (isEditing.value) {
    const roleId = route.query.edit 
    result = await rolesStore.update_role(roleId)
  } else {
    result = await rolesStore.create_role()
  }

  if (result.color === 'success') {
    snackbar.value = {
      show: true,
      text: isEditing.value
        ? `Role updated successfully: ${result.data.name}`
        : `Role created successfully: ${result.data.name}`,
      color: 'success'
    }

    formRef.value.resetValidation()

    if (!isEditing.value){
      isValid.value = false
      rolesStore.resetForm()
      permissionsTouched.value = false
    }
  } else {
    snackbar.value = { show: true, text: 'Error: ' + result.message, color: 'error' }
  }
}
</script>
