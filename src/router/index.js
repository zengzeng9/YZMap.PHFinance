import Vue from 'vue'
import VueRouter from 'vue-router'
import Customer from '../views/Customer.vue'
import Visit from '../views/Visit.vue'
import Sign from '../views/Sign.vue'
import Authorization from '../views/Authorization.vue'
import Overdue from '../views/Overdue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/map-visit',
    name: 'map-visit',
    component: Visit
  },
  {
    path: '/map-customer',
    name: 'map-customer',
    component: Customer
  },
  {
    path: '/map-overdue',
    name: 'map-overdue',
    component: Overdue
  },
  {
    path: '/map-sign',
    name: 'map-sign',
    component: Sign
  },
  {
    path: '/map-authorization',
    name: 'map-authorization',
    component: Authorization
  }
]

const router = new VueRouter({
  routes
})

export default router
