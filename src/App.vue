<template>
  <v-app>
    <!-- App Bar -->
    <template v-if="!isAuthRoute">
      <v-app-bar app fixed color="#06141b" class="text-white" style="z-index: 1;">
        <div class="d-flex justify-start">
          <v-img
            @click="router.push('/home')"
            :width="45"
            :src="logo"
            class="ml-5 clickable"
          ></v-img>
        </div>
        <template v-if="$vuetify.display.smAndDown">
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>
        <v-spacer></v-spacer>
        <div class="d-flex">
          <popoverMenu />
        </div>
      </v-app-bar>
      <!-- SideBar -->
      <v-navigation-drawer
        v-model="drawer"
        app
        :expand-on-hover="!$vuetify.display.smAndDown"
        :rail="!$vuetify.display.smAndDown"
        color="#11212d"
        :location="$vuetify.display.mobile ? 'left' : undefined"
      >
        <v-divider></v-divider>
        <v-list density="compact" nav class="text-white">
          <v-list-item
            link
            prepend-icon="mdi-home"
            title="Home"
            value="home"
            @click="navigateTo('/home')"
          ></v-list-item>
          <v-list-item
            link
            prepend-icon="mdi-folder"
            title="My Objects"
            value="myObjects"
            @click="navigateTo('/my-objects')"
          ></v-list-item>
          <v-list-item
            link
            prepend-icon="mdi-cube"
            title="My Virtual Environment"
            value="myEnvironment"
            @click="navigateTo('/my-objects')"
          ></v-list-item>
          <v-list-item
            link
            prepend-icon="mdi-grid"
            title="My Endpoints"
            value="myEndpoints"
            @click="navigateTo('/endpoints')"
          ></v-list-item>
          <v-list-item
            link
            prepend-icon="mdi-grid"
            title="My Microservices"
            value="myMicroservices"
            @click="navigateTo('/microservices')"
          ></v-list-item>
          <v-list-item
            link
            prepend-icon="mdi-grid"
            title="My Functions"
            value="myFunctions"
            @click="navigateTo('/functions')"
          ></v-list-item>
          <v-list-item
            link
            prepend-icon="mdi-grid"
            title="Roles"
            value="Roles"
            @click="navigateTo('/roles')"
          ></v-list-item>
          <v-list-item
            link
            prepend-icon="mdi-grid"
            title="SecurityPolicy"
            value="SecurityPolicy"
            @click="navigateTo('/security_policy')"
          ></v-list-item>
          <v-spacer></v-spacer>
          <v-list-item
            prepend-icon="mdi-graph"
            title="Design"
            value="design"
            @click="navigateTo('/design')"
          ></v-list-item>
          <v-spacer></v-spacer>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Log Out"
            value="logout"
            @click="navigateTo('/')"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
    </template>

    <!-- Main Content -->
    <v-main>
      <RouterView v-slot="{ Component, route }">
          <component :is="Component" :key="route.fullPath" />
      </RouterView>
    </v-main>

    <!-- Footer -->
    <v-footer app v-if="!isAuthRoute" style="z-index: 1;">
      <span class="text-grey"> </span>
    </v-footer>
 </v-app>
</template>

<script setup>
import PopoverMenu from "./components/PopoverMenu.vue";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import logo from '@/assets/logo.png';

const drawer = ref(true);

/* Navegación de rutas */
const router = useRouter();
const navigateTo = (path) => {
  router.push({ path });
};

const route = useRoute();

const isAuthRoute = computed(() => {
  return route.path === "/" || route.path === "/register";
});
</script>

<style scoped>
.clickable {
  cursor: pointer;
}

</style>
