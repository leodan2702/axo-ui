import { defineStore } from "pinia";
import { ref } from "vue";

const CRYPTOMESH_URL = `http://localhost:19000`;
const CRYPTOMESH_API_VERSION = `v1`;

export const useFunctionsStore = defineStore("functions", () => {
  const functions = ref([]);

  // -------------- Formulario -----------------
  const form = ref({
    name: "",
    microservice_id: "",
    image: "",
    resources: { cpu: 0, ram: "" },
    storage: { capacity: "", source_path: "", sink_path: "" },
    endpoint_id: ""
  });

  const loading = ref(false);

  function resetForm() {
    form.value = {
      name: "",
      microservice_id: "",
      image: "",
      resources: { cpu: 0, ram: "" },
      storage: { capacity: "", source_path: "", sink_path: "" },
      endpoint_id: ""
    };
  }

  // Obtener todas las funciones
  async function get_functions() {
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/functions/`);
      const data_json = await response.json();
      functions.value = data_json;
      return { color: "success" };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  // Crear una función nueva
  async function create_function() {
    loading.value = true;
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/functions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value)
      });
      if (!response.ok) throw new Error("Failed to create function");
      const createdFunction = await response.json();
      functions.value.push(createdFunction); // agregamos al store
      resetForm();
      return { color: "success", data: createdFunction };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

  // Actualizar una función existente
  async function update_function(function_id) {
    loading.value = true;
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/functions/${function_id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form.value)
      });
      if (!response.ok) throw new Error("Failed to update function");
      const updatedFunction = await response.json();

      // actualizar en el store local
      const index = functions.value.findIndex(f => f.function_id === function_id);
      if (index !== -1) {
        functions.value[index] = updatedFunction;
      }

      return { color: "success", data: updatedFunction };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    } finally {
      loading.value = false;
    }
  }

  // Eliminar una función
  async function delete_function(function_id) {
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/functions/${function_id}/`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete function");

      // eliminar del store local
      functions.value = functions.value.filter(f => f.function_id !== function_id);

      return { color: "success" };
    } catch (error) {
      console.error("Error", error);
      const message = error?.message ?? "Unknown error, please contact support@axo.mx";
      return { color: "error", message };
    }
  }

  return {
    functions,
    get_functions,
    create_function,
    update_function,
    delete_function,
    form,
    loading,
    resetForm
  };
});
