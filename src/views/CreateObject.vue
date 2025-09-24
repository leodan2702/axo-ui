<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 700px;">
    <v-container fluid>
      <div class="d-flex flex-column">
        <!-- Header -->
        <div class="d-flex align-center mb-4">
          <!-- Botón Return -->
          <v-btn
            color="grey darken-1"
            variant="outlined"
            @click="goBack('/my-objects')"
            class="mr-4"
            
          >
            <v-icon left>mdi-arrow-left</v-icon>
            Return
          </v-btn>

          <h1 class="page-title">Create Active Object</h1>
          <v-spacer></v-spacer>
        </div>

        <v-divider></v-divider>

        <!-- Contenedor principal -->
        <div class="pa-5">
          <v-row no-gutters style="height: calc(100vh - 160px);">
            
            <v-col cols="12" md="auto" class="form-col">
              <v-sheet class="pa-4 form-sheet" elevation="1">
                <FormCreateObject />
              </v-sheet>
            </v-col>

            <v-col>
              <v-sheet class="code-area-sheet" elevation="1">
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
  font-size: 1.6rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}


.form-col {
  max-width: 420px;
}

.form-sheet {
  height: 100%; 
  display: flex;
  flex-direction: column;
}

/* Área de código */
.code-area-sheet {
  height: 100%;           
  display: flex;
  flex-direction: column;
  padding: 0;             
}

</style>
