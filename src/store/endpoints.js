import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchWithHandling } from "../utils/apiHelpers";
import { CRYPTOMESH_URL, CRYPTOMESH_API_VERSION } from "@/config";

export const useEndpointsStore = defineStore('endpoints', () => {
  const endpoints = ref([]);

  // -------------- Formulario -----------------
  const form = ref({
    name: '',
    image: '',
    resources: { cpu: 1, ram: '' },
    security_policy: ''
  });

  const loading = ref(false);

  function resetForm() {
    form.value = {
      name: '',
      image: '',
      resources: { cpu: 1, ram: '' },
      security_policy: ''
    };
  }

  // Obtener todos los endpoints
  async function get_endpoints() {
    try {
      const data_json = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/`,
        {},
        "Failed to fetch endpoints"
      );
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
      const createdEndpoint = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        },
        "Failed to create endpoint"
      );

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
      const updatedEndpoint = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/${endpoint_id}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        },
        "Failed to update endpoint"
      );

      // Actualizar en el store local
      const index = endpoints.value.findIndex(e => e.endpoint_id === endpoint_id);
      if (index !== -1) endpoints.value[index] = updatedEndpoint;

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
      await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/${endpoint_id}/`,
        { method: 'DELETE' },
        "Failed to delete endpoint"
      );

      // Eliminarlo del store local
      endpoints.value = endpoints.value.filter(e => e.endpoint_id !== endpoint_id);

      return { color: "success" };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  // Crear + desplegar endpoint
  async function deploy_endpoint() {
    loading.value = true;
    try {
      const deployed = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/deploy`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        },
        "Failed to deploy endpoint"
      );

      endpoints.value.push(deployed);

      resetForm();
      return { color: "success", data: deployed };

    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }



  // detener o desconectar un endpoint
  async function detach_endpoint(endpoint_id){
    loading.value = true;
    try {
      await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/detach/${endpoint_id}`,
        { method: 'DELETE' },
        "Failed to detach endpoint"
      );

      endpoints.value = endpoints.value.filter(e => e.endpoint_id !== endpoint_id);

      return { color: "success" };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

  return { endpoints, get_endpoints, create_endpoint, update_endpoint, delete_endpoint, form, loading, resetForm, deploy_endpoint, detach_endpoint };
});