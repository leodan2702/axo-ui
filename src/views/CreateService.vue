<template>
  <v-main 
    class="d-flex-column justify-center align-center pa-5"
    style="min-height: 300px;"
  >
    <v-container>
        <div class="d-flex align-center mb-4">
          <h1>Create Service</h1>
        </div>

        <v-divider></v-divider>

        <!-- Contenedor centrado del formulario -->
        <v-sheet class="mt-5 d-flex justify-center" style="width: 100%;">
          <FormCreateService data-step="create-service-button"/>
        </v-sheet>
  
    </v-container>                  
  </v-main>
</template>

<script setup>
import FormCreateService from '@/components/FormCreateService.vue';
</script>
