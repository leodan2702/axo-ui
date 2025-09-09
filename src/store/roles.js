import { defineStore } from "pinia";
import { ref } from "vue";

const CRYPTOMESH_URL = `http://localhost:19000`;
const CRYPTOMESH_API_VERSION = `v1`;

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
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/roles/`);
            const data_json = await response.json();
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
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/roles/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form.value)
            });
            if (!response.ok) throw new Error('Failed to create role');
            const createdRole = await response.json();
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
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/roles/${role_id}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form.value)
            });
            if (!response.ok) throw new Error('Failed to update role');
            const updatedRole = await response.json();

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
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/roles/${role_id}/`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete role');

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
