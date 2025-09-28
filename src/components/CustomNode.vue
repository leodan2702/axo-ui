<template>
  <div class="custom-node">
    <!-- Imagen del nodo -->
    <img v-if="data.icon" :src="data.icon" class="node-icon" />
    <span v-else class="fallback">⚙️</span>

    <!-- Nombre (opcional) -->
    <div class="node-label">
      {{ data.label }}
      <span v-if="data.method" class="node-method">.{{ data.method }}()</span>
    </div>
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
  transition: all 0.3s ease-in-out;
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

/* Quitar zoom feo al recuadro */
.vue-flow__node.selected .custom-node {
  outline: none;
  box-shadow: none;
  transform: none;
}


.vue-flow__node.selected .custom-node .node-icon {
  transform: scale(1.15);
  filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.7));
  transition: all 0.2s ease-in-out;
}

.node-running .vue-flow__node .custom-node .node-icon {
  animation: pulseGlow 1.5s infinite;
  transform: scale(1.15);
  filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.7));
  transition: all 0.2s ease-in-out;
}

@keyframes pulseGlow {
  0% { filter: drop-shadow(0 0 0px rgba(37, 99, 235, 0.6)); transform: scale(1); }
  50% { filter: drop-shadow(0 0 16px rgba(37, 99, 235, 1)); transform: scale(1.2); }
  100% { filter: drop-shadow(0 0 0px rgba(37, 99, 235, 0.6)); transform: scale(1); }
}
</style>
