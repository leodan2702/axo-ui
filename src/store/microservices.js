import { defineStore } from "pinia";
import { ref } from "vue";

const CRYPTOMESH_URL = `http://localhost:19000`;
const CRYPTOMESH_API_VERSION = `v1`;

export const useMicroservicesStore = defineStore("microservices", () => {
  const microservices = ref([]);

  // -------------- Formulario -----------------
  const form = ref({
    name: "",
    service_id: "",
    resources: { cpu: 0, ram: "" }
  });

  const loading = ref(false);

  function resetForm() {
    form.value = {
      name: "",
      service_id: "",
      resources: { cpu: 0, ram: "" }
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
      microservices.value.push(createdMicroservice); // agregamos al store
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

  // Actualizar microservice existente
  async function update_microservice(microservice_id) {
    loading.value = true;
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/microservices/${microservice_id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value)
      });
      if (!response.ok) throw new Error("Failed to update microservice");
      const updatedMicroservice = await response.json();

      // Actualizar en el store local
      const index = microservices.value.findIndex(m => m.microservice_id === microservice_id);
      if (index !== -1) {
        microservices.value[index] = updatedMicroservice;
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

      // Eliminarlo del store local
      microservices.value = microservices.value.filter(m => m.microservice_id !== microservice_id);

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
