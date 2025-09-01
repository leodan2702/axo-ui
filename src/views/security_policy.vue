<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 300px">
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center">
          <h1>Security Policies</h1>
          <v-spacer></v-spacer>

          <!-- Botón New Security Policy -->
          <router-link to="/create-security-policy">
            <button class="btn-create-policy">
              New Security Policy
            </button>
          </router-link>

          <!-- Barra de búsqueda -->
          <SearchBar @update:search="handleSearch" />
        </div>

        <v-divider></v-divider>

        <div class="mt-5 pa-5">
          <CardVariant
            v-for="(policy, index) in filteredPolicies"
            :key="index"
            :title="`Policy: ${policy.sp_id ?? 'N/A'}`"
            :description="`Roles: ${policy.roles.join(', ')} | Requires Auth: ${policy.requires_authentication}`"
            :autor="policy.created_at"
          >
            <template #button>
              <button
                @click="handleEdit(policy)"
                class="btn-edit"
              >
                Edit
              </button>

              <button
                @click="handleDelete(policy, index)"
                class="btn-delete"
              >
                Delete
              </button>
            </template>
          </CardVariant>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script setup>
import SearchBar from "@/components/SearchBar.vue"
import CardVariant from "@/components/CardVariant.vue"
import { useSecurityPoliciesStore } from "@/store/security_policy"
import { ref, onMounted, computed } from "vue"

const policiesStore = useSecurityPoliciesStore()
const currentSearch = ref("")

onMounted(async () => {
  await policiesStore.get_policies()
})

const filteredPolicies = computed(() => {
  if (!currentSearch.value) return policiesStore.policies
  return policiesStore.policies.filter(p =>
    (p.sp_id ?? "").toLowerCase().includes(currentSearch.value.toLowerCase()) ||
    p.roles.some(r => r.toLowerCase().includes(currentSearch.value.toLowerCase()))
  )
})

const handleSearch = (search) => {
  currentSearch.value = search
}

const handleEdit = (policy) => {
  console.log("Editar policy:", policy)
}

const handleDelete = async (policy, index) => {
  try {
    const result = await policiesStore.delete_policy(policy.sp_id)
    if(result.color === "success"){
      alert(`Policy eliminada: ${policy.sp_id}`)
    } else {
      alert("Error al eliminar: " + result.message)
    }
  } catch(e){
    console.error(e)
    alert("Error inesperado")
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
