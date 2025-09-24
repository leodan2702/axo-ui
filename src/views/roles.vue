<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 300px">
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-4">
          <h1>Roles</h1>
          <v-spacer></v-spacer>

          <!-- Botón New Role con estilo personalizado -->
          <router-link to="/create-role">
            <v-btn class="btn-create-role">
              <v-icon left>mdi-plus</v-icon>
              New Role
            </v-btn>
          </router-link>

          <!-- Barra de búsqueda -->
          <SearchBar @update:search="handleSearch" class="ml-4"/>
        </div>

        <v-divider></v-divider>

        <div class="mt-5 pa-5">
          <CardVariant
            v-for="(role, index) in filteredRoles"
            :key="role.role_id"
            :title="`Role: ${role.name}`"
            :description="role.description"
            :permissions="role.permissions"
            :autor="role.created_at"
            :image="roles"
          >
            <template #button>
              <!-- Botón Editar con estilo personalizado -->
              <v-btn small class="btn-edit" @click="handleEdit(role)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <!-- Botón Eliminar -->
              <v-btn class="btn-delete" variant="flat" @click="openDeleteDialog(role, index)">
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
            Are you sure you want to delete the role "{{ dialog.role?.name }}"?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="grey" @click="dialog.show = false">Cancel</v-btn>
            <v-btn text color="red" @click="confirmDelete">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar para notificaciones -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.text }}
      </v-snackbar>
    </v-container>
  </v-main>
</template>

<script setup>
import SearchBar from "@/components/SearchBar.vue"
import CardVariant from "@/components/CardVariant.vue"
import { useRolesStore } from "@/store/roles"
import { ref, onMounted, computed } from "vue"
import router from "@/router"
import roles from "@/assets/axo_role_assets.png"

const rolesStore = useRolesStore()
const currentSearch = ref("")

// Snackbar
const snackbar = ref({ show: false, text: "", color: "success" })

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
  router.push({ path: `/create-role`, query: { edit: role.role_id } })
}

// Dialog de eliminación
const dialog = ref({ show: false, role: null, index: null })

const openDeleteDialog = (role, index) => {
  dialog.value.role = role
  dialog.value.index = index
  dialog.value.show = true
}

const confirmDelete = async () => {
  if (!dialog.value.role) return
  try {
    const result = await rolesStore.delete_role(dialog.value.role.role_id)
    if (result.color === "success") {
      snackbar.value = { show: true, text: `Role deleted: ${dialog.value.role.name}`, color: "success" }
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
/* Botón Editar */
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

/* Botón Crear Nuevo Role */
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

</style>
