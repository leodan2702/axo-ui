<template>
  <div class="custom-node">
    <!-- Imagen del nodo -->
    <img v-if="data.icon" :src="data.icon" class="node-icon" />
    <span v-else class="fallback">⚙️</span>

    <!-- Nombre (opcional) -->
    <div class="node-label">{{ data.label }}</div>

    <!-- Handles de conexión -->
    <Handle style="background:#3b82f6" type="target" :position="Position.Left" />
    <Handle style="background:#3b82f6" type="source" :position="Position.Right" />
  </div>
</template>

<script setup>
import { Handle, Position } from "@vue-flow/core"

defineProps({
  data: Object
})
</script>

<style scoped>
.custom-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent; 
  border: none;
}

.node-icon {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

.node-label {
  font-size: 12px;
  margin-top: 4px;
  font-weight: 600;
  text-align: center;
}

.fallback {
  font-size: 30px;
}
</style>
