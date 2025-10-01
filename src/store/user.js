import { defineStore } from "pinia";
import { ref } from "vue";

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
            const response = await fetch ('http://localhost:17000/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
            })
            if (response.ok) {
                user.value = await response.json();
                
                return {color:"success",isOnError:false, message:"Login successfully completed."}; 
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
            const response = await fetch('http://localhost:17000/auth/signup', {
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
        user.value = null;
    }
    return { login, register, logout, user }
},
{
    persist: true
})
    

