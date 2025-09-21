<template>
  <v-main class="d-flex flex-column pa-0 ma-0">
    <v-container fluid class="pa-0 ma-0 d-flex h-100">


      <SidePanel :objects="availableObjects" />


      <div class="graph-container">

        <div class="toolbar">
          <button class="btn primary" @click="createBucket">
            <img :src="bucket" alt="bucket" class="btn-icon" />
            Create Bucket
          </button>
          <button class="btn primary" @click="clearGraph"><img :src="clean" alt="clean" class="btn-icon" /> Clean Canvas</button>
          <button class="btn primary"><img :src="iconrun" alt="iconrun" class="btn-icon" /> Run Choreograpy</button>
        </div>

        <div class="flow-wrap" @dragover="onDragOver" @drop="onDrop">
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            :node-types="nodeTypes"
            :default-edge-options="{ animated: true }"
            fit-view-on-init
            @connect="onConnect"
          />
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from "vue"
import { VueFlow, useVueFlow } from "@vue-flow/core"
import "@vue-flow/core/dist/style.css"
import "@vue-flow/core/dist/theme-default.css"
import OA from "@/assets/axo_OA_assets.png"
import bucket from "@/assets/axo_bucket_assets.png"
import clean from "@/assets/icons-clean.png"
import iconrun from "@/assets/icon-run.png"
import SidePanel from "../components/SidePanel.vue"
import CustomNode from "../components/CustomNode.vue"

const nodeTypes = { custom: CustomNode }
const { project } = useVueFlow()

/* Objetos disponibles en el panel */
const availableObjects = ref([
  { id: "ao1", class_name: "BellmanFord1", type: "BellmanFord", alias: "bellmanford_v1.run", icon: OA },
  { id: "ao2", class_name: "Plot", type: "Plot", alias: "plot.run", icon: OA },
  { id: "ao3", class_name: "OptimizationObject", type: "OptimizationObject", alias: "optimizer_v2.run", icon: OA },
  { id: "ao4", class_name: "OptimizationObject", type: "OptimizationObject", alias: "optimizer_v2.run", icon: OA },
  { id: "ao5", class_name: "OptimizationObject", type: "OptimizationObject", alias: "optimizer_v2.run", icon: OA },
  { id: "ao5", class_name: "OptimizationObject", type: "OptimizationObject", alias: "optimizer_v2.run", icon: OA },
  

  
])

/* Estado del grafo */
const nodes = ref([])
const edges = ref([])

/* Crear nuevo bucket en el panel */
const createBucket = () => {
  const newId = "bucket-" + Date.now()

  nodes.value.push({
    id: newId,
    type: "custom",
    position: { x: 200, y: 200 }, // 👈 posición inicial (puedes calcularla o centrarla)
    data: { label: "Bucket", icon: bucket },
    originData: {
      id: newId,
      class_name: "Bucket",
      type: "Bucket",
      icon: bucket,
    },
  })
}


/* Limpiar grafo */
const clearGraph = () => {
  nodes.value = []
  edges.value = []
}

/* Drag & Drop */
const onDragOver = (event) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = "move"
}

const onDrop = (event) => {
  const wrapper = event.currentTarget
  const bounds = wrapper.getBoundingClientRect()
  const raw = event.dataTransfer.getData("application/vueflow")
  if (!raw) return

  const data = JSON.parse(raw)
  const pos = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  const position = project(pos)

  nodes.value.push({
    id: `${data.id}-${Date.now()}`,
    type: "custom",
    position,
    data: { label: data.class_name, icon: data.icon },
    originData: data,
  })
}

/* Guardar conexiones */
const onConnect = (params) => {
  edges.value.push({ ...params, style: { stroke: '#2563eb' } })
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
  font-size: 17px;
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

.btn.success {
  background: #34d399;
  color: white;
}
.btn.success:hover {
  background: #10b981;
}

.btn-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

</style>
