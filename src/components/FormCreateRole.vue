<template>
  <v-card class="d-flex flex-column pa-4" max-width="400">
    <v-form v-model="isValid" fast-fail @submit.prevent="save">
      
      <!-- Nombre del rol -->
      <v-text-field
        v-model="form.name"
        label="Name of rol"
        variant="filled"
        :rules="[rules.required]"
        required
      />

      <!-- Descripción -->
      <v-textarea
        v-model="form.description"
        label="Description"
        variant="filled"
        rows="2"
        :rules="[rules.required]"
        required
      />

      <!-- Permisos -->
      <v-combobox
        v-model="form.permissions"
        :items="availablePermissions"
        label="Permissions"
        multiple
        chips
        clearable
        variant="filled"
        :rules="[v => v.length > 0 || 'You must select  at least one permission']"
        required
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
const rolesStore = useRolesStore();
import { ref } from 'vue'


// Estado del formulario
const form = ref({
  name: '',
  description: '',
  permissions: []
})

// Opciones de permisos disponibles 
const availablePermissions = ['read', 'write', 'delete']

// Validación del formulario
const isValid = ref(false)
const loading = ref(false)
const rules = {
  required: (v) => !!v || 'Campo requerido'
}

// Acción al guardar
const save = async () => {
  loading.value = true
  try {
    const result = await rolesStore.create_role(form.value);
    if (result.color === "success"){
      alert('Rol creado: ' +result.data.name);
      form.value = {name: '', description: '', permissions: []}
    }
    else{
      alert('Error: '+result.message);
    }
  } catch(e){
      console.error(e)
      alert('Error inesperado');
  } finally{
    loading.value = false;
  }
}

</script>
