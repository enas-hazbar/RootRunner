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
import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import GameTopBar from "@/components/GameTopBar.vue"
import { db } from "@/firebase"
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp
} from "firebase/firestore"

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

const showSuccess = ref(false)

const gameStartTime = ref(null)     // timestamp (ms) when run started
const completionTime = ref(0)      // final time in seconds

function closeSuccess() {
  showSuccess.value = false
}

function goBack() {
  window.location.href = "/Dashboard"
}

/* HINT POPUP */
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

/* SAVE BEST TIME FOR HACKER ACADEMY */
async function saveHackerAcademyScore() {
  const user = localStorage.getItem("loggedInUser")
  if (!user) return

  // one doc per user per game: e.g. "hello01_HackerAcademy"
  const scoreId = `${user}_HackerAcademy`
  const scoreRef = doc(db, "leaderboard", scoreId)

  try {
    const snap = await getDoc(scoreRef)
    const oldTime = snap.exists() ? snap.data().time : null

    // save if first time or better than previous
    if (oldTime === null || completionTime.value < oldTime) {
      await setDoc(
        scoreRef,
        {
          username: user,
          game: "HackerAcademy",
          time: completionTime.value,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      )

      console.log(
        "🔥 HackerAcademy best time saved/updated:",
        completionTime.value
      )
    } else {
      console.log(
        "⏸ HackerAcademy time is slower, keeping old best:",
        oldTime
      )
    }
  } catch (err) {
    console.error("🔥 Error saving HackerAcademy time:", err)
  }
}


/* URL WATCHER (Step 1 + Step 2) */
watch(
  () => route.fullPath,
  async (newPath) => {
    console.log("URL changed:", newPath)

    const isHackerPage = newPath.startsWith("/HackerAcademy")

    // STEP 1: invalid URL inside /HackerAcademy (but not admin.html)
    if (
      isHackerPage &&
      !step1Error.value &&
      newPath !== "/HackerAcademy" &&
      !newPath.includes("admin.html")
    ) {
      console.log("STEP 1 TRIGGERED (invalid path)")

      step1Error.value = true
      progress.value = progress.value < 33 ? 33 : progress.value

      await saveProgress(progress.value)
      console.log("STEP 1 SAVED TO FIRESTORE:", step1Error.value)

      showErrorPopup.value = true
    }

    // STEP 2: admin.html
    if (isHackerPage && !step2Admin.value && newPath.includes("admin.html")) {
      console.log("STEP 2 TRIGGERED (admin file found)")

      step2Admin.value = true
      if (progress.value < 66) progress.value = 66
      await saveProgress(progress.value)

      showErrorPopup.value = true
    }
  },
  { immediate: true }
)

/* ON MOUNT: load steps + START or RESUME TIMER (like Countries game) */
onMounted(async () => {
  const user = localStorage.getItem("loggedInUser")
  if (!user) return

  const docRef = doc(db, "users", user)
  const snap = await getDoc(docRef)

  if (snap.exists()) {
    const data = snap.data()

    console.log("Loaded from Firestore:", data.progress)
    console.log("Loaded steps:", data.progress && data.progress.HackerAcademySteps)

    const steps = data.progress && data.progress.HackerAcademySteps
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

    progress.value = data.progress && data.progress.HackerAcademy
      ? data.progress.HackerAcademy
      : 0
  }

  // TIMER: same pattern as Countries (atlas_start_time) but with hacker_start_time
  const savedStart = localStorage.getItem("hacker_start_time")

  if (savedStart) {
    gameStartTime.value = parseInt(savedStart, 10)
    if (isNaN(gameStartTime.value)) {
      const now = Date.now()
      gameStartTime.value = now
      localStorage.setItem("hacker_start_time", now)
    }
    console.log("⏳ Hacker timer resumed at:", gameStartTime.value)
  } else {
    const now = Date.now()
    gameStartTime.value = now
    localStorage.setItem("hacker_start_time", now)
    console.log("🔥 Hacker timer started at:", now)
  }
})

/* STEP 3 — LOGIN (STOP TIMER + SAVE BEST TIME) */
async function handleLogin() {
  if (username.value === correctUser && password.value === correctPass) {
    const now = Date.now()
    const startRaw = localStorage.getItem("hacker_start_time")
    const start = startRaw ? parseInt(startRaw, 10) : now

    let diff = now - start
    if (diff < 1000) diff = 1000 // at least 1 second

    completionTime.value = Math.round(diff / 1000)
    console.log("⏱ Hacker Academy time:", completionTime.value)

    step3Login.value = true
    progress.value = 100
    localStorage.setItem("showHackerCongrats", "true")

    await saveProgress(progress.value)
    await saveHackerAcademyScore()

    // remove timer key so a new run will start fresh
    localStorage.removeItem("hacker_start_time")

    showSuccess.value = true
  } else {
    alert("Wrong credentials.")
  }
}

/* SAVE PROGRESS (steps & overall %) */
async function saveProgress(val) {
  const user = localStorage.getItem("loggedInUser")
  if (!user) return

  console.log("Saving HackerAcademy progress:", val)

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
