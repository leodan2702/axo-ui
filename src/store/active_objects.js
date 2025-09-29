import { defineStore } from "pinia";
import { ref } from "vue";

const CRYPTOMESH_URL = `http://localhost:19000`;
const CRYPTOMESH_API_VERSION = `v1`;

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
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/active-objects/`);
      const data_json = await response.json();
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
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/active-objects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      });
      if (!response.ok) throw new Error('Failed to create active object');
      const createdAO = await response.json();
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
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/active-objects/${active_object_id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      });
      if (!response.ok) throw new Error('Failed to update active object');
      const updatedAO = await response.json();

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
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/active-objects/${active_object_id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete active object');

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
      const response = await fetch(
        `${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/active-objects/${active_object_id}/schema`
      )
      if (!response.ok) throw new Error("Failed to fetch schema")
      const schema = await response.json()
      return { color: "success", data: schema }
    } catch (error) {
      console.error("Error", error)
      const message = error?.message ?? "Unknown error, please contact support@axo.mx"
      return { color: "error", message }
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
