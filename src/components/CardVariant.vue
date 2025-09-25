<template>
  <div class="card">
    <!-- Imagen dinámica -->
    <div class="img">
      <img v-if="image" :src="image" alt="Active Object" />
    </div>

    <div class="textBox">
      <div class="textContent">
        <div>
          <p class="h1">{{ title }}</p>
          <p class="p">{{ description }}</p>
        </div>
        <div class="d-flex align-center justify-space-between ml-5">
          <span class="span">
            <v-icon small>mdi-account</v-icon>
            {{ autor }}
          </span>
          <slot name="button"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.card {
  width: 100%;
  max-width: 800px;
  height: 90px;
  background: #d9d8d8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: left;
  transition: 0.4s ease-in-out;
  margin-bottom: 15px;
}

.card:hover {
  cursor: pointer;
  transform: scale(1.05);
}

.img {
  width: 50px;
  height: 50px;
  margin-left: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.textBox {
  width: calc(100% - 90px);
  margin-left: 10px;
  color: rgb(0, 0, 0);
}

.textContent {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.span {
  font-size: 10px;
  color: #4a4a4a00;
  margin-right: 5px;
}

.h1 {
  font-size: 16px;
  font-weight: bold;
}

.p {
  font-size: 12px;
  font-weight: normal;
}
</style>
