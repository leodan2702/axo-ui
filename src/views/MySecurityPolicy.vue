<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 300px">
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-4">
          <h1>Security Policies</h1>
          <v-spacer></v-spacer>

          <!-- Botón New Security Policy -->
          <router-link to="/create-security-policy">
            <v-btn class="btn-create-policy" data-step="create-policy-button">
              <v-icon left>mdi-plus</v-icon>
              New Security Policy
            </v-btn>
          </router-link>

          <!-- Barra de búsqueda -->
          <SearchBar @update:search="handleSearch" class="ml-4" data-step="search-politicas"/>
        </div>

        <v-divider></v-divider>

        <div class="mt-5 pa-5" data-step="policies-management-section">
          <CardVariant
            v-for="(policy, index) in filteredPolicies"
            :key="policy.sp_id"
            :title="`Policy: ${policy.name}`"
            :description="`Roles: ${getRoleNames(policy)} | Requires Auth: ${policy.requires_authentication}`"
            :autor="policy.created_at"
            :image="sp"
          >
            <template #button>
              <!-- Botón Editar -->
              <v-btn small class="btn-edit" @click="handleEdit(policy)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <!-- Botón Eliminar -->
              <v-btn class="btn-delete" variant="flat" @click="openDeleteDialog(policy, index)">
                <v-icon left>mdi-delete</v-icon>
              </v-btn>
            </template>
          </CardVariant>
        </div>
      </div>

      <!-- Dialogo de confirmación -->
      <v-dialog v-model="dialog.show" max-width="400">
        <v-card>
          <v-card-title class="text-h6">Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete the security policy "{{ dialog.policy?.name }}"?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="grey" @click="dialog.show = false">Cancel</v-btn>
            <v-btn text color="red" @click="confirmDelete">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar para notificaciones -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2000">
        {{ snackbar.text }}
      </v-snackbar>
    </v-container>
  </v-main>
</template>

<script setup>
import SearchBar from "@/components/SearchBar.vue"
import CardVariant from "@/components/CardVariant.vue"
import { useSecurityPoliciesStore } from "@/store/security_policy"
import { useRolesStore } from "@/store/roles"
import { ref, onMounted, computed } from "vue"
import router from "@/router"
import sp from "@/assets/axo_securityPolices_assets.png"

const policiesStore = useSecurityPoliciesStore()
const rolesStore = useRolesStore()
const currentSearch = ref("")

// Snackbar
const snackbar = ref({ show: false, text: "", color: "success" })

// Cargar policies y roles
onMounted(async () => {
  await rolesStore.get_roles()
  await policiesStore.get_policies()
})

// Función para obtener nombres de roles a partir de role_id
const getRoleNames = (policy) => {
  return policy.roles
    .map(roleId => rolesStore.roles.find(r => r.role_id === roleId)?.name || roleId)
    .join(", ")
}

// Filtrado por nombre de policy o nombres de roles
const filteredPolicies = computed(() => {
  if (!currentSearch.value) return policiesStore.policies
  return policiesStore.policies.filter(policy => {
    const search = currentSearch.value.toLowerCase()
    const policyNameMatch = policy.name.toLowerCase().includes(search)
    const rolesMatch = policy.roles.some(roleId => {
      const role = rolesStore.roles.find(r => r.role_id === roleId)
      return role?.name.toLowerCase().includes(search)
    })
    return policyNameMatch || rolesMatch
  })
})

const handleSearch = (search) => {
  currentSearch.value = search
}

// Editar
const handleEdit = (policy) => {
  router.push({ path: `/create-security-policy`, query: { edit: policy.sp_id } })
}

// Dialog de eliminación
const dialog = ref({ show: false, policy: null, index: null })

const openDeleteDialog = (policy, index) => {
  dialog.value.policy = policy
  dialog.value.index = index
  dialog.value.show = true
}

const confirmDelete = async () => {
  if (!dialog.value.policy) return
  try {
    const result = await policiesStore.delete_policy(dialog.value.policy.sp_id)
    if (result.color === "success") {
      snackbar.value = { show: true, text: `Policy deleted: ${dialog.value.policy.name}`, color: "success" }
    } else {
      snackbar.value = { show: true, text: "Failed to delete: " + result.message, color: "error" }
    }
  } catch (e) {
    console.error(e)
    snackbar.value = { show: true, text: "Unexpected error", color: "error" }
  } finally {
    dialog.value.show = false
  }
}
</script>

<style scoped>
.btn-edit {
  background-color: #11212d;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.btn-edit:hover {
  background-color: #000000;
}

.btn-delete {
  background-color: #d00000;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.btn-delete:hover {
  background-color: #9d0000;
}

.btn-create-policy {
  background-color: #11212d;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-create-policy:hover {
  background-color: #000000;
}
</style>
