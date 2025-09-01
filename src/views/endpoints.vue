<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 300px">
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center">
          <h1>Endpoints</h1>
          <v-spacer></v-spacer>

          <!-- Botón New Endpoint -->
          <router-link to="/create-endpoint">
            <button class="btn-create-endpoint">
              New Endpoint
            </button>
          </router-link>

          <!-- Barra de búsqueda -->
          <SearchBar @update:search="handleSearch" />
        </div>

        <v-divider></v-divider>

        <div class="mt-5 pa-5">
          <CardVariant
            v-for="(ep, index) in filteredEndpoints"
            :key="index"
            :title="`Endpoint: ${ep.name}`"
            :description="`Microservice: ${ep.microservice_id} | Deployment: ${ep.deployment_status}`"
            :autor="ep.created_at"
          >
            <template #button>
              <button

                @click="handleEdit(ep)"
                class="btn-edit"
              >
                Edit
              </button>

              <button
                @click="handleDelete(ep, index)"
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
import { useEndpointsStore } from "@/store/endpoints"

import { ref, onMounted, computed } from "vue"

const endpointsStore = useEndpointsStore()
const currentSearch = ref("")

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


// ✏️ Editar endpoint
const handleEdit = (ep) => {
  console.log("Editar endpoint:", ep)
}

// 🗑️ Eliminar endpoint
const handleDelete = async (ep, index) => {
  try {
    const result = await endpointsStore.delete_endpoint(ep.endpoint_id) 
    if(result.color === "success"){
      alert(`Endpoint eliminado: ${ep.name}`)
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

.btn-create-endpoint {
  background-color: #11212d;
  color: white;
  padding: 5px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-create-endpoint:hover {
  background-color: #000000;
}
</style>
