import { defineStore } from "pinia";
import { ref } from "vue";

const CRYPTOMESH_URL = `http://localhost:19000`
const CRYPTOMESH_API_VERSION = `v1`

export const useEndpointsStore = defineStore('endpoints', ()=>{
    const endpoints = ref([])

    async function get_endpoints(){
        try {
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/`)
            // console.log("GET.ENDPOINTS.RESPONSE", response)
            const data_json = await response.json()
            // console.log("DATA",data_json)
            endpoints.value = data_json
            return {color:"success"}
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact us on support@axo.mx"

            return {color:"error", message}
        }

    }


    async function create_endpoint(newEndpoint) {
        try {
            console.log("CREATE.ENDPOINT.PAYLOAD", newEndpoint);
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEndpoint)
            });
            console.log("CREATE.ENDPOINT.RESPONSE", response);

            if (!response.ok) throw new Error('Failed to create endpoint');
            const createdEndpoint = await response.json();
            endpoints.value.push(createdEndpoint); // agregamos el rol al store
            return { color: "success", data: createdEndpoint };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        }
        
    }

    async function delete_endpoint(endpoint_id) {
        try {
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/endpoints/${endpoint_id}/`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete endpoint');

            // Eliminarlo del store local
            endpoints.value = endpoints.value.filter(e => e.endpoint_id !== endpoint_id);

            return { color: "success" };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        }
    }

    return {get_endpoints, create_endpoint, delete_endpoint, endpoints}
})