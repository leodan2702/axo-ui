<template>
  <div class="search-container">
    <svg viewBox="0 0 24 24" class="search-icon">
      <path
        d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"
      ></path>
    </svg>
    <input
      type="search"
      v-model="search"
      placeholder="Search..."
      class="search-input"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const search = ref("");
const emit = defineEmits(["update:search"]);

watch(search, (newValue) => {
  emit("update:search", newValue);
});
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 250px;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 2.5rem;
  border-radius: 12px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  font-size: 0.95rem;
  color: #333;
  outline: none;
}

.search-input::placeholder {
  color: #666;
  font-weight: 500;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  width: 1rem;
  height: 1rem;
  fill: #555;
  pointer-events: none;
}
</style>
