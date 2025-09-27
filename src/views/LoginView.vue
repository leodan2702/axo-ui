<template>
  <v-main
    class="d-flex flex-column align-center justify-center bg-color-main h-100"
    style="min-height: 300px"
  >
    <v-sheet
      width="450"
      class="d-flex flex-column align-center justify-center pa-5 rounded-lg"
      style="position: relative"
    >
      <v-sheet
        data-step="app-logo" 
        width="100"
        height="100"
        class="d-flex align-center justify-center"
        color="#06141B"
        style="border-radius: 50%; position: absolute; top: -50px; z-index: 10"
      >
        <v-img :src="logo"></v-img>
      </v-sheet>
      <!--formulario -->
      <v-form fast-fail @submit.prevent="SignIn" class="w-100 mt-8 pa-8">
        <v-text-field
          :disabled="isLoading"
          clearable
          label="Username"
          v-model="username"
          variant="filled"
          class="font-weight-bold"
          density="compact"
        >
        </v-text-field>
        <v-text-field
          :disabled="isLoading"
          label="Password"
          v-model="password"
          variant="filled"
          class="font-weight-bold"
          density="compact"
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          @click:append-inner="visible = !visible"
        >
        </v-text-field>
        <div class="d-flex justify-space-between">
          <div>
            <input type="checkbox" />
            <label for="rememberMe" class="text-disabled">Remember me</label>
          </div>
          <router-link to="" class="text-decoration-none text-blue-accent-1">
            Forgot password?
          </router-link>
        </div>
        <div class="d-flex flex-column mt-4 w-100 justify-center align-center">
          <v-btn
            data-step="login-button" 
            :loading="isLoading"
            :disabled="isLoading"
            color="#06141b"
            class="w-100 text-white mb-5"
            type="submit"
            >Login</v-btn
          >
          <div class="d-flex">
            <p class="text-disabled"> Don't have an account? </p>
            <router-link
              data-step="signup-link" 
              to="/register"
              class="text-decoration-none font-weight-bold"
              style="color: #06141b"
            >
              Sign Up
            </router-link>
          </div>
        </div>
      </v-form>
    </v-sheet>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";
import logo from '@/assets/logo.png';

const router = useRouter();
const userStore = useUserStore();
const visible = ref(false);
const username = ref("");
const password = ref("");
const isLoading = ref(false);
const snackbar = reactive({ color: "success", message: "", show: false });

const SignIn = async () => {
  try {
    const loginResult = await userStore.login(username.value, password.value);
    console.log("LOGIN_RESULT", loginResult);
    snackbar.color = loginResult.color;
    snackbar.message = loginResult.message;
    snackbar.show = true;
    isLoading.value = true;
    if (!loginResult.isOnError) {
      setTimeout(async () => {
        await router.push("/home");
      }, 1500);
    }
  } catch (error) {
    console.error("Error en login:", error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
};
</script>

<style scoped>
.bg-color-main {
  background-color: #eeeaea;
}
</style>