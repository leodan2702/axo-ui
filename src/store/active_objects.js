import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchWithHandling } from "../utils/apiHelpers";
import { CRYPTOMESH_URL, CRYPTOMESH_API_VERSION } from "@/config";

export const useActiveObjectsStore = defineStore('activeObjects', () => {
  const activeObjects = ref([]);

  // -------------- Formulario -----------------
  const form = ref({
    axo_is_read_only: false,
    axo_module: '',
    axo_class_name: '',
    axo_version: 0,
    axo_endpoint_id: '',
    axo_microservice_id: '',
    axo_dependencies: [], // Aquí almacenaremos un array limpio
    axo_uri: '',
    axo_alias: '',
    axo_code: `from axo import Axo, axo_method

# write your code here
`
  });

  const loading = ref(false);

  function resetForm() {
    form.value = {
      axo_is_read_only: false,
      axo_module: '',
      axo_class_name: '',
      axo_version: 0,
      axo_endpoint_id: '',
      axo_microservice_id: '',
      axo_dependencies: [],
      axo_uri: '',
      axo_alias: '',
      axo_code: `from axo import Axo, axo_method

# write your code here
`
    };
  }

  // Obtener todos los ActiveObjects
  async function getActiveObjects() {
    try {
      const data_json = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/active-objects/`,
        {},
        "Failed to fetch ActiveObjects"
      );
      activeObjects.value = data_json;
      return { color: "success" };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }



  // Crear un ActiveObject nuevo
  async function createActiveObject() {
    loading.value = true;
    try {
      const createdAO = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/active-objects/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        },
        "Failed to create ActiveObject"
      );

      activeObjects.value.push(createdAO);
      resetForm();
      return { color: "success", data: createdAO };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

  // Actualizar un ActiveObject existente
  async function updateActiveObject(active_object_id) {
    loading.value = true;
    try {
      const updatedAO = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/active-objects/${active_object_id}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        },
        "Failed to update ActiveObject"
      );

      const index = activeObjects.value.findIndex(e => e.active_object_id === active_object_id);
      if (index !== -1) activeObjects.value[index] = updatedAO;

      return { color: "success", data: updatedAO };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

  // Eliminar un ActiveObject
  async function deleteActiveObject(active_object_id) {
    try {
      await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/active-objects/${active_object_id}/`,
        { method: 'DELETE' },
        "Failed to delete ActiveObject"
      );

      activeObjects.value = activeObjects.value.filter(e => e.active_object_id !== active_object_id);
      return { color: "success" };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  async function getActiveObjectSchema(active_object_id) {
    try {
      const schema = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/active-objects/${active_object_id}/schema`,
        {},
        "Failed to fetch ActiveObject schema"
      );
      return { color: "success", data: schema };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  return {
    activeObjects,
    form,
    loading,
    resetForm,
    getActiveObjects,
    createActiveObject,
    updateActiveObject,
    deleteActiveObject,
    getActiveObjectSchema
  };
});
