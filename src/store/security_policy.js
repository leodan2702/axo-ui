import { defineStore } from "pinia";
import { ref } from "vue";

const CRYPTOMESH_URL = `http://localhost:19000`;
const CRYPTOMESH_API_VERSION = `v1`;

export const useSecurityPoliciesStore = defineStore('security_policies', () => {
    const policies = ref([]);

    // Crear una nueva policy
    async function create_policy(newPolicy) {
        try {
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/security-policies/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPolicy)
            });
            if (!response.ok) throw new Error('Failed to create policy');
            const createdPolicy = await response.json();
            policies.value.push(createdPolicy);
            return { color: "success", data: createdPolicy };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        }
    }

    // Obtener todas las policies
    async function get_policies() {
        try {
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/security-policies/`);
            if (!response.ok) throw new Error("Failed to fetch security policies");
            const data_json = await response.json();
            policies.value = data_json;
            return { color: "success" };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        }
    }


    // Eliminar una policy
    async function delete_policy(sp_id) {
        try {
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/security-policies/${sp_id}/`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete policy');

            // Eliminarla del store local
            policies.value = policies.value.filter(p => p.sp_id !== sp_id);

            return { color: "success" };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        }
    }

    // Obtener una policy por sp_id
    async function get_policy_by_id(sp_id) {
        try {
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/security-policies/${sp_id}/`);
            if (!response.ok) throw new Error("Failed to fetch security policy by id");
            return await response.json();
        } catch (error) {
            console.error("Error fetching policy:", error);
            return null;
        }
    }



    return { policies, get_policies, create_policy, delete_policy, get_policy_by_id };
});

