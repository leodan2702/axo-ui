<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 300px">
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-4">
          <h1>Functions</h1>
          <v-spacer></v-spacer>

          <!-- Botón New Function -->
          <router-link to="/create-function">
            <v-btn class="btn-create-function">
              <v-icon left>mdi-plus</v-icon>
              New Function
            </v-btn>
          </router-link>

          <!-- Barra de búsqueda -->
          <SearchBar @update:search="handleSearch" class="ml-4" />
        </div>

        <v-divider></v-divider>

        <div class="mt-5 pa-5">
          <CardVariant
            v-for="(fn, index) in filteredFunctions"
            :key="fn.function_id"
            :title="`Function: ${fn.name}`"
            :description="`CPU: ${fn.resources.cpu} | RAM: ${fn.resources.ram} | Storage: ${fn.storage.capacity} | Endpoint: ${fn.endpoint_name}`"
            :autor="fn.created_at"
          >
            <template #button>
              <v-btn small class="btn-edit" @click="handleEdit(fn)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn class="btn-delete" variant="flat" @click="openDeleteDialog(fn, index)">
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
            Are you sure you want to delete the function "{{ dialog.function?.name }}"?
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
import { useFunctionsStore } from "@/store/functions"
import { useEndpointsStore } from "@/store/endpoints"
import { ref, onMounted, computed } from "vue"
import router from "@/router"

const functionsStore = useFunctionsStore()
const currentSearch = ref("")
const endpointsStore = useEndpointsStore()

// Snackbar
const snackbar = ref({ show: false, text: "", color: "success" })

onMounted(async () => {
  await functionsStore.get_functions()
  await endpointsStore.get_endpoints()
})

// Filtro por function_id
const filteredFunctions = computed(() => {
  return functionsStore.functions
    .filter(fn =>
      fn.function_id.toLowerCase().includes(currentSearch.value.toLowerCase())
    )
    .map(fn => ({
      ...fn,
      endpoint_name: endpointsStore.endpoints.find(
        ep => ep.endpoint_id === fn.endpoint_id
      )?.name || 'N/A'
    }))
})


const handleSearch = (search) => {
  currentSearch.value = search
}

// Editar function
const handleEdit = (fn) => {
  router.push({ path: `/create-function`, query: { edit: fn.function_id } })
}

// Dialog de eliminación
const dialog = ref({ show: false, function: null, index: null })

const openDeleteDialog = (fn, index) => {
  dialog.value.function = fn
  dialog.value.index = index
  dialog.value.show = true
}

const confirmDelete = async () => {
  if (!dialog.value.function) return
  try {
    const result = await functionsStore.delete_function(dialog.value.function.function_id)
    if (result.color === "success") {
      snackbar.value = { show: true, text: `Function deleted: ${dialog.value.function.name}`, color: "success" }
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

/* Botón Crear Nueva Function */
.btn-create-function {
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
