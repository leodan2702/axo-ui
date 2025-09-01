import { defineStore } from "pinia";
import { ref } from "vue";

const CRYPTOMESH_URL = `http://localhost:19000`;
const CRYPTOMESH_API_VERSION = `v1`;

export const useRolesStore = defineStore('roles', () => {
    const roles = ref([]);

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
    async function create_role(newRole) {
        try {
            const response = await fetch(`${CRYPTOMESH_URL}/api/${CRYPTOMESH_API_VERSION}/roles/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRole)
            });
            if (!response.ok) throw new Error('Failed to create role');
            const createdRole = await response.json();
            roles.value.push(createdRole); // agregamos el rol al store
            return { color: "success", data: createdRole };
        } catch (error) {
            console.error('Error', error);
            const message = error?.message ?? "Unknown error, please contact support@axo.mx";
            return { color: "error", message };
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


    return { roles, get_roles, create_role, delete_role };
});
