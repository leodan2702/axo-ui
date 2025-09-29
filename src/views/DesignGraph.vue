<template>
  <v-main class="d-flex flex-column pa-0 ma-0">
    <v-container fluid class="pa-0 ma-0 d-flex h-100">
      <!-- Side panel -->
      <SidePanel :objects="hierarchyStore.treeData" />

      <div class="graph-container">
        <!-- Toolbar -->
        <div class="toolbar">
          <button class="btn primary" @click="createBucket" data-step="create-bucket-button">
            <img :src="bucket" alt="bucket" class="btn-icon" />
            Create Bucket
          </button>

          <button class="btn primary" @click="reconfigureSelected" data-step="edit-selection-button">
            <img :src="OA" alt="configure" class="btn-icon" />
             Edit Selection
          </button>

          <button class="btn primary" @click="clearGraph" data-step="clean-canvas-button">
            <img :src="clean" alt="clean" class="btn-icon" />
            Clean Canvas
          </button>

          <button class="btn primary" @click="deleteSelected" data-step="remove-selection-button">
            <img :src="del" alt="delete" class="btn-icon" /> Remove Selection
          </button>

          <button class="btn primary" @click="exportAndSend" data-step="run-coreography-button">
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
            :class="{ 'node-running': running, 'edges-running': running }"
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
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="2000">
      {{ snackbar.text }}
    </v-snackbar>
    <v-dialog v-model="showConfigDialog" max-width="700">
      <!-- Si es Bucket, abre el BucketForm -->
      <BucketForm
        v-if="selectedOA && selectedOA.originData.class_name === 'Bucket'"
        :bucket="selectedOA.originData"
        @save="handleSaveConfig"
        @close="() => showConfigDialog = false"
      />

      <!-- Si es OA, abre el OAConfigForm -->
      <OAConfigForm
        v-else-if="selectedOA && schemaForSelected"
        :oa="selectedOA"
        :schema="schemaForSelected"
        @save="handleSaveConfig"
        @close="() => showConfigDialog = false"
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
import BucketForm from "@/components/BucketForm.vue"
import { v4 as uuidv4 } from "uuid"
import { useChoreographyStore } from "@/store/run_choreograpy"

const nodeTypes = { custom: CustomNode }
const { project } = useVueFlow({ id: "designer" })
const choreographyStore = useChoreographyStore()

const snackbar = ref({ show: false, text: "", color: "error" })
const selectedOA = ref(null)
const schemaForSelected = ref(null)
const showConfigDialog = ref(false)
const running = ref(false)



/* Cargar config de un OA */
const openConfig = (node) => {
  selectedOA.value = node

  if (node.originData.class_name === "Bucket") {
    schemaForSelected.value = null
  } else {
    const fnData = node.originData.functionData || { init_params: [], call_params: [] }
    const saved = node.originData.parameters || { init: {}, call: {} }

    // Inyectar defaults con lo previamente guardado
    const withDefaults = (arr, bag) =>
      (arr || []).map(p => ({ ...p, default: bag?.[p.name] ?? p.default ?? "" }))

    schemaForSelected.value = {
      init_params: withDefaults(fnData.init_params, saved.init),
      call_params: withDefaults(fnData.call_params, saved.call),
    }
  }

  showConfigDialog.value = true
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
    originData: { id: newId, class_name: "Bucket", type: "Bucket", icon: bucket,sink_bucket_id: "",
      sink_key: "", },
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
    id: `${data.active_object_id}-${data.method}-${uuidv4()}`,
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


const buildChoreographyYAML = () => {
  // ---------- helpers ----------
  const getTriggerName = (node) =>
    `${node.data.label.replace(/\s+/g, "")}_${node.originData.method || "run"}`

  const findNode = (id) => nodes.value.find(n => n.id === id)

  // ---------- 1) construir triggers base ----------
  const triggers = []
  const triggerByNodeId = new Map()

  nodes.value
    .filter(n => n.originData.class_name !== "Bucket")
    .forEach(node => {
      const method = node.originData.method || "run"
      const alias  = `${node.originData.alias || node.originData.class_name}.${method}`

      const trig = {
        name: getTriggerName(node),
        rule: {
          target: { alias },
          parameters: {
            init: { ...(node.originData.parameters?.init || {}) },
            call: { ...(node.originData.parameters?.call || {}) },
          },
        },
      }

      triggers.push(trig)
      triggerByNodeId.set(node.id, trig)
    })

  // ---------- 2) analizar edges para:
  //    a) OA -> Bucket   (escritor del bucket)
  //    b) Bucket -> OA   (lector del bucket)  y set depends_on
  const writerByBucketNodeId = new Map()

  edges.value.forEach(edge => {
    const s = findNode(edge.source)
    const t = findNode(edge.target)
    if (!s || !t) return

    const sIsBucket = s.originData.class_name === "Bucket"
    const tIsBucket = t.originData.class_name === "Bucket"

    // a) OA -> Bucket  => este OA "escribe" en ese bucket
    if (!sIsBucket && tIsBucket) {
      const writerTrig = triggerByNodeId.get(s.id)
      if (writerTrig) {
        writerByBucketNodeId.set(t.id, writerTrig.name)

        // Propagar dónde va a escribir (sink) al call del writer
        const sinkBucketId = t.originData.sink_bucket_id
        const sinkKey      = t.originData.sink_key
        if (sinkBucketId && sinkKey) {
          writerTrig.rule.parameters.call = {
            ...(writerTrig.rule.parameters.call || {}),
            sink_bucket_id: sinkBucketId,
            sink_key: sinkKey,
          }
        }
      }
    }

    // b) Bucket -> OA  => este OA "lee" del bucket; depende del writer si existe
    if (sIsBucket && !tIsBucket) {
      const readerTrig = triggerByNodeId.get(t.id)
      if (readerTrig) {
        // Propagar de qué bucket lee (source) al init del reader
        const sourceBucketId = s.originData.sink_bucket_id
        const sourceKey      = s.originData.sink_key
        if (sourceBucketId && sourceKey) {
          readerTrig.rule.parameters.init = {
            ...(readerTrig.rule.parameters.init || {}),
            source_bucket_id: sourceBucketId,
            source_key: sourceKey,
          }
        }

        // Si ya conocemos quién escribió ese bucket, setear depends_on
        const writerName = writerByBucketNodeId.get(s.id)
        if (writerName && !readerTrig.depends_on) {
          readerTrig.depends_on = writerName
        }
      }
    }

    // c) OA -> OA directo (por si también lo usas)
    if (!sIsBucket && !tIsBucket) {
      const srcTrig = triggerByNodeId.get(s.id)
      const dstTrig = triggerByNodeId.get(t.id)
      if (srcTrig && dstTrig && !dstTrig.depends_on) {
        dstTrig.depends_on = srcTrig.name
      }
    }
  })

  // ---------- 3) topological sort por depends_on ----------
  const ordered = []
  const visited = new Set()
  const byName = new Map(triggers.map(t => [t.name, t]))

  const visit = (trig) => {
    if (!trig || visited.has(trig.name)) return
    if (trig.depends_on) visit(byName.get(trig.depends_on))
    visited.add(trig.name)
    ordered.push(trig)
  }

  triggers.forEach(visit)

  // ---------- logs ----------
  console.log("edges (raw):", JSON.parse(JSON.stringify(edges.value)))
  console.log("writerByBucketNodeId:", Object.fromEntries(writerByBucketNodeId))
  console.log("triggers (unsorted):", triggers.map(t => ({
    name: t.name, depends_on: t.depends_on
  })))
  console.log("triggers (ordered):", ordered.map(t => ({
    name: t.name, depends_on: t.depends_on
  })))

  const choreography = { triggers: ordered }
  console.log("Choreography JSON (raw):", JSON.stringify(choreography, null, 2))
  console.log("Choreography YAML:\n", yaml.dump(choreography))

  return choreography   
}

const buildChoreographyJSON = () => {
  // ---------- helpers ----------
  const getTriggerName = (node) =>
    `${node.data.label.replace(/\s+/g, "")}_${node.originData.method || "run"}`

  const findNode = (id) => nodes.value.find(n => n.id === id)

  // ---------- 1) construir triggers base ----------
  const triggers = []
  const triggerByNodeId = new Map()

  nodes.value
    .filter(n => n.originData.class_name !== "Bucket")
    .forEach(node => {
      const method = node.originData.method || "run"
      const alias  = `${node.originData.alias || node.originData.class_name}.${method}`

      const trig = {
        name: getTriggerName(node),
        rule: {
          target: { alias },
          parameters: {
            init: { ...(node.originData.parameters?.init || {}) },
            call: { ...(node.originData.parameters?.call || {}) },
          },
        },
      }

      triggers.push(trig)
      triggerByNodeId.set(node.id, trig)
    })

  // ---------- 2) analizar edges para:
  //    a) OA -> Bucket   (escritor del bucket)
  //    b) Bucket -> OA   (lector del bucket)  y set depends_on
  const writerByBucketNodeId = new Map()

  edges.value.forEach(edge => {
    const s = findNode(edge.source)
    const t = findNode(edge.target)
    if (!s || !t) return

    const sIsBucket = s.originData.class_name === "Bucket"
    const tIsBucket = t.originData.class_name === "Bucket"

    // a) OA -> Bucket  => este OA "escribe" en ese bucket
    if (!sIsBucket && tIsBucket) {
      const writerTrig = triggerByNodeId.get(s.id)
      if (writerTrig) {
        writerByBucketNodeId.set(t.id, writerTrig.name)

        // Propagar dónde va a escribir (sink) al call del writer
        const sinkBucketId = t.originData.sink_bucket_id
        const sinkKey      = t.originData.sink_key
        if (sinkBucketId && sinkKey) {
          writerTrig.rule.parameters.call = {
            ...(writerTrig.rule.parameters.call || {}),
            sink_bucket_id: sinkBucketId,
            sink_key: sinkKey,
          }
        }
      }
    }

    // b) Bucket -> OA  => este OA "lee" del bucket; depende del writer si existe
    if (sIsBucket && !tIsBucket) {
      const readerTrig = triggerByNodeId.get(t.id)
      if (readerTrig) {
        // Propagar de qué bucket lee (source) al init del reader
        const sourceBucketId = s.originData.sink_bucket_id
        const sourceKey      = s.originData.sink_key
        if (sourceBucketId && sourceKey) {
          readerTrig.rule.parameters.init = {
            ...(readerTrig.rule.parameters.init || {}),
            source_bucket_id: sourceBucketId,
            source_key: sourceKey,
          }
        }

        // Si ya conocemos quién escribió ese bucket, setear depends_on
        const writerName = writerByBucketNodeId.get(s.id)
        if (writerName && !readerTrig.depends_on) {
          readerTrig.depends_on = writerName
        }
      }
    }

    // c) OA -> OA directo (por si también lo usas)
    if (!sIsBucket && !tIsBucket) {
      const srcTrig = triggerByNodeId.get(s.id)
      const dstTrig = triggerByNodeId.get(t.id)
      if (srcTrig && dstTrig && !dstTrig.depends_on) {
        dstTrig.depends_on = srcTrig.name
      }
    }
  })

  // ---------- 3) topological sort por depends_on ----------
  const ordered = []
  const visited = new Set()
  const byName = new Map(triggers.map(t => [t.name, t]))

  const visit = (trig) => {
    if (!trig || visited.has(trig.name)) return
    if (trig.depends_on) visit(byName.get(trig.depends_on))
    visited.add(trig.name)
    ordered.push(trig)
  }

  triggers.forEach(visit)

  
  console.log("edges (raw):", JSON.parse(JSON.stringify(edges.value)))
  console.log("writerByBucketNodeId:", Object.fromEntries(writerByBucketNodeId))
  console.log("triggers (unsorted):", triggers.map(t => ({
    name: t.name, depends_on: t.depends_on
  })))
  console.log("triggers (ordered):", ordered.map(t => ({
    name: t.name, depends_on: t.depends_on
  })))

  const choreography = { triggers: ordered }
  console.log("Choreography JSON (raw):", JSON.stringify(choreography, null, 2))
  console.log("Choreography YAML:\n", yaml.dump(choreography))

  return {format: "yaml", 
          content: yaml.dump(choreography),}   
}

const handleSaveConfig = (updated) => {
  if (!selectedOA.value) return

  nodes.value = nodes.value.map(node => {
    if (node.id !== selectedOA.value.id) return node

    if (node.originData.class_name === "Bucket") {
      return {
        ...node,
        originData: {
          ...node.originData,
          sink_bucket_id: updated.sink_bucket_id,
          sink_key: updated.sink_key,
        }
      }
    } else {
      return {
        ...node,
        originData: {
          ...node.originData,
          parameters: {
            init: updated?.config?.init ?? {},
            call: updated?.config?.call ?? {},
          }
        }
      }
    }
  })

  showConfigDialog.value = false
  snackbar.value = { show: true, text: "Configuration updated", color: "success" }
}


const exportAndSend = async () => {
  running.value = true
  snackbar.value = { show: true, text: "Running choreography...", color: "info" }

  const choreographyJson = buildChoreographyJSON()
  const { color, data, message } = await choreographyStore.interpretChoreography(choreographyJson)

  running.value = false

  if (color === "success") {
    snackbar.value = { show: true, text: "Choreography sent to ShieldX", color }
    console.log("Interpretation result:", data)
  } else {
    snackbar.value = { show: true, text: message, color }
  }
}


const exportAndSendYML = async () => {
  running.value = true
  snackbar.value = { show: true, text: "Running choreography...", color: "info" }
  const choreographyObj = buildChoreographyYAML()

  const { color, data, message } = await choreographyStore.interpretChoreographyYaml(
    choreographyObj
  )

  running.value = false

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
