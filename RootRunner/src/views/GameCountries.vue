<template>
  <div class="game-page">
    <GameTopBar 
      @show-hint="showHint = true" 
      @show-description="showDescription = true"
    />

    <div class="game-container">
      <div class="ai-image">
        <img src="/ai.png" alt="AI Brain" />
      </div>

      <div class="question-box">
        <h3>Countries — Ask the AI</h3>
        <p>
          Type a country name and the AI will return its capital (press Enter).
          The real challenge is hidden: find the file <code>text.txt</code> by
          manipulating the URL — the second hint points you toward that.
        </p>

        <div class="answer-box">
          <input
            type="text"
            placeholder="Enter a country (e.g. France) and press Enter..."
            v-model="country"
            @keyup.enter="getCapital"
          />
        </div>

        <div v-if="capital" class="capital-display">
          <strong>{{ capital }}</strong>
        </div>
      </div>
    </div>

    <!-- Hint Popup -->
    <div v-if="showHint" class="modal-overlay" @click.self="showHint = false">
      <div class="modal">
        <h2>Hint 1</h2>
        <p>
          The file <code>text.txt</code> is hidden somewhere. Finding it is the first step.
        </p>
        <button @click="showHint = false">Close</button>
      </div>
    </div>

    <!-- Description / second hint popup -->
    <div v-if="showDescription" class="modal-overlay" @click.self="showDescription = false">
      <div class="modal">
        <h2>Hint 2 (URL hack)</h2>
        <p>
          The hidden file can be revealed by editing the browser URL. Try adding a path that ends with
          <code>text.txt</code> (for example: add <code>/../text.txt</code> or <code>/text.txt</code> to the end of the URL).
        </p>
        <button @click="showDescription = false">Close</button>
      </div>
    </div>

    <!-- Secret file reveal modal (shown when URL indicates secret) -->
    <div v-if="showSecret" class="modal-overlay">
      <div class="modal">
        <h2>text.txt — Found!</h2>
        <pre class="secret-text">{{ secretContent }}</pre>
        <p class="small-note">This will close automatically after 5 seconds.</p>
      </div>
    </div>

    <!-- Congratulation modal (opens after secret modal auto-closes) -->
    <div v-if="showCongrats" class="modal-overlay" @click.self="closeCongrats">
      <div class="modal congrats">
        <div class="congrats-top">
          <div class="congrats-icon">🎖️</div>
          <h2>Congratulations (100%)</h2>
        </div>

        <p class="congrats-text">
          You successfully found the members-only file. Well done on completing this challenge!
        </p>

        <div class="congrats-buttons">
          <button class="btn-back" @click="goToDashboard">Back — to games</button>
        </div>

        <p class="small-note">This popup will remain until you press Back.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import GameTopBar from '@/components/GameTopBar.vue'
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const router = useRouter()
const route = useRoute()

/* ---- UI state ---- */
const country = ref('')
const capital = ref('')
const showHint = ref(false)
const showDescription = ref(false)
const showSecret = ref(false)
const showCongrats = ref(false)

// secret content (editable)
const secretContent = ref(
`FLAG{well_done_you_found_text_dot_txt}
This is the hidden file content. Good job figuring out the URL trick!`
)

// current logged user (stored in localStorage on login)
const username = ref(localStorage.getItem('loggedInUser') || null)

/* ---- Country → capital (REST Countries API) ---- */
async function getCapital() {
  const name = country.value.trim()
  if (!name) return

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`)
    const data = await res.json()

    if (Array.isArray(data) && data[0] && data[0].capital && data[0].capital[0]) {
      const capitalCity = data[0].capital[0]
      const niceCountry = name.charAt(0).toUpperCase() + name.slice(1)
      capital.value = `The capital of ${niceCountry} is ${capitalCity}.`
    } else {
      capital.value = `I couldn't find that country. Try another.`
    }
  } catch (err) {
    console.error(err)
    capital.value = 'Problem looking up that country right now — try again later.'
  }

  country.value = ''
}

/* ---- Secret detection (URL) ----
   When a route / URL contains text.txt (or ../text.txt), reveal secret modal.
   When the secret is shown we start a 15s timer: after 15s auto-close secret modal,
   save completion to Firestore, then open the congratulations modal.
*/
let secretTimer = null

function routeHasSecret(path) {
  if (!path) return false
  const lower = path.toLowerCase()
  return lower.includes('text.txt')
}

async function onSecretFound() {
  // show the text file modal
  showSecret.value = true
  // ensure congrats hidden
  showCongrats.value = false

  // clear any previous timer
  if (secretTimer) {
    clearTimeout(secretTimer)
    secretTimer = null
  }

  // start 15s timer
  secretTimer = setTimeout(async () => {
    showSecret.value = false
    // Mark challenge completed in Firestore (if user logged in)
    if (username.value) {
      try {
        const userRef = doc(db, 'users', username.value)
        // set both a challenge flag and progress = 100 for this game
        await setDoc(userRef, {
          challenges: { Countries: true },
          progress: { Countries: 100 }
        }, { merge: true })
      } catch (err) {
        console.error('Failed to save completion:', err)
      }
    }
    // open congrats modal
    showCongrats.value = true
  }, 500) // 15000 ms = 15s
}

/* stop timer if user navigates away */
function cancelSecretTimer() {
  if (secretTimer) {
    clearTimeout(secretTimer)
    secretTimer = null
  }
}

/* watch route changes and window popstate */
function checkCurrentLocation() {
  const pathToCheck = route.fullPath || window.location.pathname || window.location.href
  if (routeHasSecret(pathToCheck)) {
    // new secret found
    onSecretFound()
  } else {
    // close/hide if present
    showSecret.value = false
    // do NOT automatically close congrats here (congrats remains until user clicks Back)
    cancelSecretTimer()
  }
}

onMounted(() => {
  checkCurrentLocation()
  window.addEventListener('popstate', checkCurrentLocation)
})

onUnmounted(() => {
  window.removeEventListener('popstate', checkCurrentLocation)
  cancelSecretTimer()
})

/* also watch the vue route fullPath (SPA navigation) */
watch(() => route.fullPath, () => checkCurrentLocation())

/* Congratulation modal actions */
function closeCongrats() {
  showCongrats.value = false
}

function goToDashboard() {
  // optional: you could also record a timestamp or badge in Firestore
  router.push('/dashboard')
}
</script>

<style scoped>
/* basic structure (keep similar theme to your other popups) */
.game-page { background-color: #000; min-height: 100vh; color: white; font-family: "Poppins", sans-serif; }
.game-container { display:flex; align-items:center; justify-content:center; min-height:80vh; gap:40px; padding-top:20px; }
.ai-image img { height:300px; max-width:320px; }
.question-box { background: rgba(255,255,255,0.06); padding:26px; border-radius:14px; width:560px; backdrop-filter: blur(4px); text-align:left; }
.answer-box input { width:100%; padding:12px 14px; border-radius:8px; border:none; font-weight:600; color:#222; }
.capital-display { margin-top:12px; background: rgba(0,0,0,0.35); padding:10px; border-radius:8px; }

/* modal overlay (shared) */
.modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.75); display:flex; justify-content:center; align-items:center; z-index:3000; }
.modal { background: linear-gradient(180deg, #0b0f12 0%, #1b2730 100%); color:#fff; border-radius:16px; padding:22px; width: min(720px, 92%); box-shadow: 0 10px 40px rgba(0,0,0,0.6); text-align:left; }
.modal h2 { margin-top:0; }
.modal pre.secret-text { background: rgba(255,255,255,0.02); padding:14px; border-radius:8px; color:#bfefff; white-space: pre-wrap; font-family: ui-monospace, Menlo, Monaco, "Roboto Mono", monospace; }
.modal .small-note { margin-top:10px; color:#bfc7ca; font-size:13px; }

/* congrats modal styling — colors matched to your theme (blue/teal theme) */
.modal.congrats { text-align:center; background: linear-gradient(180deg, rgba(8,10,12,1) 0%, rgba(28,44,56,1) 100%); }
.congrats-top { display:flex; gap:18px; align-items:center; justify-content:center; }
.congrats-icon { font-size:40px; background: rgba(255,255,255,0.06); padding:12px; border-radius:8px; }
.congrats h2 { color:#ffd36b; margin:10px 0 0; } /* accent color for header */
.congrats-text { margin:18px 0; color:#e6f7fb; font-size:16px; line-height:1.4; }

/* buttons */
.congrats-buttons { display:flex; gap:12px; justify-content:center; margin-top:12px; }
.btn-back {
  background: transparent;
  color: white;
  border: 2px solid rgba(255,255,255,0.25);
  padding:12px 28px;
  border-radius:28px;
  font-weight:700;
  cursor:pointer;
  transition: .12s;
}
.btn-back:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.45); }

/* responsive */
@media (max-width:720px) {
  .ai-image { display:none; }
  .question-box { width:92%; }
}
</style>
