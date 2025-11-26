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
          ROOTRUNNER CyberSecurity<br />
          Teaching Platform
        </h1>
        <p>
         Think like a hacker. Learn like a pro. Play your way into cybersecurity.       
        </p>
<button class="btn-get-started" @click="handleGetStarted">Get started</button>
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
    <button class="google-btn" @click="handleGoogleLogin">
      <img src="https://icon2.cleanpng.com/20240216/fty/transparent-google-logo-flat-google-logo-with-blue-green-red-1710875585155.webp" class="google-icon" />
      Continue with Google
    </button>

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
           RootRunner isn’t your typical learning platform — it’s a digital playground for cybersecurity enthusiasts.
           Here, you don’t just study hacking, you experience it through interactive missions, logic puzzles, and hidden challenges.  
          </p>
          <p>
           Each level is designed to sharpen your skills, boost your curiosity, and teach you how to think like a real ethical hacker.

          </p>
        </div>
      </div>
    </section>

    <!-- ===== WHO ARE WE SECTION ===== -->
    <!-- <section class="who-are-we" id="who">
      <div class="who-content">
        <h2>Who am I</h2>
        <p>
     RootRunner was built by one person with a passion for hacking, problem-solving, and teaching others how to think like a cybersecurity expert.
        </p>
 
        <div class="team-members">
          <div class="member" v-for="(member, i) in team" :key="i">
            <img :src="member.image" alt="Team member" />
            <h3>{{ member.name }}</h3>
            <p>{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section> -->
    <!-- ===== RULES / INSTRUCTION ===== -->
    <section class="rules" id="rules">
      <div class="rules-container">
        <div class="rules-image">
          <img src="/hints.gif" alt="Rules Icon" />
        </div>
        <div class="rules-text">
          <h2>The Rules</h2>
          <p>
          
            Each mission comes with a limited number of hints — usually<strong>three</strong>,though easier challenges may have only <strong>two</strong>.<br /> 
            You can access hints in two ways: <br /> 
   <ul>
<li><strong>Automatically:</strong>  A new hint appears every 3 minutes during gameplay.<br /></li>

<li><strong>Manually: </strong>Click the lamp icon at the top of the game interface to reveal a hint instantly.</li>
</ul>
Hints remain visible throughout the mission.
Once a hint is successfully completed, it will be marked as done, but stays on the screen so you can still review it.
Remember, use your hints wisely. Every decision brings you closer to uncovering the truth hidden in the system.
          </p>
          <p>
          </p>
        </div>
      </div>
    </section>
    <!-- ===== CONTACT FORM ===== -->
<section class="contact" id="contact">
  <div class="contact-container">
    <h2>Contact Form</h2>
    <p>
      Need help or found a bug in the system?  
      Send us a message below. Our team reviews every report and suggestion to make RootRunner better for all players.
    </p>

    <form class="contact-form" @submit.prevent="sendEmail">
      <div class="input-group">
        <input type="text" placeholder="Your Name" v-model="name" required />
        <input type="email" placeholder="Email Address" v-model="email" required />
      </div>
      <textarea placeholder="Your Message" rows="6" v-model="messageC" required></textarea>
      <button type="submit" class="send-btn">Send Message</button>
    </form>

    <p v-if="statusMessage" class="status-message">{{ statusMessage }}</p>
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
import emailjs from 'emailjs-com'
import { useRouter } from 'vue-router'
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";



// Browser-native hashing
async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// TEAM
const team = [
  { name: 'Enas', role: 'Student ', image: '/avater.png' },

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
const name = ref('')
const email = ref('')
const messageC = ref('')
const statusMessage = ref('')
const router = useRouter()

const isLoggedIn = ref(!!localStorage.getItem('loggedInUser'))

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

function handleGetStarted() {
  if (isLoggedIn.value) {
    router.push('/dashboard')
  } else {
    showLogin.value = true
  }
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
async function sendEmail() {
  try {
    const params = {
      name: name.value,
      email: email.value,
      messageC: messageC.value,
    }

    await emailjs.send(
      'service_nlym9r8',     // 🔹 Replace with your Service ID
      'template_0g09xw8',    // 🔹 Replace with your Template ID
      params,
      'DAqq5Ou9VMEWEwZWE'      // 🔹 Replace with your Public Key
    )

    statusMessage.value = '✅ Message sent successfully!'
    name.value = ''
    email.value = ''
    messageC.value = ''
  } catch (error) {
    console.error('EmailJS error:', error)
    statusMessage.value = '❌ Failed to send message. Please try again later.'
  }

  // Clear status message after a few seconds
  setTimeout(() => (statusMessage.value = ''), 4000)
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
async function handleGoogleLogin() {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const cleanUsername = user.email.split("@")[0].toLowerCase();

    // Save user in Firestore if not exists
    const userRef = doc(db, "users", cleanUsername);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        username: cleanUsername,
        googleName: user.displayName,
        googleEmail: user.email,
        createdAt: new Date(),
      });
    }

    // Save login session
    localStorage.setItem("loggedInUser", cleanUsername);

    showLogin.value = false;
    showSignup.value = false;

    showMessage(`👋 Logged in as ${cleanUsername} (Google)`);

    router.push("/dashboard");

  } catch (error) {
    console.error("Google Login Error:", error);
    alert("Google login failed.");
  }
}

</script>

<style scoped>
</style>
