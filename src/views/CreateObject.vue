<template>
  <v-main class="d-flex flex-column justify-center align-center pa-5" style="min-height: 700px;">
    <v-container fluid>
      <div class="d-flex flex-column">
        <!-- Header -->
        <div class="d-flex align-center mb-6">
          <!-- Botón Return -->
          <v-btn
            color="grey-darken-2"
            variant="outlined"
            @click="goBack('/my-objects')"
            class="mr-4"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            Return
          </v-btn>

          <h1 class="page-title">Create Active Object</h1>
          <v-spacer></v-spacer>
        </div>

        <v-divider></v-divider>

        <!-- Contenedor principal -->
        <div class="mt-6">
          <v-row class="form-layout" no-gutters>
            <!-- Columna del formulario -->
            <v-col cols="12" md="4" class="pr-md-4 mb-6 mb-md-0">
              <v-sheet class="pa-6 form-sheet" elevation="2" rounded="lg">
                <FormCreateObject />
              </v-sheet>
            </v-col>

            <!-- Columna del editor de código -->
            <v-col cols="12" md="8">
              <v-sheet class="code-area-sheet" elevation="2" rounded="lg">
                <CodeArea />
              </v-sheet>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-container>
  </v-main>
</template>

<script setup>
import { useRouter } from "vue-router"
import FormCreateObject from '@/components/FormCreateObject.vue'
import CodeArea from '@/components/CodeArea.vue'

const router = useRouter()

const goBack = (path) => {
  router.push({ path })
}
</script>

<style scoped>
/* Título */
.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937; /* gris oscuro */
  margin: 0;
}

/* Layout general */
.form-layout {
  min-height: calc(100vh - 200px);
}

/* Formulario */
.form-sheet {
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  border: 1px solid #e5e7eb;
}

/* Área de código */
.code-area-sheet {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 1rem;
}
</style>
