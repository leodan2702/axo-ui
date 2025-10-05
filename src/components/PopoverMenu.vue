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
            
            >  
                <v-list-item-title>{{ userStore.user.fullname }} </v-list-item-title>
                <v-list-item-subtitle>{{ userStore.user.username }}</v-list-item-subtitle>
                 <template v-slot:append>
                    <v-icon icon="mdi-chevron-down" size="x-small"></v-icon>
                </template>
            </v-list-item>       
        <!-- prepend-icon="mdi-chevron-down" -->
        </template>

        <v-card min-width="300" class="menu-card">
            <v-list class="user-header-section">
                <v-list-item
                prepend-avatar= "https://static.vecteezy.com/system/resources/previews/047/733/682/non_2x/grey-avatar-icon-user-avatar-photo-icon-social-media-user-icon-vector.jpg" 
                :subtitle="userStore.user.username"
                :title="userStore.user.fullname"
                class="user-header-item"
                >
                </v-list-item>
            </v-list>
            <v-divider class="menu-divider"></v-divider>

            <v-list
                :lines="false"
                density="compact"
                nav
                class="menu-options"
                >
                <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    :value="item"
                    color="primary"
                    @click="handleItemClick(item)"
                    class="menu-option-item"
                >
                    <template v-slot:prepend>
                    <v-icon :icon="item.icon" class="option-icon"></v-icon>
                    </template>

                    <v-list-item-title v-text="item.text" class="option-text"></v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card>
        </v-menu>

        <!-- Diálogo de confirmación para reiniciar el tour -->
        <v-dialog v-model="confirmDialog" max-width="400">
            <v-card>
                <v-card-title class="headline">
                    <v-icon icon="mdi-restart" class="mr-2"></v-icon>
                    Restart Guided Tour
                </v-card-title>
                <v-card-text>
                    Are you sure you want to restart the guided tour?
                    This will take you to the home page and start the tour from the beginning.
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey" variant="text" @click="confirmDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" variant="flat" @click="confirmRestartTour">
                        Yes, Restart
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
    { text: 'Settings', icon: 'mdi-account-cog', route: '/edit-profile', action: 'default' },
    { text: 'Restart Tour', icon: 'mdi-restart', route: '#', action: 'restart-tour' },
    { text: 'Logout', icon: 'mdi-logout', route: '/', action: 'logout' },
];

const handleItemClick = (item) => {
    switch (item.action) {
        case 'restart-tour':
            confirmDialog.value = true;
            menu.value = false;
            break;
        case 'logout':
            handleLogout();
            break;
        default:
            goTo(item.route);
            break;
    }
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
/* === TARJETA DEL MENÚ - ESTILOS CON DEEP === */
.menu-card {
    border-radius: 16px !important;
    box-shadow: 0 20px 60px #1b1e20 !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    overflow: hidden;
    margin-top: 8px;
}
.menu-card {
    background-color: #1b1e20  !important;
}


.user-header-section {
    padding: 8px 0;
    background: transparent !important;
}

.user-header-item {
    padding: 16px 20px;
    background: transparent !important;
}

.user-header-item :deep(.v-list-item-title) {
    font-weight: 600;
    font-size: 15px;
    color: #878080 !important;
}

.user-header-item :deep(.v-list-item-subtitle) {
    font-size: 13px;
    color: #cbd5e1 !important;
    font-weight: 400;
}

.menu-divider {
    margin: 0;
    background-color: rgba(255, 255, 255, 0.1) !important;
    height: 1px;
}
.menu-options {
    padding: 8px;
    background: transparent !important;
}

.menu-option-item {
    border-radius: 10px !important;
    margin: 2px 4px;
    padding: 0 12px;
    height: 44px;
    transition: all 0.2s ease;
    cursor: pointer;
    background: transparent !important;
}

.menu-option-item:hover {
    background: rgba(160, 204, 225, 0.1) !important;
    transform: translateX(4px);
    border-left: 3px solid #777a7b;
}

.option-icon {
    color: #a4a5a6 !important;
    font-size: 18px;
    margin-right: 12px;
}

.option-text {
    font-size: 14px;
    font-weight: 500;
    color: #a4a5a6 !important;
    letter-spacing: -0.1px;
}

</style>

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
