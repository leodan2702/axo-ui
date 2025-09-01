<template>
  <v-card class="d-flex flex-column pa-4" max-width="400">
    <v-form v-model="isValid" fast-fail @submit.prevent="save">
      
      <!-- Roles -->
      <v-combobox
        v-model="form.roles"
        :items="availableRoles"
        label="Roles"
        multiple
        chips
        clearable
        variant="filled"
        :rules="[v => v.length > 0 || 'You must select at least one role']"
        required
      />

      <!-- Requiere autenticación -->
      <v-switch
        v-model="form.requires_authentication"
        label="Requires authentication?"
        color="#11222eff"
      />

      <!-- Botón Guardar -->
      <v-btn
        :loading="loading"
        color="#11222eff"
        size="large"
        type="submit"
        variant="elevated"
        block
        class="mt-4"
        :disabled="!isValid"
      >
        Save
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup>
import { useRolesStore } from '@/store/roles'
import { ref, onMounted } from 'vue'
import { useSecurityPoliciesStore } from '@/store/security_policy'
import Security_policy from '@/views/security_policy.vue'

// Store de roles
const rolesStore = useRolesStore()
const security_policy = useSecurityPoliciesStore()

// Estado del formulario
const form = ref({
  roles: [],
  requires_authentication: false
})

// Lista de roles obtenidos del store
const availableRoles = ref([])

// Validación y loading
const isValid = ref(false)
const loading = ref(false)


// Cargar roles al montar el componente
onMounted(async () => {
  await rolesStore.get_roles()  
  availableRoles.value = rolesStore.roles.map(r => r.name)
})

// Acción al guardar
const save = async () => {
  loading.value = true
  try {
    // Crear objeto a enviar
    const newPolicy = {
      roles: form.value.roles,
      requires_authentication: form.value.requires_authentication
    }

    const result = await security_policy.create_policy(newPolicy)

    if (result.color === 'success') {
      alert('Security Policy creada correctamente!')
      form.value = { roles: [], requires_authentication: false }
    } else {
      alert('Error creando policy: ' + result.message)
    }
  } catch (e) {
    console.error(e)
    alert('Error inesperado')
  } finally {
    loading.value = false
  }
}
</script>
