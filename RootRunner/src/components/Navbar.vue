<template>
  <header class="navbar">
    <div class="logo" @click="scrollToSection('home')">
      <img src="/logo.gif" alt="RootRunner Logo" />
      <h2>ROOTRUNNER<br />TECHNOLOGY</h2>
    </div>

    <nav class="nav-links">
      <a href="#home" @click.prevent="scrollToSection('home')" :class="{ active: activeSection === 'home' }">Home</a>
      <a href="#about" @click.prevent="scrollToSection('about')" :class="{ active: activeSection === 'about' }">About</a>
      <a href="#rules" @click.prevent="scrollToSection('rules')" :class="{ active: activeSection === 'rules' }">Rules</a>
      <a href="#contact" @click.prevent="scrollToSection('contact')" :class="{ active: activeSection === 'contact' }">Contact</a>
    </nav>

    <!-- ✅ USER ICON + MENU -->
    <div class="user-icon" @click="toggleUserMenu">
      <i class="fa-solid fa-circle-user"></i>

      <div v-if="showMenu" class="user-menu" @click.stop>
        <template v-if="loggedInUser">
          <p>👋 Welcome, <strong>{{ loggedInUser }}</strong></p>
          <button @click="goToDashboard">Go to Dashboard</button>
          <button class="logout-btn" @click="logout">Logout</button>
        </template>
        <template v-else>
          <button class="login-btn" @click="openLogin">Login</button>
        </template>
      </div>
    </div>
  </header>

  <!-- ✅ MESSAGE BANNER -->
  <div v-if="message" :class="['message-banner', messageType]">
    {{ message }}
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from 'vue-router'

const router = useRouter()
const loggedInUser = ref(localStorage.getItem("loggedInUser") || null);
const showMenu = ref(false);
const activeSection = ref("home");
const message = ref('')
const messageType = ref('')

function showMessage(text, type = 'success') {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}

function toggleUserMenu() {
  showMenu.value = !showMenu.value;
}

// Scroll highlight
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    activeSection.value = sectionId;
  }
}

function handleScroll() {
  const sections = ["home", "about", "who", "rules", "contact"];
  const scrollPos = window.scrollY + window.innerHeight / 2;

  for (const id of sections) {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeSection.value = id;
        break;
      }
    }
  }
}

// ✅ Opens login modal (trigger handled in Home.vue)
function openLogin() {
  const event = new CustomEvent("open-login-modal");
  window.dispatchEvent(event);
  showMenu.value = false;
}

// ✅ Logout
function logout() {
  localStorage.removeItem("loggedInUser");
  loggedInUser.value = null;
  showMenu.value = false;
  router.push('/');
  showMessage('✅ Logged out successfully!');
}

// ✅ Go to Dashboard
function goToDashboard() {
  showMenu.value = false;
  router.push('/dashboard');
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  // When a login event is fired
  window.addEventListener("user-logged-in", (e) => {
    loggedInUser.value = e.detail.username;
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>

</style>