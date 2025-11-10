// // src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
// import Login from '../views/Login.vue';
// import LevelSelect from '../views/LevelSelect.vue';
// import Level1 from '../views/Level1.vue';
// import Level2 from '../views/Level2.vue';
// import Level3 from '../views/Level3.vue';
import Home from '../views/Home.vue';




const routes = [
      { path: '/', component: Home },


//   { path: '/', redirect: '/login' },
//   { path: '/login', component: Login },
//   { path: '/levels', component: LevelSelect },
//   { path: '/level-1', component: Level1 },
//   { path: '/level-2', component: Level2 },
//   { path: '/level-3', component: Level3 }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  
});

export default router; // 👈 this line is the fix



