<template>
  <v-main 
    class="d-flex-column justify-center align-center pa-5"
    style="min-height: 300px;"
  >
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-4">
          <h1>Security Policy</h1>
        </div>
        <v-divider></v-divider>

        <!-- Formulario de Security Policy -->
        <v-sheet class="mt-5 d-flex justify-center" style="width: 100%;">
          <FormCreateSecurityPolicy />
        </v-sheet>
      </div>
    </v-container>
  </v-main>
</template>

<script setup>
import FormCreateSecurityPolicy from '@/components/FormCreateSecurityPolicy.vue';
</script>
