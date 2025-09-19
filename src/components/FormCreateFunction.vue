<template>
  <v-card
    class="d-flex flex-column pa-6 elevation-5 rounded-lg"
    style="width: 100%; max-width: 600px;"
  >
    <v-card-title>{{ isEditing ? 'Edit Function' : 'Create a New Function' }}</v-card-title>
    <v-card-subtitle class="mb-4">Fill in the fields below</v-card-subtitle>

    <v-form
      ref="formRef"
      v-model="isValid"
      fast-fail
      @submit.prevent="save"
      :lazy-validation="true"
    >
      <!-- Nombre -->
      <v-text-field
        v-model="functionsStore.form.name"
        label="Function Name"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-function"
      />

      <!-- Microservice -->
      <v-select
        v-model="functionsStore.form.microservice_id"
        :items="availableMicroservices"
        item-title="name"
        item-value="microservice_id"
        label="Microservice"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-cog"
      />

      <!-- Endpoint -->
      <v-select
        v-model="functionsStore.form.endpoint_id"
        :items="availableEndpoints"
        item-title="name"
        item-value="endpoint_id"
        label="Endpoint"
        variant="filled"
        prepend-inner-icon="mdi-api"
      />

      <!-- Imagen -->
      <v-text-field
        v-model="functionsStore.form.image"
        label="Image (Docker)"
        variant="filled"
        :rules="[rules.required]"
        required
        prepend-inner-icon="mdi-docker"
      />

      <!-- Recursos -->
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="functionsStore.form.resources.cpu"
            label="CPU"
            type="number"
            variant="filled"
            :rules="[rules.required]"
            required
            prepend-inner-icon="mdi-chip"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="functionsStore.form.resources.ram"
            label="RAM (e.g. 1GB)"
            variant="filled"
            :rules="[rules.required]"
            required
            prepend-inner-icon="mdi-memory"
          />
        </v-col>
      </v-row>

      <!-- Almacenamiento -->
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="functionsStore.form.storage.capacity"
            label="Capacity (e.g. 1GB)"
            variant="filled"
            prepend-inner-icon="mdi-database"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="functionsStore.form.storage.source_path"
            label="Source Path"
            variant="filled"
            prepend-inner-icon="mdi-folder-upload"
          />
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="functionsStore.form.storage.sink_path"
            label="Sink Path"
            variant="filled"
            prepend-inner-icon="mdi-folder-download"
          />
        </v-col>
      </v-row>

      <!-- Botón Guardar -->
      <div class="d-flex mt-4">
        <v-btn
          :loading="functionsStore.loading"
          color="#11222eff"
          size="large"
          type="submit"
          variant="elevated"
          block
          :disabled="!isValid"
        >
          {{ isEditing ? 'Update' : 'Save' }}
        </v-btn>
      </div>
    </v-form>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      location="bottom center"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useFunctionsStore } from "@/store/functions";
import { useMicroservicesStore } from "@/store/microservices";
import { useEndpointsStore } from "@/store/endpoints";

const functionsStore = useFunctionsStore();
const microservicesStore = useMicroservicesStore();
const endpointsStore = useEndpointsStore();

const availableMicroservices = ref([]);
const availableEndpoints = ref([]);

const isValid = ref(false);
const formRef = ref(null);
const isEditing = ref(false);
const snackbar = ref({ show: false, text: "", color: "success" });

const rules = { required: (v) => !!v || "Field required" };
const route = useRoute();

// --- Cargar formulario ---
const loadForm = (editQuery) => {
  if (editQuery) {
    isEditing.value = true;
    const fnToEdit = functionsStore.functions.find((f) => f.function_id === editQuery);
    if (fnToEdit) {
      functionsStore.form = { ...fnToEdit };
    }
  } else {
    isEditing.value = false;
    functionsStore.resetForm();
    formRef.value.resetValidation();
    isValid.value = false;
  }
};

// --- Al montar ---
onMounted(async () => {
  await microservicesStore.get_microservices();
  availableMicroservices.value = microservicesStore.microservices.map((m) => ({
    microservice_id: m.microservice_id,
    name: m.name ?? m.microservice_id,
  }));

  await endpointsStore.get_endpoints();
  availableEndpoints.value = endpointsStore.endpoints.map((e) => ({
    endpoint_id: e.endpoint_id,
    name: e.name ?? e.endpoint_id,
  }));

  loadForm(route.query.edit);
});

// --- Al cambiar ruta ---
onBeforeRouteUpdate((to) => loadForm(to.query.edit));

// --- Al desmontar ---
onBeforeUnmount(() => {
  functionsStore.resetForm();
  formRef.value.resetValidation();
  isValid.value = false;
});

// --- Guardar ---
const save = async () => {
  let result;
  if (isEditing.value) {
    result = await functionsStore.update_function(route.query.edit);
  } else {
    result = await functionsStore.create_function();
  }

  if (result.color === "success") {
    snackbar.value = {
      show: true,
      text: isEditing.value
        ? `Function updated successfully: ${result.data.name}`
        : `Function created successfully: ${result.data.name}`,
      color: "success",
    };
    formRef.value.resetValidation();
    if (!isEditing.value) functionsStore.resetForm();
  } else {
    snackbar.value = { show: true, text: "Error: " + result.message, color: "error" };
  }
};
</script>


