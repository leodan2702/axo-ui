import { defineStore } from "pinia"
import { ref } from "vue"
import yaml from "js-yaml"
import { SHIELDX_URL, API_VERSION,CRYPTOMESH_URL, CRYPTOMESH_API_VERSION,FETCH_CREDENTIALS } from "@/config"


export const useChoreographyStore = defineStore("choreography", () => {
  const loading = ref(false)

  async function interpretChoreography(choreographyJson) {
    loading.value = true
    try {
      const response = await fetch(`${SHIELDX_URL}/api/${API_VERSION}/interpret`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: FETCH_CREDENTIALS,
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
      const yamlContent = yaml.dump(choreographyObj)   

      const response = await fetch(`${SHIELDX_URL}/api/${API_VERSION}/interpret/yaml`, {
        method: "POST",
        headers: { "Content-Type": "application/x-yaml" },
        credentials: FETCH_CREDENTIALS,
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

  async function sendGraph(graphJson) {
    loading.value = true
    try {
      const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/choreography/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: FETCH_CREDENTIALS,
        body: JSON.stringify(graphJson),
      })

      if (!response.ok) throw new Error("Failed to send graph")

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
    sendGraph,
  }
})
