<template>
  <v-main class="d-flex-column justify-center align-center pa-5" style="min-height: 700px;">
    <v-container>
      <div class="d-flex flex-column">
        <!-- Header -->
        <div class="d-flex align-center mb-4">
          <h1>Create Active Object</h1>
          <v-spacer></v-spacer>
          <!-- Botón Persistence -->
          <!-- <button class="btn-persistence">Persistence</button> -->
          <!-- Botón Run -->
          <!-- <button class="btn-run">Run</button> -->
        </div>

        <v-divider></v-divider>

        <!-- Contenedor principal -->
        <div class="pa-5">
          <v-row no-gutters>
            <!-- Formulario -->
            <v-col cols="7" md="6">
              <v-sheet class="mt-5 pa-4" style="height: 100%;">
                <FormCreateObject />
              </v-sheet>
            </v-col>

            <!-- Code Area -->
            <v-col cols="5" md="6">
              <v-sheet class="mt-5 pa-4" style="height: 100%; overflow-y: auto;">
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
import FormCreateObject from '@/components/FormCreateObject.vue';
import CodeArea from '@/components/CodeArea.vue';
</script>

<style scoped>
.btn-persistence {
  background-color: #57778F;
  color: white;
  padding: 5px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 15px;
}
.btn-persistence:hover {
  background-color: #485d6d;
}

.btn-run {
  background-color: #11212D;
  color: white;
  padding: 5px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 15px;
}
.btn-run:hover {
  background-color: #000000;
}
</style>
