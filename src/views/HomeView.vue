<template>
  <v-main class="pa-6" style="background-color: #f5f5f5; min-height: 100vh;">
    <v-container fluid>
      <h1 class="mb-6">Home</h1>
      <v-row dense>
        <!-- Roles -->
        <v-col cols="12" sm="6" md="2">
          <v-card
            class="pa-6 hover-card"
            color="#3f51b5"
            dark
            @click="goTo('roles')"
          >
            <div class="d-flex justify-space-between align-center">
              <v-icon large color="white">mdi-account-group</v-icon>
              <div class="text-h4 white--text">{{ roles_store.roles.length }}</div>
            </div>
            <div class="mt-3 white--text font-weight-medium">Roles</div>
          </v-card>
        </v-col>

        <!-- Security Policies -->
        <v-col cols="12" sm="6" md="2">
          <v-card
            class="pa-6 hover-card"
            color="#009688"
            dark
            @click="goTo('security_policy')"
          >
            <div class="d-flex justify-space-between align-center">
              <v-icon large color="white">mdi-shield-check</v-icon>
              <div class="text-h4 white--text">{{ security_store.policies.length }}</div>
            </div>
            <div class="mt-3 white--text font-weight-medium">Security Policies</div>
          </v-card>
        </v-col>

        <!-- Endpoints -->
        <v-col cols="12" sm="6" md="2">
          <v-card
            class="pa-6 hover-card"
            color="#673ab7"
            dark
            @click="goTo('endpoints')"
          >
            <div class="d-flex justify-space-between align-center">
              <v-icon large color="white">mdi-access-point</v-icon>
              <div class="text-h4 white--text">{{ endpoints_store.endpoints.length }}</div>
            </div>
            <div class="mt-3 white--text font-weight-medium">Endpoints</div>
          </v-card>
        </v-col>

        <!-- Services -->
        <v-col cols="12" sm="6" md="2">
          <v-card
            class="pa-6 hover-card"
            color="#ff5722"
            dark
            @click="goTo('services')"
          >
            <div class="d-flex justify-space-between align-center">
              <v-icon large color="white">mdi-cloud</v-icon>
              <div class="text-h4 white--text">{{ services_store.services.length }}</div>
            </div>
            <div class="mt-3 white--text font-weight-medium">Services</div>
          </v-card>
        </v-col>

        <!-- Microservices -->
        <v-col cols="12" sm="6" md="2">
          <v-card
            class="pa-6 hover-card"
            color="#1976d2"
            dark
            @click="goTo('microservices')"
          >
            <div class="d-flex justify-space-between align-center">
              <v-icon large color="white">mdi-cogs</v-icon>
              <div class="text-h4 white--text">{{ microservices_store.microservices.length }}</div>
            </div>
            <div class="mt-3 font-weight-medium white--text">Microservices</div>
          </v-card>
        </v-col>

        <!-- My Objects -->
        <v-col cols="12" sm="6" md="2">
          <v-card
            class="pa-6 hover-card"
            color="#795548"
            dark
            @click="goTo('my-objects')"
          >
            <div class="d-flex justify-space-between align-center">
              <v-icon large color="white">mdi-folder</v-icon>
              <div class="text-h4 white--text">{{ activeObjects_store.activeObjects.length }}</div>
            </div>
            <div class="mt-3 font-weight-medium white--text">My Objects</div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRolesStore } from "@/store/roles";
import { useSecurityPoliciesStore } from "@/store/security_policy";
import { useEndpointsStore } from "@/store/endpoints";
import { useServicesStore } from "@/store/services";
import { useMicroservicesStore } from "@/store/microservices";
import { useActiveObjectsStore } from "@/store/active_objects";

const roles_store = useRolesStore();
const security_store = useSecurityPoliciesStore();
const endpoints_store = useEndpointsStore();
const services_store = useServicesStore();
const microservices_store = useMicroservicesStore();
const activeObjects_store = useActiveObjectsStore();


// Router
const router = useRouter();
const goTo = (section) => router.push(`/${section}`);

// Cargar datos
onMounted(async () => {
  await roles_store.get_roles();
  await security_store.get_policies();
  await endpoints_store.get_endpoints();
  await services_store.get_services();
  await microservices_store.get_microservices();
  await activeObjects_store.getActiveObjects();
});
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}
</style>
