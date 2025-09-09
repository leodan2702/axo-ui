import { defineStore } from "pinia";
import { ref } from "vue";

const CRYPTOMESH_URL = `http://localhost:19000`;
const CRYPTOMESH_API_VERSION = `v1`;

export const useEndpointsStore = defineStore('endpoints', () => {
  const endpoints = ref([]);

  // -------------- Formulario -----------------
  const form = ref({
    name: '',
    image: '',
    resources: { cpu: '', ram: '' },
    security_policy: ''
  });

  const loading = ref(false);

  function resetForm() {
    form.value = {
      name: '',
      image: '',
      resources: { cpu: '', ram: '' },
      security_policy: ''
    };
  }

  // Obtener todos los endpoints
  async function get_endpoints() {
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/`);
      const data_json = await response.json();
      endpoints.value = data_json;
      return { color: "success" };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  // Crear un endpoint nuevo
  async function create_endpoint() {
    loading.value = true;
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      });
      if (!response.ok) throw new Error('Failed to create endpoint');
      const createdEndpoint = await response.json();
      endpoints.value.push(createdEndpoint); // agregamos al store
      resetForm();
      return { color: "success", data: createdEndpoint };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

  // Actualizar endpoint existente
  async function update_endpoint(endpoint_id) {
    loading.value = true;
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/${endpoint_id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      });
      if (!response.ok) throw new Error('Failed to update endpoint');
      const updatedEndpoint = await response.json();

      // Actualizar en el store local
      const index = endpoints.value.findIndex(e => e.endpoint_id === endpoint_id);
      if (index !== -1) {
        endpoints.value[index] = updatedEndpoint;
      }

      return { color: "success", data: updatedEndpoint };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

  // Eliminar un endpoint
  async function delete_endpoint(endpoint_id) {
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/${endpoint_id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete endpoint');

      // Eliminarlo del store local
      endpoints.value = endpoints.value.filter(e => e.endpoint_id !== endpoint_id);

      return { color: "success" };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  return { endpoints, get_endpoints, create_endpoint, update_endpoint, delete_endpoint, form, loading, resetForm };
});
