<template>
  <v-main 
    class="d-flex-column justify-center align-center pa-5"
    style="min-height: 300px;"
  >
    <v-container>
        <div class="d-flex align-center mb-4">
          <h1>Microservices</h1>
        </div>

        <v-divider></v-divider>

        <!-- Contenedor centrado del formulario -->
        <v-sheet class="mt-5 d-flex justify-center" style="width: 100%;">
          <FormCreateMicroservice />
        </v-sheet>
  
    </v-container>                  
  </v-main>
</template>

<script setup>
import FormCreateMicroservice from '@/components/FormCreateMicroservice.vue';
</script>