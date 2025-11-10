<template>
  <div class="dashboard">
    <NavbarDashboard />

    <h1 class="page-title">Mini Cybersecurity Teaching Games</h1>

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
          <p class="modal-description">
            <!-- description placeholder -->
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin congue eu risus sollicitudin lobortis.
           Nulla egestas dapibus sapien, sit amet facilisis nunc dignissim porttitor. Phasellus vulputate vel
            odio ac dictum. Vestibulum imperdiet ex non quam suscipit molestie. In et condimentum diam, et eleifend urna.
             Pellentesque a lectus vel nunc consectetur dignissim. Nulla et quam vel ligula blandit ultrices.         
             </p>
        </div>

<button class="start-btn" @click="startGame(selectedGame.title)">Start</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavbarDashboard from '@/components/NavbarDashboard.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'

const router = useRouter()
const username = ref(localStorage.getItem('loggedInUser'))

// Games list
const games = ref([
  {
    title: 'Countries',
    image: 'https://www.vedantu.com/seo/content-images/be90da47-30dc-492d-a50a-48a7f484d309.jpg',
    progress: 0
  },
  // You can add more games later here...
])

const showGamePopup = ref(false)
const selectedGame = ref(null)

function openGamePopup(game) {
  selectedGame.value = game
  showGamePopup.value = true
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
    const game = games.value.find(g => g.title === 'Countries')
    if (game) game.progress = countryProgress
  }
}

onMounted(async () => {
  if (!username.value) {
    router.push('/')
  } else {
    await loadProgress()
  }
})

function startGame(title) {
  showGamePopup.value = false
  if (title === 'Countries') router.push('/GameCountries')
  // add more later...
}
</script>


<style scoped>

</style>
