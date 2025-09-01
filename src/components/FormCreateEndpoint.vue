<template>
  <v-card class="d-flex flex-column pa-4" max-width="600">
    <v-form v-model="isValid" fast-fail @submit.prevent="save">
      
      <!-- Nombre del endpoint -->
      <v-text-field
        v-model="form.name"
        label="Endpoint Name"
        variant="filled"
        :rules="[rules.required]"
        required
      />

      <!-- Imagen -->
      <v-text-field
        v-model="form.image"
        label="Image"
        variant="filled"
        :rules="[rules.required]"
        required
      />

      <!-- Recursos -->
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="form.resources.cpu"
            label="CPU"
            type="number"
            variant="filled"
            :rules="[rules.required]"
            required
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="form.resources.ram"
            label="RAM (e.g. 1GB)"
            variant="filled"
            :rules="[rules.required]"
            required
          />
        </v-col>
      </v-row>

      <!-- Security Policy (sp_id) -->
      <v-select
        v-model="selectedSpId"
        :items="availablePolicies"
        item-title="sp_id"
        item-value="sp_id"
        label="Security Policy (sp_id)"
        variant="filled"
        :rules="[rules.required]"
        required
        @update:modelValue="onPolicyChange"
      />

      <!-- Roles (solo lectura) -->
      <v-text-field
        v-model="form.security_policy.roles"
        label="Roles"
        variant="filled"
        readonly
      />

      <!-- Requires Authentication (solo lectura) -->
      <v-checkbox
        v-model="form.security_policy.requires_authentication"
        label="Requires Authentication"
        :readonly="true"
        :disabled="true"
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
import { ref, onMounted } from 'vue'
import { useEndpointsStore } from '@/store/endpoints'
import { useSecurityPoliciesStore } from '@/store/security_policy'

const endpointsStore = useEndpointsStore()
const securityPoliciesStore = useSecurityPoliciesStore()

const form = ref({
  name: '',
  image: '',
  resources: { cpu: '', ram: '' },
  security_policy: { sp_id: '', roles: [], requires_authentication: false }
})

const selectedSpId = ref('')
const availablePolicies = ref([])
const isValid = ref(false)
const loading = ref(false)
const rules = { required: (v) => !!v || 'Campo requerido' }

onMounted(async () => {
  await securityPoliciesStore.get_policies()
  console.log('Policies from store:', securityPoliciesStore.policies)

  availablePolicies.value = securityPoliciesStore.policies.map(p => ({
    sp_id: p.sp_id,
    roles: p.roles,
    requires_authentication: p.requires_authentication
  }))
})


const onPolicyChange = (sp_id) => {
  const policy = availablePolicies.value.find(p => p.sp_id === sp_id)
  if (policy) {
    form.value.security_policy.sp_id = policy.sp_id
    form.value.security_policy.roles = policy.roles ?? []
    form.value.security_policy.requires_authentication = policy.requires_authentication ?? false
  } else {
    form.value.security_policy = { sp_id:'', roles:[], requires_authentication:false }
  }
}

const save = async () => {
  loading.value = true
  try {
    const payload = {
      name: form.value.name,
      image: form.value.image,
      resources: form.value.resources,
      security_policy: form.value.security_policy,
      policy_id: form.value.policy_id || null
    }
    const result = await endpointsStore.create_endpoint(payload)
    if (result.color === "success") {
      alert('Endpoint creado: ' + result.data.name)
      form.value = { name: '', image: '', resources: { cpu: '', ram: '' }, security_policy: { sp_id:'', roles:[], requires_authentication:false } }
      selectedSpId.value = ''
    } else {
      alert('Error: ' + result.message)
    }
  } catch (e) {
    console.error(e)
    alert('Error inesperado')
  } finally {
    loading.value = false
  }
}
</script>
