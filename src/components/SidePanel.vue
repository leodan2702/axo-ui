<template>
  <div class="side-panel" data-step="registered-objects-panel">
    <!-- Breadcrumbs -->
    <v-breadcrumbs v-if="stack.length > 0" :items="breadcrumbs" divider="›">
      <template v-slot:prepend>

      </template>
      <template v-slot:title="{ item }">
        <v-tooltip activator="parent" location="bottom">
          {{ item.title }}
        </v-tooltip>
        <span
          class="breadcrumb-link"
          :class="{ disabled: item.disabled }"
          @click="!item.disabled && goToLevel(item)"
        >
          {{ item.title }}
        </span>
      </template>
    </v-breadcrumbs>

    <!-- Descripción + contador -->
    <div class="title-row">
      <h3 class="title">{{ currentTitle }}</h3>
      <span class="counter">{{ currentLevelItems.length }}</span>
    </div>

    <!-- Lista con scroll -->
    <div class="objects-list">
      <div
        v-for="obj in currentLevelItems"
        :key="obj.id"
        class="palette-item"
        :class="{ draggable: obj.type === 'function' }"
        draggable="true"
        @dragstart="onDragStart($event, obj)"
        @click="obj.type !== 'function' && nextLevel(obj)"
      >
        <img v-if="obj.icon" :src="obj.icon" class="palette-icon" />
        <span v-else>⚙️</span>
              {{ obj.type === 'function' && obj.parentAO
        ? `${obj.parentAO.alias || obj.parentAO.object_name}.${obj.label}()`
        : obj.label }}

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useHierarchyStore } from "@/store/HierarchyStore"

const hierarchyStore = useHierarchyStore()

const breadcrumbs = ref([{ title: "Services", level: "services", disabled: false }])
const stack = ref([])

const currentLevelItems = computed(() => {
  if (stack.value.length === 0) return hierarchyStore.treeData
  const last = stack.value[stack.value.length - 1]
  return last.children || []
})

const currentTitle = computed(() => {
  const last = stack.value[stack.value.length - 1]
  switch (last?.type) {
    case "service":
      return "Microservices"
    case "microservice":
      return "Active Objects"
    case "active_object":
      return "Binding Objects"
    case "function":
      return "Methods"
    default:
      return "Services"
  }
})

const nextLevel = (item) => {
  if (!item.children) return
  stack.value.push(item)
  breadcrumbs.value.push({ title: item.label, level: item.type, disabled: false })
}

const goToLevel = (item) => {
  const idx = breadcrumbs.value.indexOf(item)
  stack.value = stack.value.slice(0, idx)
  breadcrumbs.value = breadcrumbs.value.slice(0, idx + 1)
}

const onDragStart = (event, obj) => {
  if (obj.type !== "function") {
    event.preventDefault()
    return
  }

  const payload = {
    id: obj.id,
    method: obj.label,
    params: obj.functionData?.call_params || [],
    init: obj.functionData?.init_params || [],
    active_object_id: obj.parentAO?.active_object_id,
    alias: obj.parentAO?.alias,
    class_name: obj.parentAO?.object_name,
    icon: obj.icon || null,
    functionData: obj.functionData,
  }

  event.dataTransfer.setData("application/vueflow", JSON.stringify(payload))
  event.dataTransfer.effectAllowed = "move"
}

onMounted(async () => {
  if (!hierarchyStore.treeData.length) {
    await hierarchyStore.fetchHierarchy()
  }
})
</script>

<style scoped>
/* ====== Sidebar ====== */
.side-panel {
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: 300px;
  background: #fdfdfd;
  border-right: 2px solid #e5e7eb;
  box-shadow: 2px 0 5px rgba(0,0,0,0.05);
  padding: 12px;
}

/* ====== Breadcrumbs ====== */
.breadcrumb-link {
  cursor: pointer;
  color: #3b82f6;
  font-weight: 500;
  max-width: 45px;     /* limite ancho */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
  vertical-align: middle;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-link.disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

/* ====== Title + Counter ====== */
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
}

.title {
  font-weight: bold;
  font-size: 16px;
  color: #111827;
}

.counter {
  background: #3b82f6;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
}

/* ====== Lista ====== */
.objects-list {
  flex: 1;
  overflow-y: auto;
  margin-top: 10px;
  padding-right: 6px;
}

.palette-item {
  padding: 10px 12px;
  margin-bottom: 8px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #111827;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.palette-item:hover {
  background: #f3f4f6;
}

.palette-item.draggable {
  cursor: grab;
  border-left: 4px solid #3b82f6;
}

.palette-item.draggable:active {
  cursor: grabbing;
}

.palette-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}
</style>
