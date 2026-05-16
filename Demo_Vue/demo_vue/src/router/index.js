import { createRouter, createWebHistory } from 'vue-router'
import Inicio from '../views/Inicio.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'inicio', component: Inicio },
    { path: '/about', name: 'about', component: () => import('../views/Acerca.vue') }
  ]
})
export default router
