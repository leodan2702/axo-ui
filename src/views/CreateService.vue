<template>
  <v-main 
    class="d-flex-column justify-center align-center pa-5"
    style="min-height: 300px;"
  >
    <v-container>
        <div class="d-flex align-center mb-6">
          <!-- Botón Return -->
          <v-btn
            color="·040404"
            variant="outlined"
            @click="goBack('/Services')"
            class="mr-4"
          >
          <v-icon start>mdi-arrow-left-circle</v-icon>
            Back
          </v-btn>

          <h1 class="page-title">Create Service</h1>
          <v-spacer></v-spacer>
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
import { useRouter } from "vue-router"

const router = useRouter()
const goBack = (path) => {
  router.push({ path })
}
</script>
