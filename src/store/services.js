import { defineStore } from "pinia";
import { ref } from "vue";

const CRYPTOMESH_URL = `http://localhost:19000`;
const CRYPTOMESH_API_VERSION = `v1`;

export const useServicesStore = defineStore('services', () => {
  const services = ref([]);

  // -------------- Formulario -----------------
  const form = ref({
    name: '',
    security_policy: '',
    microservices: [],
    resources: { cpu: 0, ram: '' }
  });

  const loading = ref(false);

  function resetForm() {
    form.value = {
      name: '',
      security_policy: '',
      microservices: [],
      resources: { cpu: 0, ram: '' }
    };
  }

  // Obtener todos los servicios
  async function get_services() {
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/services/`);
      const data_json = await response.json();
      services.value = data_json;
      return { color: "success" };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  // Crear un servicio nuevo
  async function create_service() {
    loading.value = true;
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/services/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      });
      if (!response.ok) throw new Error('Failed to create service');
      const createdService = await response.json();
      services.value.push(createdService);
      resetForm();
      return { color: "success", data: createdService };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

  // Actualizar servicio existente
  async function update_service(service_id) {
    loading.value = true;
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/services/${service_id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      });
      if (!response.ok) throw new Error('Failed to update service');
      const updatedService = await response.json();

      // Actualizar en el store local
      const index = services.value.findIndex(s => s.service_id === service_id);
      if (index !== -1) {
        services.value[index] = updatedService;
      }

      return { color: "success", data: updatedService };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

  // Eliminar un servicio
  async function delete_service(service_id) {
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/services/${service_id}/`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete service');

      // Eliminarlo del store local
      services.value = services.value.filter(s => s.service_id !== service_id);

      return { color: "success" };
    } catch (error) {
      console.error('Error', error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  return { services, get_services, create_service, update_service, delete_service, form, loading, resetForm };
});
