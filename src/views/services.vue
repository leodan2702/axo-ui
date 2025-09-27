<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 300px">
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-4">
          <h1>Services</h1>
          <v-spacer></v-spacer>

          <!-- Botón New Service -->
          <router-link to="/create-service">
            <v-btn class="btn-create-service" data-step="create-service-button">
              <v-icon left>mdi-plus</v-icon>
              New Service
            </v-btn>
          </router-link>

          <!-- Barra de búsqueda -->
          <SearchBar @update:search="handleSearch" class="ml-4" data-step="search-service" />
        </div>

        <v-divider></v-divider>

        <div class="mt-5 pa-5" data-step="services-management-section" >
          <CardVariant
            v-for="(service, index) in filteredServices"
            :key="service.service_id"
            :title="`Service: ${service.name}`"
            :description="`CPU: ${service.resources.cpu} | RAM: ${service.resources.ram}`"
            :image="serv"
          >
            <template #button>
              <v-btn small class="btn-edit" @click="handleEdit(service)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn class="btn-delete" variant="flat" @click="openDeleteDialog(service, index)">
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
            Are you sure you want to delete the service "{{ dialog.service?.service_id }}"?
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
import { useServicesStore } from "@/store/services"
import { ref, onMounted, computed } from "vue"
import router from "@/router"
import serv from "@/assets/axo_service_assets.png"
const servicesStore = useServicesStore()
const currentSearch = ref("")

// Snackbar
const snackbar = ref({ show: false, text: "", color: "success" })

onMounted(async () => {
  await servicesStore.get_services()
})

// Filtro por SP ID
const filteredServices = computed(() => {
  if (!currentSearch.value) return servicesStore.services
  return servicesStore.services.filter(service =>
    service.service_id.toLowerCase().includes(currentSearch.value.toLowerCase())
  )
})

const handleSearch = (search) => {
  currentSearch.value = search
}

// Editar service
const handleEdit = (service) => {
  router.push({ path: `/create-service`, query: { edit: service.service_id } })
}

// Dialog de eliminación
const dialog = ref({ show: false, service: null, index: null })

const openDeleteDialog = (service, index) => {
  dialog.value.service = service
  dialog.value.index = index
  dialog.value.show = true
}

const confirmDelete = async () => {
  if (!dialog.value.service) return
  try {
    const result = await servicesStore.delete_service(dialog.value.service.service_id)
    if (result.color === "success") {
      snackbar.value = { show: true, text: `Service deleted: ${dialog.value.service.service_id}`, color: "success" }
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

/* Botón Crear Nuevo Service */
.btn-create-service {
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
