import { defineStore } from "pinia";
import { ref } from "vue";
import { AXO_BACKEND_URL } from "@/config";

export const useUserStore = defineStore('users',() => {
    const user = ref({})

    //funcion login
    async function login (username, password){
        try{
            if (!username || !password) {
                return {
                    color: "error",
                    isOnError: true,
                    message: "All fields are required.",
                };
            }  
            const body = {
                username: username,
                password: password,
                status:0
            }
            console.log("BODY", body)
            const response = await fetch (`${AXO_BACKEND_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            })
            if (response.ok) {
                const data = await response.json();

            const token =
                    data?.token ??
                    data?.access_token ??
                    data?.credentials?.token ??
                    data?.user?.token ??
                    null;
            
                
                    user.value = data?.user ?? data;
            
                
                    if (token) localStorage.setItem('auth_token', token);
            
            return { color:"success", isOnError:false, message:"Login successfully completed.", token };
            } else {
                const message = (await response.json())?.detail ?? "Uknown error."
                // await (response.json().then(x=>x["detail"]) )
                return {color:"error",isOnError:true, message  }  ; 
            }
        } catch (error){
            console.error('Error', error);
            const message = error?.message ?? "Uknown error, please contact us on support@axo.mx"

            return {color:"error",isOnError:true, message:message}; 
        }
    }

    //funcion register
    async function register(first_name, last_name, username, email, password ) {
        try {
            if (!first_name || !last_name || !username || !email || !password) {
                return {
                    color: "error",
                    isOnError: true,
                    message: "All fields are required.",
                };
            }               
            const body  = {
                    user: {
                        profile:"",
                        first_name: first_name,
                        last_name: last_name,
                        username: username,
                        email: email,
                        disabled: false
                    },
                    credentials: {
                        password: password,
                        pin:"",
                        token:""
                    }
            }
            console.log("BODY",body)
            const response = await fetch(`${AXO_BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (response.ok) {
                return {color:"success",isOnError:false, message:"Register successfully completed. Please Login."}; 
            } else {
                const message = (await response.json())?.detail ?? "Uknown error."
                return {color:"error",isOnError:true, message  }  ; 
            }
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Uknown error, please contact us on support@axo.mx"

            return {color:"error",isOnError:true, message:message}; 
        }
    }

    //funcion logout
    function logout () {
        user.value = {};
        // limpia el token para que el guard bloquee rutas protegidas
        localStorage.removeItem('auth_token');
    }
    return { login, register, logout, user }
},
{
    persist: true
})
    

