<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 300px">
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center">
          <h1>Roles</h1>
          <v-spacer></v-spacer>

          <!-- Botón New Role -->
          <router-link to="/create-role">
            <button class="btn-create-role">
              New Role
            </button>
          </router-link>

          <!-- Barra de búsqueda -->
          <SearchBar @update:search="handleSearch" />
        </div>

        <v-divider></v-divider>

        <div class="mt-5 pa-5">
          <CardVariant
            v-for="(role, index) in filteredRoles"
            :key="index"
            :title="`Role: ${role.name}`"
            :description="role.description"
            :autor="role.created_at"
          >
            <template #button>
              <button
                @click="handleEdit(role)"
                class="btn-edit"
              >
                Edit
              </button>

              <button
                @click="handleDelete(role, index)"
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
import { useRolesStore } from "@/store/roles"
import { ref, onMounted, computed } from "vue"

const rolesStore = useRolesStore()
const currentSearch = ref("")

onMounted(async () => {
  await rolesStore.get_roles()
})

const filteredRoles = computed(() => {
  if (!currentSearch.value) return rolesStore.roles
  return rolesStore.roles.filter(r =>
    r.name.toLowerCase().includes(currentSearch.value.toLowerCase())
  )
})

const handleSearch = (search) => {
  currentSearch.value = search
}

const handleEdit = (role) => {
  // pendiente formulario de edición
  console.log("Editar rol:", role)
}

const handleDelete = async (role, index) => {
  try {
    // Llamada a la API para eliminar el rol
    const result = await rolesStore.delete_role(role.role_id)
    if(result.color === "success"){
      alert(`Rol eliminado: ${role.name}`)
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


.btn-create-role {
  background-color: #11212d;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-create-role:hover {
  background-color: #000000;
}
</style>

