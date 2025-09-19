<template>
    <!-- main -->
        <v-main 
        class="d-flex-column justify-center align-center pa-5"
        style="min-height: 300px;"
        >
            <v-container>
                <div class="d-flex flex-column">
                <div class="d-flex align-center">
                    <h1>My Objects</h1>
                    <v-spacer></v-spacer>
                    <!-- boton crear objeto -->
                    <router-link to="/create-object">
                        <button 
                        class="btn-create-object"
                        >
                        Create New
                        </button>
                    </router-link>                   
                    <!-- barra busqueda -->
                    <SearchBar @update:search="handleSearch"  />             
                </div>
                <v-divider ></v-divider>
                <div class="mt-5 pa-5">
                    <!--en esta funcion se rellena el cuerpo del home con los datos del usuario-->
                    <CardVariant 
                    v-for="(object, id) in objects"
                    :key="id"
                    :title="object.title"
                    :description="object.description"
                    :autor="object.autor"
                    >
                    <!-- boton editar -->
                    <template #button>
                        <router-link to="/edit-object">
                            <button class="btn-add">
                                Editar
                            </button>
                        </router-link>                       
                    </template>
                    </CardVariant>
                </div>          
                </div>      
            </v-container>                  
        </v-main>
</template>

<script setup>
import SearchBar from '@/components/SearchBar.vue';
import CardVariant from '@/components/CardVariant.vue';
import { ref } from 'vue';

const currentSearch = ref('');
const handleSearch = (search) => {
  currentSearch.value = search; 
};

const objects = ref([
]);

</script>

<style scoped>
.btn-add {
  background-color: #11212D;
  color: white;
  padding: 5px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 15px;
}

.btn-add:hover {
  background-color: #000000;
}
.btn-create-object {
  background-color: #11212D;
  color: white;
  padding: 5px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 15px;
}

.btn-create-object:hover {
  background-color: #000000;
}
</style>

