// stores/HierarchyStore.js
import { defineStore } from "pinia"
import { ref } from "vue"
import OA from "@/assets/axo_OA_assets.png"

const CRYPTOMESH_URL = `http://localhost:19000`
const CRYPTOMESH_API_VERSION = `v1`

function mapHierarchyToTree(data) {
    return data.map(service => ({
        id: service.service_id,
        label: service.service_name,
        type: "service",
        children: service.microservices.map(ms => ({
            id: ms.microservice_id,
            label: ms.microservice_name,
            type: "microservice",
            children: ms.active_objects.map(ao => ({
                id: ao.active_object_id,
                label: ao.alias || ao.object_name || "Unnamed OA",
                type: "active_object",
                icon: OA,
                children: ao.functions.map(fn => ({
                    id: fn.function_id,
                    label: fn.name,
                    type: "function",
                    draggable: true,
                    icon: OA,
                    functionData: fn,
                    parentAO: ao
                }))
            }))
        }))
    }))
}

export const useHierarchyStore = defineStore("hierarchy", () => {
    const rawData = ref([])
    const treeData = ref([])   // 👈 AQUÍ nace treeData
    const loading = ref(false)
    const error = ref(null)
    const currentLevel = ref("services") // "services" | "microservices" | "active_objects" | "functions"
    const selectedService = ref(null)
    const selectedMicroservice = ref(null)
    const selectedAO = ref(null)


    async function fetchHierarchy() {
        loading.value = true
        error.value = null
        try {
            const res = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/hierarchy`)
            if (!res.ok) throw new Error("Failed to fetch hierarchy")
            const data = await res.json()
            rawData.value = data
            treeData.value = mapHierarchyToTree(data)  // 👈 llenamos treeData
        } catch (err) {
            console.error("Error fetching hierarchy:", err)
            error.value = err
        } finally {
            loading.value = false
        }
    }

    return { rawData, treeData, fetchHierarchy, loading, error }
})
