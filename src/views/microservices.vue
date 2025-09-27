<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 300px">
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-4">
          <h1>Microservices</h1>
          <v-spacer></v-spacer>

          <!-- Botón New Microservice -->
          <router-link to="/create-microservice">
            <v-btn class="btn-create-microservice" data-step="create-microservice-button">
              <v-icon left>mdi-plus</v-icon>
              New Microservice
            </v-btn>
          </router-link>

          <!-- Barra de búsqueda -->
          <SearchBar @update:search="handleSearch" class="ml-4"  data-step="search-microservice-button"/>
        </div>

        <v-divider></v-divider>

        <div class="mt-5 pa-5" data-step="microservices-management-section">
          <CardVariant
            v-for="(ms, index) in filteredMicroservices"
            :key="ms.service_id"
            :title="`Microservice: ${ms.name}`"
            :description="`CPU: ${ms.resources.cpu} | RAM: ${ms.resources.ram}`"
            :autor="ms.created_at"
            :image="microser"
          >
            <template #button>
              <v-btn small class="btn-edit" @click="handleEdit(ms)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn class="btn-delete" variant="flat" @click="openDeleteDialog(ms, index)">
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
            Are you sure you want to delete the microservice "{{ dialog.microservice?.name }}"?
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
import { useMicroservicesStore } from "@/store/microservices"
import { ref, onMounted, computed } from "vue"
import router from "@/router"
import microser from "@/assets/axo_microser_assets.png"
const microservicesStore = useMicroservicesStore()
const currentSearch = ref("")

// Snackbar
const snackbar = ref({ show: false, text: "", color: "success" })

onMounted(async () => {
  await microservicesStore.get_microservices()
})

// Filtro por service_id
const filteredMicroservices = computed(() => {
  if (!currentSearch.value) return microservicesStore.microservices
  return microservicesStore.microservices.filter(ms =>
    ms.microservice_id.toLowerCase().includes(currentSearch.value.toLowerCase())
  )
})

const handleSearch = (search) => {
  currentSearch.value = search
}

// Editar microservice
const handleEdit = (ms) => {
  router.push({ path: `/create-microservice`, query: { edit: ms.microservice_id } })
}

// Dialog de eliminación
const dialog = ref({ show: false, microservice: null, index: null })

const openDeleteDialog = (ms, index) => {
  dialog.value.microservice = ms
  dialog.value.index = index
  dialog.value.show = true
}

const confirmDelete = async () => {
  if (!dialog.value.microservice) return
  try {
    const result = await microservicesStore.delete_microservice(dialog.value.microservice.microservice_id)
    if (result.color === "success") {
      snackbar.value = { show: true, text: `Microservice deleted: ${dialog.value.microservice.name}`, color: "success" }
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
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}

/* Botón Crear Nuevo Microservice */
.btn-create-microservice {
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

