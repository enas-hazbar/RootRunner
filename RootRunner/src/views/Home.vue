<template>
  <div class="home">
    <Navbar />
<div v-if="message" :class="['message-banner', messageType]">
  {{ message }}
</div>

    <!-- ===== HERO ===== -->
    <section class="hero" id="home">
      <div class="hero-content">
        <h1>
          ROOTRUNNER CYBERsecurity<br />
          Teaching Platform
        </h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin congue eu risus sollicitudin lobortis.
          Nulla egestas dapibus sapien, sit amet facilisis nunc dignissim porttitor. Phasellus vulputate vel odio ac dictum.
          Vestibulum imperdiet ex non quam suscipit molestie.
        </p>
        <button class="btn-get-started" @click="showLogin = true">Get started</button>
      </div>
      <div class="hero-image">
        <img src="/home.png" alt="Cybersecurity Shield" />
      </div>
    </section>
<!-- ===== LOGIN MODAL ===== -->
<div v-if="showLogin" class="modal-overlay" @click.self="closeAll">
  <div class="login-modal">
    <img src="/logo.gif" alt="RootRunner Logo" class="login-logo" />
    <h2>Please login</h2>

    <form class="login-form" @submit.prevent="handleLogin">
      <input type="text" v-model="loginUsername" placeholder="Username" required />
      <input type="password" v-model="loginPassword" placeholder="Password" required />
      <button type="submit" class="save-btn">Login</button>
    </form>

    <p class="register-text" @click="switchToSignup">
      I don’t have an account!
    </p>
  </div>
</div>

<!-- ===== SIGNUP MODAL ===== -->
<div v-if="showSignup" class="modal-overlay" @click.self="closeAll">
  <div class="login-modal">
    <img src="/logo.gif" alt="RootRunner Logo" class="login-logo" />
    <h2>Create an account</h2>

    <form class="login-form" @submit.prevent="handleSignup">
      <input type="text" v-model="signupUsername" placeholder="Choose your username" required />
      <input type="password" v-model="signupPassword" placeholder="Choose your password" required />
      <input type="password" v-model="confirmPassword" placeholder="Confirm password" required />
      <div class="btn-row">
        <button type="submit" class="save-btn">Save</button>
        <button type="button" class="back-btn" @click="switchToLogin">Back to login</button>
      </div>
    </form>
  </div>
</div>
    <!-- ===== ABOUT SECTION ===== -->
    <section class="about" id="about">
      <div class="about-container">
        <div class="about-image">
          <img src="/about.gif" alt="About RootRunner" />
        </div>
        <div class="about-text">
          <h2>About</h2>
          <p>
            RootRunner Technology is a platform dedicated to teaching cybersecurity in an interactive and engaging way.
            We simplify complex topics like ethical hacking, data protection, and network security for learners at all levels.
          </p>
          <p>
            Our goal is to make cybersecurity education accessible to everyone through modern tools, visual learning, and
            real-world examples.
          </p>
        </div>
      </div>
    </section>

    <!-- ===== WHO ARE WE SECTION ===== -->
    <section class="who-are-we" id="who">
      <div class="who-content">
        <h2>Who are we?</h2>
        <p>
          We are a passionate team of developers and cybersecurity enthusiasts committed to helping others learn how to
          protect the digital world.
        </p>

        <div class="team-members">
          <div class="member" v-for="(member, i) in team" :key="i">
            <img :src="member.image" alt="Team member" />
            <h3>{{ member.name }}</h3>
            <p>{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>
    <!-- ===== RULES / INSTRUCTION ===== -->
    <section class="rules" id="rules">
      <div class="rules-container">
        <div class="rules-image">
          <img src="/hints.gif" alt="Rules Icon" />
        </div>
        <div class="rules-text">
          <h2>The Rules</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin congue eu risus sollicitudin lobortis.
            Nulla egestas dapibus sapien, sit amet facilisis nunc dignissim porttitor. Phasellus vulputate vel odio ac dictum.
            Vestibulum imperdiet ex non quam suscipit molestie. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p>
            Proin congue eu risus sollicitudin lobortis. Nulla egestas dapibus sapien, sit amet facilisis nunc dignissim
            porttitor. Phasellus vulputate vel odio ac dictum. Vestibulum imperdiet ex non quam suscipit molestie.
          </p>
        </div>
      </div>
    </section>
    <!-- ===== CONTACT FORM ===== -->
<section class="contact" id="contact">
  <div class="contact-container">
    <h2>Contact Form</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
      vulputate vel odio ac dictum. Vestibulum imperdiet ex non quam suscipit
      molestie.
    </p>

    <form class="contact-form">
      <div class="input-group">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Email Address" required />
      </div>
      <textarea placeholder="Your Message" rows="6"></textarea>
      <button type="submit" class="send-btn">Send Message</button>
    </form>
  </div>
</section>
<section>
  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-logo">
        <img src="/logo.gif" alt="RootRunner Logo" />
        <h3>ROOTRUNNER<br />TECHNOLOGY</h3>
      </div>
      <p>Made by Enas</p>
    </div>
  </footer>
</section>

  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { ref, onMounted } from 'vue'
import { db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import Dashboard from './Dashboard.vue'

// Browser-native hashing
async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// TEAM
const team = [
  { name: 'John Doe', role: 'Cybersecurity Analyst', image: '/avater.png' },
  { name: 'Jane Smith', role: 'Network Engineer', image: '/avater.png' },
  { name: 'Alex Carter', role: 'Ethical Hacker', image: '/avater.png' }
]

// STATES
const showLogin = ref(false)
const showSignup = ref(false)
const loginUsername = ref('')
const loginPassword = ref('')
const signupUsername = ref('')
const signupPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const messageType = ref('') // "success" or "error"

function showMessage(text, type = 'success') {
  message.value = text
  messageType.value = type

  // Hide message automatically after 3 seconds
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}

// FUNCTIONS
function closeAll() {
  showLogin.value = false
  showSignup.value = false
}
function switchToSignup() {
  showLogin.value = false
  showSignup.value = true
}
function switchToLogin() {
  showSignup.value = false
  showLogin.value = true
}
function resetFields() {
  loginUsername.value = ''
  loginPassword.value = ''
  signupUsername.value = ''
  signupPassword.value = ''
  confirmPassword.value = ''
}

// SIGNUP
async function handleSignup() {
  try {
    if (!signupUsername.value || !signupPassword.value) {
      alert('Please fill in all fields!')
      return
    }

    if (signupPassword.value !== confirmPassword.value) {
      alert('Passwords do not match!')
      return
    }

    const cleanUsername = signupUsername.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    const userRef = doc(db, 'users', cleanUsername)
    const existing = await getDoc(userRef)
    if (existing.exists()) {
      alert('Username already taken!')
      return
    }

    const hashed = await hashPassword(signupPassword.value)
    await setDoc(userRef, {
      username: cleanUsername,
      password: hashed,
      createdAt: new Date()
    })
resetFields()
switchToLogin()
showMessage('✅ Account created successfully!')


  } catch (err) {
    console.error('Signup error:', err)
    alert('Error creating account. Check console for details.')
  }
}

// LOGIN
async function handleLogin() {
  try {
    const cleanUsername = loginUsername.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    const userRef = doc(db, 'users', cleanUsername)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      alert('User not found!')
      return
    }

    const data = userSnap.data()
    const enteredHash = await hashPassword(loginPassword.value)

    if (enteredHash === data.password) {
resetFields()
closeAll()
handleSuccessfulLogin(cleanUsername)
showMessage(`👋 Welcome back, ${cleanUsername}!`)
setTimeout(() => {
  window.location.href = '/dashboard'
}, 0)

    } else {
      alert('Incorrect password!')
    }
  } catch (err) {
    console.error('Login error:', err)
    alert('Error logging in. Check console for details.')
  }
}
onMounted(() => {
  // When Navbar "Login" button is clicked
  window.addEventListener("open-login-modal", () => {
    showLogin.value = true
  })
})

// Emit event to Navbar when user logs in
function handleSuccessfulLogin(username) {
  localStorage.setItem("loggedInUser", username)
  const event = new CustomEvent("user-logged-in", { detail: { username } })
  window.dispatchEvent(event)
}

</script>

<style scoped>
</style>
