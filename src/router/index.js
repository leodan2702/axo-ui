import CreateObject from '@/views/CreateObject.vue'
import CreateRole from '@/views/CreateRole.vue'
import EditObject from '@/views/EditObject.vue'
import EditProfile from '@/views/EditProfile.vue'
import Endpoints from '@/views/MyEndpoints.vue'
import CreateEndpoint from '@/views/CreateEndpoint.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import Microservices from '@/views/MyMicroservices.vue'
import MyObjects from '@/views/MyObjects.vue'
import RegisterView from '@/views/RegisterView.vue'
import Roles from '@/views/MyRoles.vue'
import SecurityPolicy from '@/views/MySecurityPolicy.vue'
import CreateSecurityPolicy from '@/views/CreateSecurityPolicy.vue'
import Services from '@/views/MyServices.vue'

import { createRouter, createWebHistory } from 'vue-router'
import DesignGraph from '@/views/DesignGraph.vue'
import CreateService from '@/views/CreateService.vue'
import CreateMicroservice from '@/views/CreateMicroservice.vue'


const routes = [
  { path: '/', redirect: '/login' },

  { path: '/login', name: 'Login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', name: 'Register', component: RegisterView, meta: { guestOnly: true } },

  { path: '/home', name: 'Home', component: HomeView, meta: { requiresAuth: true } },

  { path: '/my-objects', name: 'MyObjects', component: MyObjects, meta: { requiresAuth: true } },
  { path: '/create-object', name: 'CreateObject', component: CreateObject, meta: { requiresAuth: true } },
  { path: '/edit-object', name: 'EditObject', component: EditObject, meta: { requiresAuth: true } },
  { path: '/edit-profile', name: 'EditProfile', component: EditProfile, meta: { requiresAuth: true } },

  { path: '/endpoints', name: 'Endpoints', component: Endpoints, meta: { requiresAuth: true } },
  { path: '/create-endpoint', name: 'CreateEndpoint', component: CreateEndpoint, meta: { requiresAuth: true } },

  { path: '/services', name: 'Services', component: Services, meta: { requiresAuth: true } },
  { path: '/create-service', name: 'CreateService', component: CreateService, meta: { requiresAuth: true } },

  { path: '/microservices', name: 'Microservices', component: Microservices, meta: { requiresAuth: true } },
  { path: '/create-microservice', name: 'CreateMicroservice', component: CreateMicroservice, meta: { requiresAuth: true } },

  { path: '/roles', name: 'Roles', component: Roles, meta: { requiresAuth: true } },
  { path: '/create-role', name: 'CreateRole', component: CreateRole, meta: { requiresAuth: true } },

  { path: '/security_policy', name: 'SecurityPolicy', component: SecurityPolicy, meta: { requiresAuth: true } },
  { path: '/create-security-policy', name: 'CreateSecurityPolicy', component: CreateSecurityPolicy, meta: { requiresAuth: true } },

  { path: '/design', name: 'DesignGraph', component: DesignGraph, meta: { requiresAuth: true } },

  // Fallback para rutas inexistentes
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]


const router = createRouter({
  history: createWebHistory('/axo/'),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')

  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' })
  }

  if (to.meta.guestOnly && token) {
    return next({ name: 'Home' })
  }

  next()
})

export default router
