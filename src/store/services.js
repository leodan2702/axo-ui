import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchWithHandling } from "../utils/apiHelpers"; 
import { CRYPTOMESH_URL, CRYPTOMESH_API_VERSION } from "@/config";



export const useServicesStore = defineStore('services', () => {
  const services = ref([]);

  // -------------- Formulario -----------------
  const form = ref({
    name: '',
    security_policy: '',
    microservices: [],
    resources: { cpu: 1, ram: '1GB' }
  });

  const loading = ref(false);

  function resetForm() {
    form.value = {
      name: '',
      security_policy: '',
      microservices: [],
      resources: { cpu: 1, ram: '1GB' }
    };
  }

  // Obtener todos los servicios
  async function get_services() {
    try {
      const data_json = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/services/`,
        {},
        "Failed to fetch services"
      );
      services.value = data_json;
      return { color: "success" };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  // Crear un servicio nuevo
  async function create_service() {
    loading.value = true;
    try {
      const createdService = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/services/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        },
        "Failed to create service"
      );

      services.value.push(createdService);
      resetForm();
      return { color: "success", data: createdService };
    } catch (error) {
      console.error("Error", error);
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
      const updatedService = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/services/${service_id}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form.value)
        },
        "Failed to update service"
      );

      // Actualizar en el store local
      const index = services.value.findIndex(s => s.service_id === service_id);
      if (index !== -1) {
        services.value[index] = updatedService;
      }

      return { color: "success", data: updatedService };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

  // Eliminar un servicio
  async function delete_service(service_id) {
    try {
      await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/services/${service_id}/`,
        { method: 'DELETE' },
        "Failed to delete service"
      );

      // Eliminarlo del store local
      services.value = services.value.filter(s => s.service_id !== service_id);

      return { color: "success" };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  return { services, get_services, create_service, update_service, delete_service, form, loading, resetForm };
});
