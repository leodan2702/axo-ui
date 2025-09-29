<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 300px">
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-4">
          <h1>Endpoints</h1>
          <v-spacer></v-spacer>

          <!-- Botón New Endpoint -->
          <router-link to="/create-endpoint">
            <v-btn class="btn-create-endpoint" data-step="new-endpoint-button">
              <v-icon left>mdi-plus</v-icon>
              New Endpoint
            </v-btn>
          </router-link>

          <!-- Barra de búsqueda -->
          <SearchBar @update:search="handleSearch" class="ml-4" data-step="search-endpoint"/>
        </div>

        <v-divider></v-divider>

        <div class="mt-5 pa-5" data-step="endpoints-management-section">
          <CardVariant
            v-for="(ep, index) in filteredEndpoints"
            :key="ep.endpoint_id"
            :title="`Endpoint: ${ep.name}`"
            :description="`Image: ${ep.image} | CPU: ${ep.resources.cpu} | RAM: ${ep.resources.ram}`"
            :autor="ep.created_at"
            :image="endpoint"
          >
            <template #button>
              <v-btn small class="btn-edit" @click="handleEdit(ep)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn class="btn-delete" variant="flat" @click="openDeleteDialog(ep, index)">
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
            Are you sure you want to detach the endpoint "{{ dialog.endpoint?.name }}"?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="grey" @click="dialog.show = false">Cancel</v-btn>
            <v-btn text color="red" @click="confirmDelete">Detach</v-btn>
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
import { useEndpointsStore } from "@/store/endpoints"
import { ref, onMounted, computed } from "vue"
import router from "@/router"
import endpoint from "@/assets/axo_endpoint_assets.png"

const endpointsStore = useEndpointsStore()
const currentSearch = ref("")

// Snackbar
const snackbar = ref({ show: false, text: "", color: "success" })

onMounted(async () => {
  await endpointsStore.get_endpoints()
})

// Filtro por nombre de endpoint
const filteredEndpoints = computed(() => {
  if (!currentSearch.value) return endpointsStore.endpoints
  return endpointsStore.endpoints.filter(ep =>
    ep.name.toLowerCase().includes(currentSearch.value.toLowerCase())
  )
})

const handleSearch = (search) => {
  currentSearch.value = search
}

// Editar endpoint
const handleEdit = (ep) => {
  router.push({ path: `/create-endpoint`, query: { edit: ep.endpoint_id } })
}

// Dialog de eliminación
const dialog = ref({ show: false, endpoint: null, index: null })

const openDeleteDialog = (ep, index) => {
  dialog.value.endpoint = ep
  dialog.value.index = index
  dialog.value.show = true
}

const confirmDelete = async () => {
  if (!dialog.value.endpoint) return
  try {
    const result = await endpointsStore.detach_endpoint(dialog.value.endpoint.endpoint_id)
    if (result.color === "success") {
      snackbar.value = { show: true, text: `Endpoint detached: ${dialog.value.endpoint.name}`, color: "success" }
    } else {
      snackbar.value = { show: true, text: "Failed to detach: " + result.message, color: "error" }
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

/* Botón Crear Nuevo Endpoint */
.btn-create-endpoint {
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
