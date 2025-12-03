<template>
  <div class="home">
    <Navbar />
<div v-if="message" :class="['message-banner', messageType]">
  {{ message }}
</div>

    <!--  HERO -->
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
<!--  LOGIN MODAL  -->
<div v-if="showLogin" class="modal-overlay" @click.self="closeAll">
  <div class="login-modal">
    <img src="/logo.gif" alt="RootRunner Logo" class="login-logo" />
    <h2>Please login</h2>

    <form class="login-form" @submit.prevent="handleLogin">
      <input type="text" v-model="loginUsername" placeholder="Username" required />
      <input type="password" v-model="loginPassword" placeholder="Password" required />
      <p class="error" v-if="loginErrorUser">{{ loginErrorUser }}</p>
<p class="error" v-if="loginErrorPass">{{ loginErrorPass }}</p>

<p class="error" v-if="loginErrorBoth">
  Incorrect username / password.
</p>

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

<!-- SIGNUP MODAL  -->
<div v-if="showSignup" class="modal-overlay" @click.self="closeAll">
  <div class="login-modal">
    <img src="/logo.gif" alt="RootRunner Logo" class="login-logo" />
    <h2>Create an account</h2>

    <form class="login-form" @submit.prevent="handleSignup">
      <input type="text" v-model="signupUsername" placeholder="Choose your username" required />
      <input type="password" v-model="signupPassword" placeholder="Choose your password" required />
      <input type="password" v-model="confirmPassword" placeholder="Confirm password" required />
      <p class="error" v-if="signupError">{{ signupError }}</p>
<p class="error" v-if="passwordStrengthError">{{ passwordStrengthError }}</p>
<p class="error" v-if="passwordMatchError">{{ passwordMatchError }}</p>

      <div class="btn-row">
        <button type="submit" class="save-btn">Save</button>
        <button type="button" class="back-btn" @click="switchToLogin">Back to login</button>
      </div>
    </form>
  </div>
</div>
    <!--  ABOUT SECTION  -->
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
    <!--  RULES / INSTRUCTION -->
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
    <!--  CONTACT FORM  -->
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



async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

const team = [
  { name: 'Enas', role: 'Student ', image: '/avater.png' },

]

const showLogin = ref(false)
const showSignup = ref(false)
const loginUsername = ref('')
const loginPassword = ref('')
const signupUsername = ref('')
const signupPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const messageType = ref('') 
const name = ref('')
const email = ref('')
const messageC = ref('')
const statusMessage = ref('')
const router = useRouter()

const isLoggedIn = ref(!!localStorage.getItem('loggedInUser'))
const signupError = ref("");
const passwordStrengthError = ref("");
const passwordMatchError = ref("");
const loginErrorUser = ref("");
const loginErrorPass = ref("");
const loginErrorBoth = ref("");


function showMessage(text, type = 'success') {
  message.value = text
  messageType.value = type

  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}
function validatePasswordStrength(password) {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const longEnough = password.length >= 8;

  if (!longEnough || !hasUpper || !hasLower || !hasNumber) {
    passwordStrengthError.value = 
      "Password must contain 8 letters, one uppercase, one lowercase and a number.";
    return false;
  }

  passwordStrengthError.value = "";
  return true;
}

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

async function handleSignup() {
  signupError.value = "";
  passwordStrengthError.value = "";
  passwordMatchError.value = "";

  if (!signupUsername.value || !signupPassword.value || !confirmPassword.value) {
    signupError.value = "Please fill in all fields.";
    return;
  }

  if (!validatePasswordStrength(signupPassword.value)) return;

  if (signupPassword.value !== confirmPassword.value) {
    passwordMatchError.value = "Passwords don't match.";
    return;
  }

  const cleanUsername = signupUsername.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const userRef = doc(db, "users", cleanUsername);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    signupError.value = "⚠️ This username is already taken.";
    return;
  }

  const hashed = await hashPassword(signupPassword.value);

  await setDoc(userRef, {
    username: cleanUsername,
    password: hashed,
    createdAt: new Date(),
  });

  localStorage.setItem("loggedInUser", cleanUsername);

  showSignup.value = false;
  router.push("/dashboard");
}

async function sendEmail() {
  try {
    const params = {
      name: name.value,
      email: email.value,
      messageC: messageC.value,
    }

    await emailjs.send(
      'service_nlym9r8',     
      'template_0g09xw8',   
      params,
      'DAqq5Ou9VMEWEwZWE'    
    )

    statusMessage.value = '✅ Message sent successfully!'
    name.value = ''
    email.value = ''
    messageC.value = ''
  } catch (error) {
    console.error('EmailJS error:', error)
    statusMessage.value = '❌ Failed to send message. Please try again later.'
  }

  setTimeout(() => (statusMessage.value = ''), 4000)
}

async function handleLogin() {
  loginErrorUser.value = "";
  loginErrorPass.value = "";
  loginErrorBoth.value = "";

  const cleanUsername = loginUsername.value.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  const userRef = doc(db, "users", cleanUsername);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    loginErrorUser.value = "Username is not correct.";
    return;
  }

  const data = snap.data();
  const enteredHash = await hashPassword(loginPassword.value);

  if (enteredHash !== data.password) {
    loginErrorPass.value = "Password is not correct.";
    return;
  }

  localStorage.setItem("loggedInUser", cleanUsername);
  showLogin.value = false;
  router.push("/dashboard");
}
onMounted(() => {
  window.addEventListener("open-login-modal", () => {
    showLogin.value = true
  })
})

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
.error {
  color: #b30000;
  margin-top: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}

</style>
