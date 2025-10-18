<template>
  <VTour
    ref="tourRef"
    :key="tourKey"
    :name="tourName"
    :steps="currentSteps"
    :autoStart="shouldAutoStart"
    :startDelay="400"
    saveToLocalStorage="never"
    highlight
    noScroll
    :options="tourOptions"
  >
    <template #actions="{ lastStep, nextStep, endTour, _CurrentStep, getNextLabel, props }">
      <div class="vjt-actions">
        <button
          v-if="_CurrentStep.lastStep < _CurrentStep.currentStep"
          type="button"
          @click.prevent="lastStep()"
          v-text="props.buttonLabels?.back || 'Back'"
        />
        <button
          v-if="!props.hideSkip"
          type="button"
          @click.prevent="() => { markTourAsCompleted(); endTour(); }"
          v-text="props.buttonLabels?.skip || 'Skip'"
        />
        <button
          type="button"
          @click.prevent="() => {
            const isLast = _CurrentStep.currentStep === currentSteps.length - 1;
            if (isLast) { markTourAsCompleted(); }
            nextStep();
          }"
          v-text="getNextLabel"
        />
      </div>
    </template>
  </VTour>

  <v-app>
    <template v-if="!isAuthRoute">
      <v-app-bar app fixed color="#040404" class="text-white" style="z-index: 1;">
        <div class="d-flex justify-start">
          <v-img
            data-step="app-logo"
            @click="router.push({ name: 'Home' })"
            :width="45"
            :src="logo"
            class="ml-5 clickable"
          />
        </div>
        <template v-if="$vuetify.display.smAndDown">
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
        </template>
        <v-spacer />
        <div class="d-flex">
          <popoverMenu data-step="user-profile-menu" />
        </div>
      </v-app-bar>

      <v-navigation-drawer
        data-step="sidebar-navigation"
        v-model="drawer"
        app
        :expand-on-hover="!$vuetify.display.smAndDown"
        :rail="!$vuetify.display.smAndDown"
        color="#1b1e20"
        :location="$vuetify.display.mobile ? 'left' : undefined"
      >
        <v-divider />
        <v-list density="compact" nav class="text-white">
          <v-list-item data-step="home-menu-item" link prepend-icon="mdi-home" title="Home" value="home" @click="router.push({ name: 'Home' })" />
          <v-list-item data-step="objects-menu-item" link prepend-icon="mdi-checkbox-multiple-blank-circle" title="Objects" value="myObjects" @click="router.push('/my-objects')" />
          <v-list-item data-step="endpoints-menu-item" link prepend-icon="mdi-server" title="Endpoints" value="myEndpoints" @click="router.push('/endpoints')" />
          <v-list-item data-step="services-menu-item" link prepend-icon="mdi-cube-outline" title="Services" value="myServices" @click="router.push('/services')" />
          <v-list-item data-step="microservices-menu-item" link prepend-icon="mdi-view-grid" title="Microservices" value="myMicroservices" @click="router.push('/microservices')" />
          <v-list-item data-step="roles-menu-item" link prepend-icon="mdi-account-group" title="Roles" value="Roles" @click="router.push('/roles')" />
          <v-list-item data-step="security-policies-menu-item" link prepend-icon="mdi-shield-key" title="Security Policies" value="SecurityPolicy" @click="router.push('/security_policy')" />
          <v-spacer />
          <v-list-item data-step="design-menu-item" prepend-icon="mdi-graph" title="Design" value="design" @click="router.push('/design')" />
          <v-spacer />
          <v-list-item prepend-icon="mdi-logout" title="Log Out" @click=handleLogout() />
        </v-list>
      </v-navigation-drawer>
    </template>

    <v-main>
      <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route.fullPath" data-step="empezemos" />
      </RouterView>
    </v-main>

    <v-footer app v-if="!isAuthRoute" style="z-index: 1;">
      <span class="text-grey"> </span>
    </v-footer>
  </v-app>
</template>

<script setup>
import PopoverMenu from '@/components/PopoverMenu.vue'
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import logo from '@/assets/logo.png'
import { VTour } from '@globalhive/vuejs-tour'
import '@globalhive/vuejs-tour/dist/style.css'
import { useUserStore } from '@/store/user'

const drawer = ref(true)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const tourRef = ref(null)
const tourKey = ref(0)
const currentSteps = ref([])
const shouldAutoStart = ref(false)

const tourOptions = ref({
  useKeyboard: true,
  enabledButtons: { skip: true, previous: true, next: true, stop: false, done: true }
})

const isAuthRoute = computed(() => route.meta?.guestOnly === true || route.path === '/login')

const getCurrentRouteName = () => {
  if (route.name) return String(route.name)
  if (route.path === '/login') return 'login'
  if (route.path === '/register') return 'register'
  return 'Home'
}
const tourName = computed(() => `axo-tour-${getCurrentRouteName()}`)

const isTourCompleted = () => {
  const completed = JSON.parse(localStorage.getItem('axo-completed-tours') || '{}')
  return completed[tourName.value] === true
}
const markTourAsCompleted = () => {
  const completed = JSON.parse(localStorage.getItem('axo-completed-tours') || '{}')
  completed[tourName.value] = true
  localStorage.setItem('axo-completed-tours', JSON.stringify(completed))
}

const handleLogout = () => {
  userStore.logout()
  router.replace({ name: 'Login' })
}


const handleRestartTour = async () => {
  const completed = JSON.parse(localStorage.getItem('axo-completed-tours') || '{}')
  delete completed[tourName.value]
  localStorage.setItem('axo-completed-tours', JSON.stringify(completed))

  shouldAutoStart.value = false
  currentSteps.value = []

  tourKey.value++            // remonta VTour
  await nextTick()
  await updateTourSteps(true) // force = true
  setTimeout(() => tourRef.value?.start(), 200)
}

onMounted(() => {
  window.addEventListener('tour-restarted', handleRestartTour)
  updateTourSteps()
})
onUnmounted(() => {
  window.removeEventListener('tour-restarted', handleRestartTour)
})

const steps = {
  login: [
    { target: '[data-step="app-logo"]',     content: 'Welcome to Axo. Here you will find the application logo.', params: { placement: 'bottom' } },
    { target: '[data-step="signup-link"]',  content: "Don't have an account yet? Click here to sign up.",        params: { placement: 'top' } }
  ],
  register: [
    { target: '[data-step="register-button"]', content: 'Fill out this form to create your account.', params: { placement: 'top' } },
    { target: '[data-step="login-button"]',    content: 'Already a user? Log in here.',                params: { placement: 'top' } }
  ],
  home: [
    { target: '[data-step="main-dashboard"]',         content: 'This is your main dashboard, with a summary of all modules.', placement: 'bottom' },
    { target: '[data-step="user-profile-menu"]',      content: 'Access your profile to update your data or log out.',          placement: 'bottom' },
    { target: '[data-step="sidebar-navigation"]',     content: 'Navigate between modules using the sidebar.' },
    { target: '[data-step="roles-menu-item"]',        content: 'Start by creating a role to organize permissions.' },
    { target: '[data-step="security-policies-menu-item"]', content: 'Then define a security policy.' },
    { target: '[data-step="services-menu-item"]',     content: 'Next, register a new service.' },
    { target: '[data-step="microservices-menu-item"]',content: 'Here you can manage your microservices.' },
    { target: '[data-step="endpoints-menu-item"]',    content: 'Define the endpoints that will connect your services.' },
    { target: '[data-step="objects-menu-item"]',      content: 'Once configured, create your active objects.' },
    { target: '[data-step="design-menu-item"]',       content: 'Finally, design the choreography of your objects.' },
    { target: '[data-step="roles-menu-item"]',        content: "All set! Let's start by creating your first role." }
  ],
  Roles: [
    { target: '[data-step="create-role-button"]',       content: 'Click here to create a new role.', placement: 'bottom' },
    { target: '[data-step="roles-management-section"]', content: 'Manage, edit, or delete existing roles.', placement: 'bottom' },
    { target: '[data-step="search-roles"]',             content: 'Use this field to search registered roles.', placement: 'bottom' }
  ],
  SecurityPolicy: [
    { target: '[data-step="create-policy-button"]',     content: 'Create a new security policy.', placement: 'bottom' },
    { target: '[data-step="policies-management-section"]', content: 'Here you can edit or delete created policies.', placement: 'bottom' },
    { target: '[data-step="search-politicas"]',         content: 'Search for registered policies here.', placement: 'bottom' }
  ],
  Services: [
    { target: '[data-step="create-service-button"]',    content: 'Register a new service.', placement: 'bottom' },
    { target: '[data-step="services-management-section"]', content: 'Manage, edit, or delete your services.', placement: 'bottom' },
    { target: '[data-step="search-service"]',           content: 'Search registered services.', placement: 'bottom' }
  ],
  Microservices: [
    { target: '[data-step="create-microservice-button"]', content: 'Register a new microservice.', placement: 'bottom' },
    { target: '[data-step="microservices-management-section"]', content: 'Manage, edit, or delete your microservices.', placement: 'bottom' },
    { target: '[data-step="search-microservice-button"]', content: 'Search registered microservices.', placement: 'bottom' }
  ],
  Endpoints: [
    { target: '[data-step="new-endpoint-button"]',      content: 'Register a new endpoint.', placement: 'bottom' },
    { target: '[data-step="endpoints-management-section"]', content: 'Manage, edit, or delete your endpoints.', placement: 'bottom' },
    { target: '[data-step="search-endpoint"]',          content: 'Search registered endpoints.', placement: 'bottom' }
  ],
  MyObjects: [
    { target: '[data-step="new-active-object-button"]', content: 'Register a new active object.', placement: 'bottom' },
    { target: '[data-step="objects-management-section"]', content: 'Manage, edit, or delete your active objects.', placement: 'bottom' },
    { target: '[data-step="search-active-object"]',     content: 'Search registered active objects.', placement: 'bottom' }
  ],
  DesignGraph: [
    { target: '[data-step="registered-objects-panel"]', content: 'In this panel you will see the active objects you have registered...' },
    { target: '[data-step="create-bucket-button"]',     content: 'Create a bucket to store data...', placement: 'bottom' },
    { target: '[data-step="edit-selection-button"]',    content: 'Click here to edit the selected component.', placement: 'bottom' },
    { target: '[data-step="clean-canvas-button"]',      content: 'If you want to start over, clear the entire canvas.', placement: 'bottom' },
    { target: '[data-step="remove-selection-button"]',  content: 'Remove only the selected component.', placement: 'bottom' },
    { target: '[data-step="run-coreography-button"]',   content: 'When everything is ready, run the choreography...', placement: 'bottom' }
  ]
}

const updateTourSteps = async (force = false) => {
  const routeName = getCurrentRouteName()

  if (!force && isTourCompleted()) {
    currentSteps.value = []
    shouldAutoStart.value = false
    return
  }

  const k = String(routeName || '').trim()
  currentSteps.value = steps[k] || steps[k.toLowerCase()] || []

  tourKey.value++ // fuerza remount del VTour
  await nextTick()

  if (currentSteps.value.length > 0) {
    setTimeout(() => {
      shouldAutoStart.value = true
      tourRef.value?.start()
      console.log(`Tour iniciado para ${k}`)
    }, 400)
  }
}

watch(() => route.fullPath, () => {
  updateTourSteps()
})
</script>

<style>
.clickable { cursor: pointer; }
#vjt-tooltip {
  background: rgba(17,33,45,.6);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
  color: #e0f2fe;
  font-size: 15px;
  font-weight: 500;
  max-width: 360px;
  line-height: 1.5;
  border: 1px solid rgba(255,255,255,.2);
  box-shadow: 0 12px 40px rgba(0,0,0,.35);
}
#vjt-arrow::before {
  background: rgba(17,33,45,.11);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255,255,255,.2);
  width: 14px; height: 14px;
  transform: rotate(45deg);
  border-radius: 2px;
  box-shadow: 0 4px 10px rgba(0,0,0,.25);
}
.vjt-highlight {
  outline: 3px solid rgba(14,165,233,.9);
  outline-offset: 8px;
  border-radius: 10px;
  box-shadow: 0 0 25px rgba(14,165,233,.8), 0 0 50px rgba(14,165,233,.4);
}
#vjt-backdrop { background: rgba(0,8,15,.75); backdrop-filter: blur(6px); }
.vjt-actions { display: flex; gap: 8px; }
.vjt-actions button {
  flex: 1; margin: 0; padding: .6rem 1.2rem; border-radius: 10px;
  border: 1px solid rgba(255,255,255,.25); background: rgba(255,255,255,.1);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  color: #e0f2fe; font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all .25s ease; text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0,0,0,.3);
}
.vjt-actions button:hover {
  background: rgba(14,165,233,.3); border: 1px solid rgba(14,165,233,.6);
  color: #fff; transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 20px rgba(14,165,233,.5);
}
#vjt-tooltip::before {
  content: "Tour Guide";
  position: absolute; top: -8px; right: 12px;
  background: rgba(14,165,233,.8); color: #fff;
  font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px;
}
</style>
