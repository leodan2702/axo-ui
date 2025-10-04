import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchWithHandling } from "../utils/apiHelpers";
import { CRYPTOMESH_URL, CRYPTOMESH_API_VERSION } from "@/config";

export const useSecurityPoliciesStore = defineStore('security_policies', () => {
    const policies = ref([]);
    const loading = ref(false);

    // Formulario para crear/editar policy
    const form = ref({
        sp_id: '',
        name: '',
        roles: [],
        requires_authentication: false,
    });

    function resetForm() {
        form.value = {
            sp_id: '',
            name: '',
            roles: [],
            requires_authentication: false,
        };
    }

    // Obtener todas las policies
    async function get_policies() {
        try {
            const data_json = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/security-policies/`,
                {},
                "Failed to fetch security policies"
            );
            policies.value = data_json;
            return { color: "success" };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        }
    }

    // Crear nueva policy
    async function create_policy() {
        loading.value = true;
        try {
            const createdPolicy = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/security-policies/`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form.value)
                },
                "Failed to create policy"
            );
            policies.value.push(createdPolicy);
            resetForm();
            return { color: "success", data: createdPolicy };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        } finally {
            loading.value = false;
        }
    }

    // Actualizar policy existente
    async function update_policy(sp_id) {
        loading.value = true;
        try {
            const updatedPolicy = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/security-policies/${sp_id}/`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form.value)
                },
                "Failed to update policy"
            );

            // Actualizar policy en el store
            const index = policies.value.findIndex(p => p.sp_id === sp_id);
            if (index !== -1) policies.value[index] = updatedPolicy;

            return { color: "success", data: updatedPolicy };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        } finally {
            loading.value = false;
        }
    }

    // Eliminar policy
    async function delete_policy(sp_id) {
        try {
            await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/security-policies/${sp_id}/`,
                { method: 'DELETE' },
                "Failed to delete policy"
            );

            policies.value = policies.value.filter(p => p.sp_id !== sp_id);
            return { color: "success" };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        }
    }

    // Obtener policy por sp_id
    async function get_policy_by_id(sp_id) {
        try {
            const data = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/security-policies/${sp_id}/`,
                {},
                "Failed to fetch security policy by id"
            );
            return { color: "success", data };
        } catch (error) {
            console.error("Error fetching policy:", error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        }
    }

    return { policies, form, loading,resetForm,get_policies, create_policy, update_policy, delete_policy, get_policy_by_id };
});
