<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 300px">
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-4">
          <h1>Active Objects</h1>
          <v-spacer></v-spacer>

          <!-- Botón New Active Object -->
          <router-link to="/create-object">
            <v-btn class="btn-create">
              <v-icon left>mdi-plus</v-icon>
              New Active Object
            </v-btn>
          </router-link>

          <!-- Barra de búsqueda -->
          <SearchBar @update:search="handleSearch" class="ml-4" />
        </div>

        <v-divider></v-divider>

        <div class="mt-5 pa-5">
          <CardVariant
            v-for="(ao, index) in filteredActiveObjects"
            :key="ao.active_object_id"
            :title="` ${ao.axo_alias} (${ao.axo_module})`"
            :description="`Class: ${ao.axo_class_name} | Version: ${ao.axo_version} | Dependencies: ${ao.axo_dependencies.join(', ')}`"
            :autor="ao.created_at"
            :image="OA"
          >
            <template #button>
              <v-btn small class="btn-edit" @click="handleEdit(ao)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn class="btn-delete" variant="flat" @click="openDeleteDialog(ao, index)">
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
            Are you sure you want to delete the active object "{{ dialog.activeObject?.axo_alias }}"?
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
import { useActiveObjectsStore } from "@/store/active_objects"
import { ref, onMounted, computed } from "vue"
import router from "@/router"
import OA from "@/assets/axo_OA_assets.png"


const activeObjectsStore = useActiveObjectsStore()
const currentSearch = ref("")

// Snackbar
const snackbar = ref({ show: false, text: "", color: "success" })

onMounted(async () => {
  await activeObjectsStore.getActiveObjects()
})

// Filtro por alias o módulo
const filteredActiveObjects = computed(() => {
  if (!currentSearch.value) return activeObjectsStore.activeObjects
  return activeObjectsStore.activeObjects.filter(ao =>
    ao.axo_alias.toLowerCase().includes(currentSearch.value.toLowerCase()) ||
    ao.axo_module.toLowerCase().includes(currentSearch.value.toLowerCase())
  )
})

const handleSearch = (search) => {
  currentSearch.value = search
}

// Editar active object
const handleEdit = (ao) => {
  router.push({ path: `/create-object`, query: { edit: ao.active_object_id } })
}

// Dialog de eliminación
const dialog = ref({ show: false, activeObject: null, index: null })

const openDeleteDialog = (ao, index) => {
  dialog.value.activeObject = ao
  dialog.value.index = index
  dialog.value.show = true
}

const confirmDelete = async () => {
  if (!dialog.value.activeObject) return
  try {
    const result = await activeObjectsStore.deleteActiveObject(dialog.value.activeObject.active_object_id)
    if (result.color === "success") {
      snackbar.value = { show: true, text: `Active Object deleted: ${dialog.value.activeObject.axo_alias}`, color: "success" }
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
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

.btn-create {
  background-color: #11212d;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-delete {
  background-color: #d00000;
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}
</style>
