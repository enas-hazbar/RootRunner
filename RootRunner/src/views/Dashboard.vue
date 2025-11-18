<template>
  <div class="dashboard">
    <NavbarDashboard />

    <h1 class="page-title">Mini Cybersecurity Teaching challenges</h1>

    <div class="game-container">
      <div v-for="(game, i) in games" :key="i" class="game-card">
        <img :src="game.image" alt="Game Image" />
        <h3>{{ game.title }}</h3>

        <div class="progress-bar">
          <div class="progress" :style="{ width: game.progress + '%' }"></div>
        </div>

        <p class="progress-text">{{ game.progress }}%</p>

        <button class="play-btn" @click="openGamePopup(game)">Start</button>
      </div>
    </div>

    <!-- ===== GAME POPUP MODAL ===== -->
    <div v-if="showGamePopup" class="modal-overlay" @click.self="closeGamePopup">
      <div class="game-modal">
        <h2>{{ selectedGame?.title }}</h2>

        <div class="modal-content">
          <img :src="selectedGame?.image" alt="Game Image" class="modal-img" />
  <p class="modal-description" v-html="selectedGame?.description"></p>

        </div>

<button class="start-btn" @click="startGame(selectedGame.title)">Start</button>
      </div>
    </div>
<div class="leaderboard-box neon-panel">
  <h2 class="leaderboard-title">⚡ Countries Challenge — Top 5 Hackers</h2>

  <table v-if="leaderboard.length > 0" class="leaderboard-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th>User</th>
        <th>Time (sec)</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(entry, i) in leaderboard"
        :key="i"
        :class="['leaderboard-row', `rank-${i + 1}`]"
      >
        <td class="rank-icon">
          <span v-if="i === 0">🥇</span>
          <span v-else-if="i === 1">🥈</span>
          <span v-else-if="i === 2">🥉</span>
          <span v-else>⚡</span>
        </td>

        <td class="username-cell">{{ entry.username }}</td>
        <td class="time-cell">{{ entry.time }}</td>
      </tr>
    </tbody>
  </table>

  <p v-else class="empty-text">No hackers here yet…</p>
</div>

  </div>
</template>

<script setup>
import NavbarDashboard from '@/components/NavbarDashboard.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/firebase'
import { doc, getDoc,collection,
  query,
  where,
  orderBy,
  limit,
  getDocs } from 'firebase/firestore'

const router = useRouter()
const username = ref(localStorage.getItem('loggedInUser'))

// Games list
const games = ref([
  {
    title: 'The Atlas Protocol',
    image: 'https://www.vedantu.com/seo/content-images/be90da47-30dc-492d-a50a-48a7f484d309.jpg',
    progress: 0,
       description: 
       `Your task: uncover <strong>text.txt</strong>.
       The file <strong><bold>text.txt</bold></strong> is hidden in this challenge.`
  },
   {
    title: 'Hacker Academy',
    image: 'https://i.pinimg.com/1200x/f8/b5/0b/f8b50b208d1a02c5da9e408567f44f1a.jpg',
    progress: 0,
     description: 
     `Your mission: retrieve the <strong>username</strong> and <strong>password</strong> hidden in this challenge.<br>`
  }
])

const showGamePopup = ref(false)
const selectedGame = ref(null)
const leaderboard = ref([]);


function openGamePopup(game) {
  selectedGame.value = game
  showGamePopup.value = true
}
async function loadLeaderboard() {
  const q = query(
    collection(db, "leaderboard"),
    where("game", "==", "Countries"),
    orderBy("time", "asc"),
    limit(5)
    
  );

  const snapshot = await getDocs(q);

  leaderboard.value = snapshot.docs.map(doc => doc.data());
}

function closeGamePopup() {
  showGamePopup.value = false
}

async function loadProgress() {
  if (!username.value) return
  const snap = await getDoc(doc(db, 'users', username.value))
  if (snap.exists()) {
    const data = snap.data()

    // Check if there's progress for Countries
    const countryProgress = data.progress?.Countries || 0

    // Update the Countries game inside the array
    const game = games.value.find(g => g.title === 'The Atlas Protocol')
    if (game) game.progress = countryProgress
    const hackerProgress = data.progress?.HackerAcademy || 0
const game2 = games.value.find(g => g.title === 'Hacker Academy')
if (game2) game2.progress = hackerProgress
  }
  
}

onMounted(async () => {
  if (!username.value) {
    router.push('/')
  } else {
    await loadProgress()
    await loadLeaderboard()
  }
  
})

function startGame(title) {
  showGamePopup.value = false
  if (title === 'The Atlas Protocol') router.push('/GameCountries')
  if (title === 'Hacker Academy') {
    router.push('/HackerAcademy')
  }
}
</script>


<style scoped>
</style>
