import { defineStore } from "pinia";
import { ref } from "vue";
import { useServicesStore } from "./services";

const CRYPTOMESH_URL = `http://localhost:19000`;
const CRYPTOMESH_API_VERSION = `v1`;

export const useMicroservicesStore = defineStore("microservices", () => {
  const microservices = ref([]);
  const servicesStore = useServicesStore();

  // -------------- Formulario -----------------
  const form = ref({
    name: "",
    service_id: "",
    resources: { cpu: 0, ram: "" },
    functions: []
  });

  const loading = ref(false);

  function resetForm() {
    form.value = {
      name: "",
      service_id: "",
      resources: { cpu: 0, ram: "" },
      functions: []
    };
  }

  // Obtener todos los microservices
  async function get_microservices() {
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/microservices/`);
      const data_json = await response.json();
      microservices.value = data_json;
      return { color: "success" };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  // Crear un microservice nuevo
  async function create_microservice() {
    loading.value = true;
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/microservices/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value)
      });
      if (!response.ok) throw new Error("Failed to create microservice");
      const createdMicroservice = await response.json();

      // Actualizar store local del service padre
      const serviceIndex = servicesStore.services.findIndex(
        s => s.service_id === createdMicroservice.service_id
      );
      if (serviceIndex !== -1) {
        const service = servicesStore.services[serviceIndex];
        if (!Array.isArray(service.microservices)) {
          service.microservices = [];
        }

        if(!service.microservices.includes(createdMicroservice.microservice_id)){
          service.microservices.push(createdMicroservice.microservice_id);
          servicesStore.services[serviceIndex] = { ...service };
        }
      }

      microservices.value.push(createdMicroservice);
      resetForm();
      return { color: "success", data: createdMicroservice };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

async function update_microservice(microservice_id) {
  loading.value = true;
  try {
    // 1Encontrar microservicio
    const original = microservices.value.find(m => m.microservice_id === microservice_id);
    const oldServiceId = original?.service_id;

    //Actualizar en el backend
    const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/microservices/${microservice_id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value)
    });
    if (!response.ok) throw new Error("Failed to update microservice");
    const updatedMicroservice = await response.json();

    //Actualizar store de microservices
    const index = microservices.value.findIndex(m => m.microservice_id === microservice_id);
    if (index !== -1) microservices.value[index] = updatedMicroservice;

    //Actualizar servicesStore si cambió de service
    const newServiceId = updatedMicroservice.service_id;
    if (oldServiceId && oldServiceId !== newServiceId) {
      // Quitar del service antiguo
      const oldServiceIndex = servicesStore.services.findIndex(s => s.service_id === oldServiceId);
      if (oldServiceIndex !== -1) {
        const oldService = servicesStore.services[oldServiceIndex];
        if (!Array.isArray(oldService.microservices)) oldService.microservices = [];
        oldService.microservices = oldService.microservices.filter(id => id !== microservice_id);
        servicesStore.services[oldServiceIndex] = { ...oldService };
      }

      // Agregar al service nuevo
      const newServiceIndex = servicesStore.services.findIndex(s => s.service_id === newServiceId);
      if (newServiceIndex !== -1) {
        const newService = servicesStore.services[newServiceIndex];
        if (!Array.isArray(newService.microservices)) newService.microservices = [];
        if (!newService.microservices.includes(microservice_id)) {
          newService.microservices.push(microservice_id);
          servicesStore.services[newServiceIndex] = { ...newService };
        }
      }
    }

    return { color: "success", data: updatedMicroservice };
  } catch (error) {
    console.error("Error", error);
    const message = error?.message ?? "Unknown error, please contact support@axo.mx";
    return { color: "error", message };
  } finally {
    loading.value = false;
  }
}


// Eliminar un microservice
  async function delete_microservice(microservice_id) {
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/microservices/${microservice_id}/`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete microservice");

      // Eliminar del store
      microservices.value = microservices.value.filter(m => m.microservice_id !== microservice_id);

      // Actulizar store local del service
      for (const service of servicesStore.services) {
        // Asegurarse de que microservices sea un array
        if (!Array.isArray(service.microservices)) service.microservices = [];

        if (service.microservices.includes(microservice_id)) {
          service.microservices = service.microservices.filter(id => id !== microservice_id);
        }
      }

      return { color: "success" };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  return {
    microservices, get_microservices, create_microservice, update_microservice, delete_microservice, form, loading, resetForm};
});
