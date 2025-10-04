<template>
  <v-main 
    class="d-flex-column justify-center align-center pa-5"
    style="min-height: 300px;"
  >
    <v-container>
        <div class="d-flex align-center mb-6">
          <!-- Botón Return -->
          <v-btn
            color="#040404"
            variant="outlined"
            @click="goBack('/roles')"
            class="mr-4"
          >
          <v-icon start>mdi-arrow-left-circle</v-icon>
            Back
          </v-btn>

          <h1 class="page-title">Create Roles</h1>
          <v-spacer></v-spacer>
        </div>
      <v-divider></v-divider>
      <v-sheet class="mt-5 d-flex justify-center" style= "width: 100%;">
        <!-- Formulario de Roles -->
        <FormCreateRole data-step="form-role"/>
      </v-sheet>         
    </v-container>                  
  </v-main>
</template>

<script setup>
import FormCreateRole from '@/components/FormCreateRole.vue';
import { useRouter } from "vue-router"

const router = useRouter()
const goBack = (path) => {
  router.push({ path })
}
</script>

