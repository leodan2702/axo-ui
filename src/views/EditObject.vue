<template>
    <!-- main -->
        <v-main 
        class="d-flex-column justify-center align-center pa-5"
        style="min-height: 300px;"
        >
          <v-container>
            <div class="d-flex flex-column">
                <div class="d-flex align-center">
                    <h1>Edit Object</h1>                   
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
                <v-divider ></v-divider>
                <div class="d-flex justify-center">
                    <div class="edit-container">
                        <v-card>
                        <!-- tab-bar -->
                            <v-layout
                                class="overflow-visible"
                                style="height: 56px;"
                            >
                                <v-bottom-navigation
                                v-model="value"
                                active
                                >
                                <v-btn>file.py</v-btn>
                                <v-btn>file.py</v-btn>
                                <v-btn class=" bg-blue-grey-lighten-1">
                                    <v-icon small>mdi-plus</v-icon>
                                </v-btn>
                                </v-bottom-navigation>
                            </v-layout>
                        </v-card>
                        <VDivider/>
                        <div>
                        </div>
                    </div>
                </div>           
            </div>     
          </v-container>               
        </v-main>
</template>

<script setup>

import { ref } from 'vue';

const value = ref('0')
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
  background-color: #040404;
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
.edit-container{
    margin-top: 15px;
    width: 85vw;
    height: 600px;
    background-color: #f2f2f2ff;
}

</style>

