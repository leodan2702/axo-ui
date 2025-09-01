<template>
  <!-- main -->
  <v-main 
    class="d-flex-column justify-center align-center pa-5"
    style="min-height: 300px;"
  >
    <v-container>
      <div class="d-flex flex-column">
        <div class="d-flex align-center">
          <h1>Create Security Policy</h1>
          <v-spacer></v-spacer>
          <!-- boton persistence -->
          <button class="btn-persistence">
            Persistence
          </button>
          <!-- boton run -->
          <button class="btn-run">
            Run
          </button>         
        </div>
        <v-divider></v-divider>
        <div class="pa-5">
          <v-row no-gutters>
            <v-col cols="5">
              <v-sheet class="mt-5">
                <!-- formulario de Security Policy -->
                <FormCreateSecurityPolicy />
              </v-sheet>
            </v-col>
            <v-col cols="7">
              <v-sheet class="mt-5">
                <!-- Code Area -->
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
import FormCreateSecurityPolicy from '@/components/FormCreateSecurityPolicy.vue';
import CodeArea from '@/components/CodeArea.vue';
</script>

<style scoped>
.btn-persistence {
  background-color:  #57778F;
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
