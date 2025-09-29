import { defineStore } from "pinia"
import { ref } from "vue"
import yaml from "js-yaml"   // 👈 asegúrate de importar yaml aquí también

const SHIELDX_URL = `http://localhost:20000`
const API_VERSION = `v1`

export const useChoreographyStore = defineStore("choreography", () => {
  const loading = ref(false)

  async function interpretChoreography(choreographyJson) {
    loading.value = true
    try {
      const response = await fetch(`${SHIELDX_URL}/api/${API_VERSION}/interpret`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(choreographyJson),
      })

      if (!response.ok) throw new Error("Failed to interpret choreography")

      const result = await response.json()
      return { color: "success", data: result }
    } catch (error) {
      console.error("Error", error)
      const message =
        error?.message ?? "Unknown error, please contact support@axo.mx"
      return { color: "error", message }
    } finally {
      loading.value = false
    }
  }

  async function interpretChoreographyYaml(choreographyObj) {
    loading.value = true
    try {
      const yamlContent = yaml.dump(choreographyObj)   // 👈 convierte el objeto a texto YAML

      const response = await fetch(`${SHIELDX_URL}/api/${API_VERSION}/interpret/yaml`, {
        method: "POST",
        headers: { "Content-Type": "application/x-yaml" },
        body: yamlContent,
      })

      if (!response.ok) throw new Error("Failed to interpret choreography YAML")

      const result = await response.json()
      return { color: "success", data: result }
    } catch (error) {
      console.error("Error", error)
      return { color: "error", message: error?.message ?? "Unknown error" }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    interpretChoreography,
    interpretChoreographyYaml,
  }
})
