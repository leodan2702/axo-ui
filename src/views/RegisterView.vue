<template>
    <v-main class="d-flex align-center justify-center bg-color-main h-100" style="min-height: 300px; padding-top: 100px;">
        <v-sheet 
        width="450" 
        class="d-flex flex-column align-center justify-center pa-5 rounded-lg" style="position: relative;">
            <v-sheet
                width="100"
                height="100"
                class="d-flex align-center justify-center"
                color="#06141B"
                style="border-radius: 50%; position: absolute; top: -50px; z-index: 10;"
            >
            <v-img :src="logo"></v-img>
            </v-sheet>
            <!--formulario del registro de usuarios-->
            <v-form fast-fail @submit.prevent="SignUp" class="w-100 mt-8 pa-3">
                <v-text-field clearable
                    label="First Name" 
                    v-model="first_name"
                    :rules="rules.firstNameRules"
                    required
                    variant="filled"
                    class="font-weight-bold"
                    density="compact"            
                >
                </v-text-field>
                <v-text-field clearable
                    label="Last Name" 
                    v-model="last_name"
                    :rules="rules.lastNameRules"
                    required
                    variant="filled"
                    class="font-weight-bold"
                    density="compact"            
                >
                </v-text-field>
                <v-text-field clearable
                    label="Username" 
                    v-model="username"
                    :rules="rules.usernameRules"
                    required
                    variant="filled"
                    class="font-weight-bold"
                    density="compact"             
                >
                </v-text-field>
                <v-text-field clearable
                    label="Email" 
                    v-model="email"
                    :rules="rules.emailRules"
                    required
                    variant="filled"
                    class="font-weight-bold"
                    density="compact"             
                >
                </v-text-field>
                <v-text-field
                    label="Password"
                    v-model="password"
                    :rules="rules.passwordRules"
                    required
                    variant="filled"           
                    class="font-weight-bold" 
                    density="compact"
                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visible ? 'text' : 'password'"                    
                    @click:append-inner="visible = !visible"
                >
                </v-text-field>
                <v-text-field
                    label="Confirm password"
                    v-model="confirm_password"
                    :rules="rules.confirmPassRules"
                    required
                    variant="filled"           
                    class="font-weight-bold" 
                    density="compact"
                    :append-inner-icon="visibleConfirmPass ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="visibleConfirmPass ? 'text' : 'password'"                    
                    @click:append-inner="visibleConfirmPass = !visibleConfirmPass"
                >
                </v-text-field>           
                <div class="d-flex flex-column mt-4 w-100 justify-center align-center">
                    <v-btn
                    data-step="register-button"
                    :loading="isLoading"
                    :disabled="isLoading"
                    color="#06141B"
                    class="w-100 text-white mb-5" 
                    type="submit" >Sign Up</v-btn>
                    <div>
                        <v-text class="text-disabled">Already on Axo?</v-text>
                        <router-link data-step="login-button" to="/" class="text-decoration-none font-weight-bold"
                        style="color: #06141B"
                        >
                        Login
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
    import { reactive,ref } from 'vue';
    import { useUserStore } from '@/store/user';
    import { useRouter } from 'vue-router';
    import logo from '@/assets/logo.png';

    const router = useRouter();
    const userStore = useUserStore();
    const visible = ref(false)
    const visibleConfirmPass = ref(false)
    const first_name = ref('')
    const last_name = ref('')
    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirm_password = ref('')
    const isLoading = ref(false);
    const snackbar = reactive({ color: "success", message: "", show: false });

    const rules = {
        firstNameRules: [
            value => !!value || 'You must enter a first name'
        ],
        lastNameRules: [
            value => !!value || 'You must enter a last name'
        ],
        usernameRules: [
            value => !!value || 'You must enter an username'
        ],
        emailRules: [
            value => !!value || 'You must enter an email'
        ],
        passwordRules: [
            value => !!value || 'You must enter a password'
        ],
        confirmPassRules: [
            value => !!value || 'This field is required',
            value => value === password.value || 'Passwords do not match'
        ],

    }
    const SignUp = async () => {
        try{
            isLoading.value = true;
                const SignUpResult = await userStore.register(first_name.value,last_name.value, username.value, email.value, password.value);
                console.log("SIGNUP_RESULT", SignUpResult);
                snackbar.color = SignUpResult.color;
                snackbar.message = SignUpResult.message;
                snackbar.show = true;
                
                if (!SignUpResult.isOnError) {
                    setTimeout(async () => {await router.push("/");
                    }, 1500);
                }
            } catch(error) {
                console.error('Error al registrarse:', error);
            } finally {
                setTimeout(() => {
                    isLoading.value = false;
                }, 500);
            }           
    }

</script>

<style scoped>
.bg-color-main{
  background-color: #EEEAEA;
}
</style>

