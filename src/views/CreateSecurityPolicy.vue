<template>
  <v-main 
    class="d-flex-column justify-center align-center pa-5"
    style="min-height: 300px;"
  >
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center mb-6">
          <!-- Botón Return -->
          <v-btn
            color="#040404"
            variant="outlined"
            @click="goBack('/security_policy')"
            class="mr-4"
          >
          <v-icon start>mdi-arrow-left-circle</v-icon>
            Back
          </v-btn>

          <h1 class="page-title">Create Security Policy</h1>
          <v-spacer></v-spacer>
        </div>
        <v-divider></v-divider>

        <!-- Formulario de Security Policy -->
        <v-sheet class="mt-5 d-flex justify-center" style="width: 100%;">
          <FormCreateSecurityPolicy data-step="create-policy"/>
        </v-sheet>
      </div>
    </v-container>
  </v-main>
</template>

<script setup>
import FormCreateSecurityPolicy from '@/components/FormCreateSecurityPolicy.vue';
import { useRouter } from "vue-router"

const router = useRouter()
const goBack = (path) => {
  router.push({ path })
}
</script>
