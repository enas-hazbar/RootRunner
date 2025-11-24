<template>
  <div class="academy-page">
    
    <!-- Top bar with hint button -->
    <GameTopBar @show-hint="openHints" />

    <!-- Main Box -->
    <div class="academy-wrapper">
      <div class="main-box">

        <!-- HEADER -->
        <div class="top-section">
          <img src="/logohack.png" class="academy-logo" />

          <div class="nav-buttons">
            <span :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">
              Home
            </span>
            <span :class="{ active: activeTab === 'vip' }" @click="activeTab = 'vip'">
              VIP user
            </span>
          </div>
        </div>

        <!-- CONTENT -->
        <div class="content-section">

          <!-- HOME -->
          <div v-if="activeTab === 'home'" class="home-content">
            <p>
              Hackers solve puzzles hidden inside errors, strange behaviors,
              and unexpected places. Nothing here is broken — you just need to
              know where to look.
            </p>
          </div>

          <!-- LOGIN -->
          <div v-else class="login-content">
            <h2>login</h2>

            <label>Username:</label>
            <input type="text" v-model="username" />

            <label>Password:</label>
            <input type="password" v-model="password" />

            <button @click="handleLogin">Login</button>
          </div>

        </div>
      </div>
    </div>

    <!-- HINT POPUP -->
    <div v-if="showHints" class="modal-overlay" @click.self="closeHints">
      <div class="modal">
        <i class="fa-solid fa-xmark close-icon" @click="closeHints"></i>

        <h2>Hints</h2>

        <ol class="hint-list">
          <li :class="{ done: step1Error }">
            1. Cause an error in the URL.
          </li>

          <li :class="{ done: step2Admin }">
            2. Find the hidden file.
          </li>

          <li :class="{ done: step3Login }">
            3. Log in with the discovered credentials.
          </li>
        </ol>

        <p class="hint-note">
          Steps complete automatically when you trigger them.
        </p>
      </div>
    </div>

    <!-- ERROR POPUP (Step 1 & 2) -->
    <div v-if="showErrorPopup" class="modal-overlay" @click.self="closeErrorPopup">
      <div class="modal">
        <i class="fa-solid fa-xmark close-icon" @click="closeErrorPopup"></i>

        <h2></h2>
<p v-if="step1Error && !step2Admin" class="tiny-info">
  Hint #1 Completed — You caused an error! now find admin.html
</p>

<p v-if="step2Admin" class="tiny-info">
  Hint #2 Completed — admin.html found!
          <p class="tiny-info">username: vip <br /> password: pass123</p>

</p>
      </div>
    </div>
<!-- SUCCESS POPUP -->
<div v-if="showSuccess" class="success-overlay" @click.self="closeSuccess">
  <div class="success-box">
    <div class="medal-icon">🏅</div>

    <h2 class="success-title">ACCESS GRANTED</h2>
    <p class="success-sub">
      You completed the Hacker Academy challenge.
    </p>

    <button class="success-btn" @click="goBack">
      ← Back to games
    </button>

    <p class="success-hint">This popup stays until you close it.</p>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { useRoute } from "vue-router"
import GameTopBar from "@/components/GameTopBar.vue"
import { db } from "@/firebase"
import { doc, setDoc, getDoc} from "firebase/firestore"
import { onMounted } from "vue"

const route = useRoute()

/* STATE */
const activeTab = ref("home")
const showHints = ref(false)
const showErrorPopup = ref(false)

const step1Error = ref(false)
const step2Admin = ref(false)
const step3Login = ref(false)

const progress = ref(0)

/* LOGIN INFO */
const username = ref("")
const password = ref("")
const correctUser = "vip"
const correctPass = "pass123"
const dataLoaded = ref(false)
const showSuccess = ref(false);
const hackerAcademyLeaderboard = ref([]);

function closeSuccess() {
  showSuccess.value = false;
}

function goBack() {
  window.location.href = "/Dashboard";   // ← change if your dashboard path is different
}


/* OPEN/CLOSE HINT MENU */
function openHints() {
  showHints.value = true
}
function closeHints() {
  showHints.value = false
}

/* ERROR POPUP */
function closeErrorPopup() {
  showErrorPopup.value = false
}

/* URL WATCHER (Step 1 + Step 2) */
watch(
  () => route.fullPath,
  async (newPath) => {
    console.log("URL changed:", newPath);

    const isHackerPage = newPath.startsWith("/HackerAcademy");

    // --- STEP 1: Invalid URL ---
   if (
  isHackerPage &&
  !step1Error.value &&
  newPath !== "/HackerAcademy" &&
  !newPath.includes("admin.html")
) {
  console.log("STEP 1 TRIGGERED (invalid path)");

  step1Error.value = true;
  progress.value = Math.max(progress.value, 33);

  await saveProgress(progress.value);   // ✔ SAVE FIRST

  console.log("STEP 1 SAVED TO FIRESTORE:", step1Error.value);

  showErrorPopup.value = true;     // show popup fo
}

    // --- STEP 2: Admin.html ---
    if (isHackerPage && !step2Admin.value && newPath.includes("admin.html")) {
      console.log("STEP 2 TRIGGERED (admin file found)");

      step2Admin.value = true;
      progress.value = 66;
      await saveProgress(66);

      showErrorPopup.value = true;     // popup for admin.html
    }
  },
  { immediate: true }
);
onMounted(async () => {
  const user = localStorage.getItem("loggedInUser")
  if (!user) return

  const docRef = doc(db, "users", user)
  const snap = await getDoc(docRef)

if (snap.exists()) {
  const data = snap.data()

  console.log("Loaded from Firestore:", data.progress)
  console.log("Loaded steps:", data.progress?.HackerAcademySteps)

  const steps = data.progress?.HackerAcademySteps
  if (steps) {
    step1Error.value = steps.step1Error || false
    step2Admin.value = steps.step2Admin || false
    step3Login.value = steps.step3Login || false
  }

  console.log("States after load:", {
    step1Error: step1Error.value,
    step2Admin: step2Admin.value,
    step3Login: step3Login.value
  })

  if (localStorage.getItem("showHackerCongrats") === "true") {
    showCongratsPopup.value = true
  }

}

})

/* VALIDATION */
function isInvalidPath(path) {
  if (!path.startsWith("/HackerAcademy")) return false
  if (path === "/HackerAcademy") return false
  if (path.includes("admin.html")) return false
  return true
}

/* STEP 3 — LOGIN */
async function handleLogin() {
  if (username.value === correctUser && password.value === correctPass) {
  // alert("VIP Access Granted!");
  step3Login.value = true;
  progress.value = 100;

  localStorage.setItem("showHackerCongrats", "true")

  await saveProgress(100);

  showSuccess.value = true;   // ← SHOW POPUP
}
 else {
    alert("Wrong credentials.")
  }
}

/* SAVE TO FIREBASE */
async function saveProgress(val) {
  const user = localStorage.getItem("loggedInUser")
  if (!user) return

  console.log("Saving progress:", val)

  const userRef = doc(db, "users", user)

  await setDoc(
    userRef,
    {
      progress: {
        HackerAcademy: val,
        HackerAcademySteps: {
          step1Error: step1Error.value,
          step2Admin: step2Admin.value,
          step3Login: step3Login.value
        }
      }
    },
    { merge: true }
  )
}

</script>

<style >
/* SAME STYLE AS YOUR GAMECOUNTRIES POPUPS */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.modal {
  background: linear-gradient(180deg, #0b0f12 0%, #1b2730 100%);
  color: #fff;
  padding: 25px;
  width: min(700px, 90%);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  position: relative;
}

.close-icon {
  position: absolute;
  top: 12px;
  right: 16px;
  cursor: pointer;
  font-size: 20px;
  color: #aaa;
}
.close-icon:hover {
  color: #0ef;
}

.hint-list {
  list-style: none;
  padding: 0;
}
.hint-list li {
  padding: 10px 0;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.hint-list li.done {
  text-decoration: line-through;
  color: #00eaff;
}

.hint-note {
  margin-top: 18px;
  color: rgba(215, 230, 255, 0.6);
}
/* SUCCESS POPUP */
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4000;
  animation: fadeIn 0.4s ease-out;
}

.success-box {
  background: #061a0f;
  padding: 35px;
  width: min(600px, 90%);
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 0 40px rgba(0, 255, 120, 0.4);
  border: 1px solid rgba(0, 255, 120, 0.3);
  animation: popupIn 0.4s ease-out;
}

.medal-icon {
  font-size: 55px;
  margin-bottom: 15px;
  animation: pulseGlow 2s infinite;
}

.success-title {
  color: #00ff99;
  font-size: 28px;
  margin-bottom: 10px;
  text-shadow: 0 0 10px #00ff99;
}

.success-sub {
  color: #c9ffe4;
  margin-bottom: 25px;
  font-size: 16px;
}

.success-btn {
  padding: 10px 22px;
  font-size: 16px;
  background: #00ff99;
  color: #000;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: bold;
  transition: 0.2s;
}

.success-btn:hover {
  background: #0affb5;
  box-shadow: 0 0 12px #00ff99;
}

.success-hint {
  margin-top: 15px;
  font-size: 13px;
  color: #77ffcc;
}

/* Animations */
@keyframes popupIn {
  0% { transform: scale(0.6); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulseGlow {
  0%, 100% { filter: drop-shadow(0 0 5px #00ff99); }
  50% { filter: drop-shadow(0 0 15px #00ff99); }
}

</style>
