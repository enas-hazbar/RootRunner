import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '@/views/Dashboard.vue';
import GameCountries from '@/views/GameCountries.vue';
import HackerAcademy from '@/views/HackerAcademy.vue';
import CityView from '@/views/CityView.vue';
const routes = [
      { path: '/', component: Home },
      { path: '/dashboard', component: Dashboard},
      { path: '/GameCountries', component: GameCountries},
      {path: '/text.txt',name: 'text-file',component: () => import('@/views/GameCountries.vue'),},
      { path:'/HackerAcademy', component: HackerAcademy},
      { path: '/HackerAcademy/:pathMatch(.*)*',name: 'HackerAcademyWild',component: () => import('@/views/HackerAcademy.vue')},
      { path: "/CityView", component: CityView },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
  
});

export default router; 

