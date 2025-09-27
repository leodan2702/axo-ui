<template>
    <div>
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            location="bottom"
        >
        <template v-slot:activator="{ props }">
            <v-list-item   
            v-bind="props"
            prepend-avatar= "https://static.vecteezy.com/system/resources/previews/047/733/682/non_2x/grey-avatar-icon-user-avatar-photo-icon-social-media-user-icon-vector.jpg" 
            prepend-icon="mdi-chevron-down"
            >  
            </v-list-item>
        </template>

        <v-card min-width="300">
            <v-list>
                <v-list-item
                prepend-avatar= "https://static.vecteezy.com/system/resources/previews/047/733/682/non_2x/grey-avatar-icon-user-avatar-photo-icon-social-media-user-icon-vector.jpg" 
                :subtitle="userStore.user.username"
                :title="userStore.user.fullname"
                >
                </v-list-item>
            </v-list>
            <v-divider></v-divider>

            <v-list
                :lines="false"
                density="compact"
                nav
                >
                <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    :value="item"
                    color="primary"
                    @click="handleItemClick(item)"
                >
                    <template v-slot:prepend>
                    <v-icon :icon="item.icon"></v-icon>
                    </template>

                    <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
        </v-menu>

        <!-- Diálogo de confirmación para reiniciar el tour -->
        <v-dialog v-model="confirmDialog" max-width="400">
            <v-card>
                <v-card-title class="headline">
                    <v-icon icon="mdi-restart" class="mr-2"></v-icon>
                    Reiniciar Tour Guiado
                </v-card-title>
                <v-card-text>
                    ¿Estás seguro de que quieres reiniciar el tour guiado? 
                    Esto te llevará a la página de inicio y comenzará el tour desde el principio.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="confirmDialog = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="primary" variant="flat" @click="confirmRestartTour">
                        Sí, Reiniciar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { useUserStore } from "@/store/user";
import { ref } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore(); 
const menu = ref(false);
const confirmDialog = ref(false);

const items = [
    { text: 'Notifications', icon: 'mdi-bell', route: '#', action: 'default' },
    { text: 'Settings', icon: 'mdi-cogs', route: '/edit-profile', action: 'default' },
    { text: 'Restart Tour', icon: 'mdi-restart', route: '#', action: 'restart-tour' },
    { text: 'Logout', icon: 'mdi-logout', route: '/', action: 'logout' },
];

const handleItemClick = (item) => {
    switch (item.action) {
        case 'restart-tour':
            confirmDialog.value = true;
            menu.value = false; // Cerrar el menú
            break;
        case 'help':
            showHelp();
            break;
        case 'logout':
            handleLogout();
            break;
        default:
            goTo(item.route);
            break;
    }
};

const showHelp = () => {
    // Aquí puedes implementar la lógica para mostrar ayuda
    // Por ejemplo, abrir un diálogo de ayuda o redirigir a una página de ayuda
    alert('Funcionalidad de ayuda - Próximamente');
    menu.value = false;
};

const handleLogout = () => {
    // Lógica de logout si es necesaria antes de redirigir
    userStore.logout(); // Si tu store tiene método logout
    router.push('/');
};

const goTo = (route) => {
    if (route !== '#') {
        router.push(route);
    }
    menu.value = false;
};

const deleteLocalStorage = () => {
    // Eliminar todas las claves relacionadas con el tour del localStorage
    const keysToRemove = [];
    
    // Recorrer todo el localStorage para encontrar claves relacionadas con el tour
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
            key.includes('tour') || 
            key.includes('vjt') || 
            key.includes('vuejs-tour') ||
            key.toLowerCase().includes('guided') ||
            key.includes('axo-tour')
        )) {
            keysToRemove.push(key);
        }
    }
    
    // Eliminar las claves encontradas
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`Eliminado del localStorage: ${key}`);
    });
    
    // También eliminar claves específicas por si acaso
    const specificKeys = [
        'vuejs-tour:current-step',
        'vuejs-tour:current-tour',
        'vjt-tour-data',
        'axo-tour-completed',
        'tour-started'
    ];
    
    specificKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            console.log(`Eliminado clave específica: ${key}`);
        }
    });
    
    console.log('Tour reiniciado exitosamente');
};

const confirmRestartTour = () => {
  // 1. Eliminar localStorage del tour
  deleteLocalStorage();

  // 2. Cerrar el diálogo
  confirmDialog.value = false;

  // 3. Redirigir a home
  router.push('/home').then(() => {
    // 4. Forzar reinicio del tour manualmente
    setTimeout(() => {
      window.dispatchEvent(new Event('tour-restarted'));
      console.log('Tour reiniciado. Redirigiendo a home...');
    }, 400);
  });
};


</script>
<style scoped>
/* --- Estilo Glassmorphism para la ventana de reinicio --- */
.v-dialog .v-card {
  background: rgba(17, 33, 45, 0.6); /* similar al tooltip del tour */
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.5);
  color: #e0f2fe;
}

.v-dialog .v-card-title {
  font-weight: 700;
  font-size: 18px;
  color: #ffffff;
  display: flex;
  align-items: center;
}

.v-dialog .v-card-text {
  font-size: 14px;
  color: #cbd5e1;
  line-height: 1.6;
}

/* Botones estilo tour */
.v-dialog .v-card-actions {
  justify-content: flex-end;
  padding: 1rem;
}

.v-dialog .v-btn {
  margin-left: 8px;
  border-radius: 10px;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Botón cancelar */
.v-dialog .v-btn[color="grey"] {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.v-dialog .v-btn[color="grey"]:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

/* Botón confirmar */
.v-dialog .v-btn[color="primary"] {
  background: rgba(14, 165, 233, 0.7);
  border: 1px solid rgba(14, 165, 233, 0.9);
  color: #fff;
}
.v-dialog .v-btn[color="primary"]:hover {
  background: rgba(14, 165, 233, 0.9);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.6);
}
</style>
