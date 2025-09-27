
import { defineStore } from "pinia"
import { ref } from "vue"

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

  return {
    loading,
    interpretChoreography,
  }
})


const buildChoreographyJson = () => {
  const triggers = nodes.value.map((node) => {
    const method = node.originData.method || "run"
    const alias = `${node.originData.alias || node.originData.class_name}.${method}`

    return {
      name: node.data.label.replace(/\s+/g, ""),
      rule: {
        target: { alias },
        parameters: {
          init: node.originData.params?.init || {},
          call: node.originData.params?.call || {}
        }
      }
    }
  })

  // Relacionar con edges
  edges.value.forEach((edge) => {
    const sourceNode = nodes.value.find((n) => n.id === edge.source)
    const targetNode = nodes.value.find((n) => n.id === edge.target)
    if (sourceNode && targetNode) {
      const targetTrigger = triggers.find(
        (t) => t.name === targetNode.data.label.replace(/\s+/g, "")
      )
      if (targetTrigger) {
        targetTrigger.depends_on = sourceNode.data.label.replace(/\s+/g, "")
      }
    }
  })

  return { triggers }
}