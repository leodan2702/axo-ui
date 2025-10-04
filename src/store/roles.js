import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchWithHandling } from "../utils/apiHelpers";
import { CRYPTOMESH_URL, CRYPTOMESH_API_VERSION } from "@/config";

export const useRolesStore = defineStore('roles', () => {
    const roles = ref([]);

//--------------Formulario-----------------
    const form = ref({
        name: '',
        description: '',
        permissions:[],
    });

    const loading = ref(false);

    function resetForm() {
        form.value = {
            name: '',
            description: '',
            permissions: [],
        };

    }

    // Obtener todos los roles
    async function get_roles() {
        try {
            const data_json = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/roles/`,
                {},
                "Failed to fetch roles"
            );
            roles.value = data_json;
            return { color: "success" };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        }
    }

    // Crear un rol nuevo
    async function create_role() {
        loading.value = true
        try {
            const createdRole = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/roles/`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form.value)
                },
                "Failed to create role"
            );
            roles.value.push(createdRole); // agregamos el rol al store
            resetForm()
            return { color: "success", data: createdRole };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        } finally {
            loading.value = false
        }
    }

    //Actualizar rol existente
    async function update_role(role_id) {
        loading.value = true
        try {
            const updatedRole = await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/roles/${role_id}/`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(form.value)
                },
                "Failed to update role"
            );

            //Actualizar rol existente
            const index = roles.value.findIndex(r => r.role_id === role_id);
            if (index !== -1) {
                roles.value[index] = updatedRole;
            }
            
            return { color: "success", data: updatedRole };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        } finally {
            loading.value = false
        }
    }

    // Eliminar un rol
    async function delete_role(role_id) {
        try {
            await fetchWithHandling(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/roles/${role_id}/`,
                { method: 'DELETE' },
                "Failed to delete role"
            );

            // Eliminarlo del store local
            roles.value = roles.value.filter(r => r.role_id !== role_id);

            return { color: "success" };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
        }
    }


    return { roles, get_roles, create_role, delete_role, form, loading, resetForm, update_role };
});
