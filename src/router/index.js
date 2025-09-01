import CreateObject from '@/views/CreateObject.vue'
import CreateRole from '@/views/CreateRole.vue'
import EditObject from '@/views/EditObject.vue'
import EditProfile from '@/views/EditProfile.vue'
import Endpoints from '@/views/endpoints.vue'
import CreateEndpoint from '@/views/CreateEndpoint.vue'
import Functions from '@/views/functions.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import Microservices from '@/views/microservices.vue'
import MyObjects from '@/views/MyObjects.vue'
import RegisterView from '@/views/RegisterView.vue'
import Roles from '@/views/roles.vue'
import SecurityPolicy from '@/views/security_policy.vue'
import CreateSecurityPolicy from '@/views/CreateSecurityPolicy.vue'


import { createRouter, createWebHistory } from 'vue-router'
import DesignGraph from '@/views/DesignGraph.vue'

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView
  },
  {
    path: "/home",
    name: "home",
    component: HomeView
  },
  {
    path: "/my-objects",
    name: "my-objects",
    component: MyObjects
  },
  {
    path: "/create-object",
    name: "create-object",
    component: CreateObject
  },
  {
    path: "/edit-object",
    name: "edit-object",
    component: EditObject
  },
  {
    path: "/edit-profile",
    name: "edit-profile",
    component: EditProfile
  },
  {
  path: '/endpoints',
  name: 'Endpoints',
  component: Endpoints
  },
  {
  path: '/create-endpoint',
  name: 'CreateEndpoint',
  component: CreateEndpoint
  },
  {
  path: '/microservices',
  name: 'Microservices',
  component: Microservices
  },
  {
  path: '/functions',
  name: 'Functions',
  component: Functions
  },

  {
  path: '/roles',
  name: 'Roles',
  component: Roles 
  },
  {
    path: '/create-role',
    name: '/create-role',
    component: CreateRole
  },
  {
    path: '/security_policy',
    name: 'SecurityPolicy',
    component: SecurityPolicy
  },
  {
    path: '/create-security-policy',
    name: 'CreateSecurityPolicy',
    component: CreateSecurityPolicy
  },
  {
    path: '/design',
    name: 'DesignGraph',
    component: DesignGraph
  }
  
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
