<template>
  <div class="side-panel">
    <div class="title-row">
      <h3 class="title">Binding Objects</h3>
      <span class="counter">{{ objects.length }}</span>
    </div>
    <!-- Lista con scroll -->
    <div class="objects-list">
      <div
        v-for="obj in objects"
        :key="obj.id"
        draggable="true"
        @dragstart="onDragStart($event, obj)"
        class="palette-item"
      >
        <img v-if="obj.icon" :src="obj.icon" class="palette-icon" />
        <span v-else>⚙️</span>
        {{ obj.label }}
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  objects: {
    type: Array,
    required: true
  }
})

const onDragStart = (event, obj) => {
  event.dataTransfer.setData("application/vueflow", JSON.stringify(obj))
  event.dataTransfer.effectAllowed = "move"
}
</script>

<style scoped>
.side-panel {
  display: flex;
  flex-direction: column;
  height: 90vh;              
  width: 280px;
  padding: 16px;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  position: sticky;           
  top: 0;
}

.title {
    font-weight: bold;
    margin-bottom: 12px;
}

/* Lista con scroll */
.objects-list {
    flex: 1;
    /* ocupa todo el espacio disponible */
    overflow-y: auto;
    /* activa scroll si hay muchos objetos */
    padding-right: 6px;
    /* espacio para que el scroll no tape */
}

/* Items */
.palette-item {
    padding: 10px;
    margin-bottom: 8px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .04);
    cursor: move;
    display: flex;
    align-items: center;
    gap: 6px;
}

.palette-icon {
    width: 50px;
    height: 50px;
    object-fit: contain;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.title {
  font-weight: bold;
  margin: 0;
}

.counter {
  background: #3b82f6; /* azul */
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 12px;
}

</style>
