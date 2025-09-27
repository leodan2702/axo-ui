<template>
  <v-main class="d-flex flex-column pa-0 ma-0">
    <v-container fluid class="pa-0 ma-0 d-flex h-100">
      <!-- Side panel -->
      <SidePanel :objects="hierarchyStore.treeData" />

      <div class="graph-container">
        <!-- Toolbar -->
        <div class="toolbar">
          <button class="btn primary" @click="createBucket">
            <img :src="bucket" alt="bucket" class="btn-icon" />
            Create Bucket
          </button>

          <button class="btn primary" @click="reconfigureSelected">
            <img :src="OA" alt="configure" class="btn-icon" />
             Edit Selection
          </button>

          <button class="btn primary" @click="clearGraph">
            <img :src="clean" alt="clean" class="btn-icon" />
            Clean Canvas
          </button>

          <button class="btn primary" @click="deleteSelected">
            <img :src="del" alt="delete" class="btn-icon" /> Remove Selection
          </button>

          <button class="btn primary" @click="exportAndSend">
            <img :src="iconrun" alt="iconrun" class="btn-icon" />
            Run Choreography
          </button>
        </div>

        <!-- Canvas -->
        <div class="flow-wrap" @dragover="onDragOver" @drop="onDrop">
          <VueFlow
            id="designer"
            v-model:nodes="nodes"
            v-model:edges="edges"
            :node-types="nodeTypes"
            :default-edge-options="{ animated: true }"
            :elements-selectable="true"
            :selection-on-drag="true"
            :select-nodes-on-drag="true"
            fit-view-on-init
            @connect="onConnect"
          >
            <template #defs>
              <linearGradient id="edge-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#3b82f6" />
                <stop offset="100%" stop-color="#06b6d4" />
              </linearGradient>
            </template>
          </VueFlow>
        </div>
      </div>
    </v-container>

    <!-- Notificaciones -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
    <v-dialog v-model="showConfigDialog" max-width="600">
      <OAConfigForm
        v-if="selectedOA && schemaForSelected"
        :oa="selectedOA"
        :schema="schemaForSelected"
        @save="handleSaveConfig"
      />
    </v-dialog>

  </v-main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"
import { VueFlow, useVueFlow } from "@vue-flow/core"
import { useHierarchyStore } from "@/store/HierarchyStore"

const hierarchyStore = useHierarchyStore()

onMounted(async () => {
  await hierarchyStore.fetchHierarchy()
  window.addEventListener("keydown", onKeyDown)
})
onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeyDown)
})

import "@vue-flow/core/dist/style.css"
import "@vue-flow/core/dist/theme-default.css"
import yaml from "js-yaml"
import OA from "@/assets/axo_OA_assets.png"
import bucket from "@/assets/axo_bucket_assets.png"
import clean from "@/assets/icons-clean.png"
import iconrun from "@/assets/icon-run.png"
import del from "@/assets/icons-delete.png"

import SidePanel from "../components/SidePanel.vue"
import CustomNode from "../components/CustomNode.vue"
import OAConfigForm from "@/components/OAConfigForm.vue"
import { useChoreographyStore } from "@/store/run_choreograpy"

const nodeTypes = { custom: CustomNode }
const { project } = useVueFlow({ id: "designer" })
const choreographyStore = useChoreographyStore()

const snackbar = ref({ show: false, text: "", color: "error" })
const selectedOA = ref(null)
const schemaForSelected = ref(null)
const showConfigDialog = ref(false)

/* Cargar config de un OA */
const openConfig = (node) => {
  selectedOA.value = node

  // Sacar directamente los parámetros desde functionData
  const fnData = node.originData.functionData
  if (fnData) {
    schemaForSelected.value = {
      init_params: fnData.init_params || [],
      call_params: fnData.call_params || [],
    }
  } else {
    schemaForSelected.value = { init_params: [], call_params: [] }
  }

  showConfigDialog.value = true
  console.log("Schema cargado:", schemaForSelected.value)
}


/* Estado del grafo */
const nodes = ref([])
const edges = ref([])

/* Crear bucket */
const createBucket = () => {
  const newId = "bucket-" + Date.now()
  nodes.value.push({
    id: newId,
    type: "custom",
    position: { x: 200, y: 200 },
    data: { label: "Bucket", icon: bucket },
    selectable: true,
    draggable: true,
    connectable: true,
    originData: { id: newId, class_name: "Bucket", type: "Bucket", icon: bucket },
  })
}

/* Limpiar grafo */
const clearGraph = () => {
  nodes.value = []
  edges.value = []
}

const reconfigureSelected = async () => {
  const selectedNode = nodes.value.find((n) => n.selected)
  if (!selectedNode) {
    snackbar.value = { show: true, text: "Select an object first", color: "error" }
    return
  }
  openConfig(selectedNode)
}


/* Eliminar seleccionados */
const deleteSelected = () => {
  nodes.value = nodes.value.filter((n) => !n.selected)
  edges.value = edges.value.filter((e) => !e.selected)
}

/* Teclas */
const onKeyDown = (e) => {
  if (e.key === "Delete" || e.key === "Backspace") deleteSelected()
}

/* Drag & Drop */
const onDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = "move"
}

const onDrop = async (event) => {
  const wrapper = event.currentTarget
  const bounds = wrapper.getBoundingClientRect()
  const raw = event.dataTransfer.getData("application/vueflow")
  if (!raw) return

  const data = JSON.parse(raw)

  const position = project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  })

  const newNode = {
    id: `${data.active_object_id}-${data.method || Date.now()}`,
    type: "custom",
    position,
    data: { label: data.alias || data.class_name, method: data.method, icon: OA},
    selectable: true,
    draggable: true,
    connectable: true,
    originData: data
  }

  nodes.value.push(newNode)

  selectedOA.value = newNode
  await openConfig(newNode)
}

/* Exportar coreografía */
const buildChoreographyJson = () => {
  const triggers = nodes.value
    .filter((node) => node.originData.class_name !== "Bucket")
    .map((node) => {
      const method = node.originData.method || "run"
      const alias = `${node.originData.alias || node.originData.class_name}.${method}`

      return {
        name: node.data.label.replace(/\s+/g, ""),
        rule: {
          target: { alias },
          parameters: {}
        }
      }
    })

  edges.value.forEach((edge) => {
    const sourceNode = nodes.value.find((n) => n.id === edge.source)
    const targetNode = nodes.value.find((n) => n.id === edge.target)
    if (sourceNode && targetNode && sourceNode.originData.class_name !== "Bucket" && targetNode.originData.class_name !== "Bucket") {
      const targetTrigger = triggers.find((t) => t.name === targetNode.data.label.replace(/\s+/g, ""))
      if (targetTrigger) {
        if (targetTrigger.depends_on) {
          targetTrigger.depends_on = [].concat(targetTrigger.depends_on, sourceNode.data.label.replace(/\s+/g, ""))
        } else {
          targetTrigger.depends_on = sourceNode.data.label.replace(/\s+/g, "")
        }
      }
    }
  })

  return {
    format: "yaml",
    content: yaml.dump({ triggers })
  }
}

const exportAndSend = async () => {
  const choreographyJson = buildChoreographyJson()
  const { color, data, message } = await choreographyStore.interpretChoreography(choreographyJson)

  if (color === "success") {
    snackbar.value = { show: true, text: "Choreography sent to ShieldX", color }
    console.log("Interpretation result:", data)
  } else {
    snackbar.value = { show: true, text: message, color }
  }
}

/* Conexiones */
const onConnect = (params) => {
  const sourceNode = nodes.value.find((n) => n.id === params.source)
  const targetNode = nodes.value.find((n) => n.id === params.target)
  if (!sourceNode || !targetNode) return

  const isSourceBucket = sourceNode.originData?.class_name === "Bucket"
  const isTargetBucket = targetNode.originData?.class_name === "Bucket"

  const isSourceOA = !isSourceBucket
  const isTargetOA = !isTargetBucket

  if ((isSourceBucket && isTargetBucket) || (isSourceOA && isTargetOA)) {
    snackbar.value = { show: true, text: "Connection not allowed", color: "error" }
    return
  }

  edges.value.push({
    id: `e-${params.source}-${params.target}-${Date.now()}`,
    ...params,
    style: { stroke: "#2563eb" },
    selectable: true,
  })
}
</script>



<style>
.flow-wrap {
  flex: 1;
  height: 90vh;
}

.flow-wrap .vue-flow {
  width: 100%;
  height: 100%;
}

.graph-container {
  flex: 1;
  position: relative;
}

.toolbar {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  background: #ffffff;
  padding: 10px 18px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.btn.primary {
  background: #f3f4f6;
  color: #374151;
}
.btn.primary:hover {
  background: #e5e7eb;
}
.btn.danger {
  background: #f87171;
  color: white;
}
.btn.danger:hover {
  background: #ef4444;
}
.btn-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.oa-config-form {
  position: absolute;
  top: 80px;
  right: 20px;
  z-index: 3000;
  background: white;
  max-width: 400px;
}

.vue-flow__edge.selected path {
  stroke: #3b82f6 !important; /* azul vivo */
  stroke-width: 3px !important;
}

</style>
