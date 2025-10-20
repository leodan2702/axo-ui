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
          prepend-avatar="https://static.vecteezy.com/system/resources/previews/047/733/682/non_2x/grey-avatar-icon-user-avatar-photo-icon-social-media-user-icon-vector.jpg"
        >
          <v-list-item-title>{{ userStore.user.fullname }}</v-list-item-title>
          <v-list-item-subtitle>{{ userStore.user.username }}</v-list-item-subtitle>
          <template v-slot:append>
            <v-icon icon="mdi-chevron-down" size="x-small"></v-icon>
          </template>
        </v-list-item>
      </template>

      <v-card min-width="300" class="menu-card">
        <v-list class="user-header-section">
          <v-list-item
            prepend-avatar="https://static.vecteezy.com/system/resources/previews/047/733/682/non_2x/grey-avatar-icon-user-avatar-photo-icon-social-media-user-icon-vector.jpg"
            :subtitle="userStore.user.username"
            :title="userStore.user.fullname"
            class="user-header-item"
          />
        </v-list>

        <v-divider class="menu-divider" />

        <v-list :lines="false" density="compact" nav class="menu-options">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            color="primary"
            @click="handleItemClick(item)"
            class="menu-option-item"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon" class="option-icon" />
            </template>
            <v-list-item-title v-text="item.text" class="option-text" />
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>

    <!-- Diálogo de confirmación para reiniciar el tour -->
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">
          <v-icon icon="mdi-restart" class="mr-2" />
          Restart Guided Tour
        </v-card-title>
        <v-card-text>
          Are you sure you want to restart the guided tour? This will start the
          tour from the beginning.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const menu = ref(false)
const confirmDialog = ref(false)

const items = [
  { text: 'Settings',      icon: 'mdi-account-cog',          route: '/edit-profile', action: 'default' },
  { text: 'FAQ', icon: 'mdi-frequently-asked-questions',     route: '/faq', action: 'default' },
  { text: 'Help',          icon: 'mdi-help-circle-outline',  route: '/help',         action: 'default' },
  { text: 'Restart Tour',  icon: 'mdi-restart',              route: '#',             action: 'restart-tour' },
  { text: 'Logout',        icon: 'mdi-logout',               route: '/',             action: 'logout' }
]


const handleItemClick = (item) => {
  switch (item.action) {
    case 'restart-tour':
      confirmDialog.value = true
      menu.value = false
      break
    case 'logout':
      handleLogout()
      break
    default:
      goTo(item.route)
      break
  }
}

const handleLogout = () => {
  userStore.logout()
  router.replace({ name: 'Login' })
}

const goTo = (route) => {
  if (route !== '#') router.push(route)
  menu.value = false
}

const clearTourStorage = () => {
  // Limpia exclusivamente la marca de tours completados que usa App.vue
  localStorage.removeItem('axo-completed-tours')

  // Limpieza adicional opcional
  const extraKeys = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i) || ''
    if (k.includes('vuejs-tour') || k.includes('vjt') || k.includes('axo-tour')) {
      extraKeys.push(k)
    }
  }
  extraKeys.forEach(k => localStorage.removeItem(k))
}

const confirmRestartTour = () => {
  clearTourStorage()
  confirmDialog.value = false

  // Dispara un evento global para que App.vue re-monte el componente del tour
  window.dispatchEvent(new Event('tour-restarted'))

  // (Opcional) llevar al Home
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.menu-card {
  border-radius: 16px !important;
  box-shadow: 0 20px 60px #1b1e20 !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  overflow: hidden;
  margin-top: 8px;
  background-color: #1b1e20 !important;
}
.user-header-section { padding: 8px 0; background: transparent !important; }
.user-header-item { padding: 16px 20px; background: transparent !important; }
.user-header-item :deep(.v-list-item-title) { font-weight: 600; font-size: 15px; color: #878080 !important; }
.user-header-item :deep(.v-list-item-subtitle) { font-size: 13px; color: #cbd5e1 !important; font-weight: 400; }

.menu-divider { margin: 0; background-color: rgba(255,255,255,0.1) !important; height: 1px; }
.menu-options { padding: 8px; background: transparent !important; }
.menu-option-item { border-radius: 10px !important; margin: 2px 4px; padding: 0 12px; height: 44px; transition: all .2s ease; cursor: pointer; background: transparent !important; }
.menu-option-item:hover { background: rgba(160,204,225,0.1) !important; transform: translateX(4px); border-left: 3px solid #777a7b; }
.option-icon { color: #a4a5a6 !important; font-size: 18px; margin-right: 12px; }
.option-text { font-size: 14px; font-weight: 500; color: #a4a5a6 !important; letter-spacing: -0.1px; }

/* Dialog styles */
.v-dialog .v-card {
  background: rgba(17, 33, 45, 0.6);
  backdrop-filter: blur(14px) saturate(180%);
  -webkit-backdrop-filter: blur(14px) saturate(180%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 15px 45px rgba(0,0,0,0.5);
  color: #e0f2fe;
}
.v-dialog .v-card-title { font-weight: 700; font-size: 18px; color: #fff; display: flex; align-items: center; }
.v-dialog .v-card-text { font-size: 14px; color: #cbd5e1; line-height: 1.6; }
.v-dialog .v-card-actions { justify-content: flex-end; padding: 1rem; }
.v-dialog .v-btn { margin-left: 8px; border-radius: 10px; font-weight: 600; text-transform: uppercase; transition: all .25s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.v-dialog .v-btn[color="grey"] { background: rgba(255,255,255,0.1); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.2); }
.v-dialog .v-btn[color="grey"]:hover { background: rgba(255,255,255,0.2); color: #fff; }
.v-dialog .v-btn[color="primary"] { background: rgba(14,165,233,0.7); border: 1px solid rgba(14,165,233,0.9); color: #fff; }
.v-dialog .v-btn[color="primary"]:hover { background: rgba(14,165,233,0.9); transform: translateY(-2px) scale(1.05); box-shadow: 0 8px 20px rgba(14,165,233,0.6); }
</style>
