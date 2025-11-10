<template>
  <header class="navbar">
    <!-- Logo -->
    <div class="logo">
      <img src="/logo.gif" alt="RootRunner Logo" />
      <h2>ROOTRUNNER<br />TECHNOLOGY</h2>
    </div>

    <!-- User Icon -->
    <div class="user-icon" @click="toggleMenu">
      <i class="fa-solid fa-circle-user"></i>
      <div v-if="menuOpen" class="user-menu">
        <p v-if="username">Welcome, <strong>{{ username }}</strong></p>
        <button v-if="username" class="logout-btn" @click="logout">Logout</button>
        <button v-else class="login-btn" @click="openLogin">Login</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const username = ref(localStorage.getItem('loggedInUser'))
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function logout() {
  localStorage.removeItem('loggedInUser')
  window.location.href = '/'
}

function openLogin() {
  const homeEvent = new CustomEvent('open-login')
  window.dispatchEvent(homeEvent)
  window.location.href = '/'
}

onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-icon')) menuOpen.value = false
  })
})
</script>

<style scoped>



</style>
