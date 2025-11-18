<template>
  <div class="game-topbar">
    <div class="icons">

      <!-- Hint -->
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <i
            v-bind="props"
            class="fa-solid fa-lightbulb"
            @click="$emit('show-hint')"
          ></i>
        </template>
        Hint
      </v-tooltip>

      <!-- Description -->
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <i
            v-bind="props"
            class="fa-solid fa-book"
            @click="$emit('show-challenge')"
          ></i>
        </template>
        Challenge
      </v-tooltip>

      <!-- Exit -->
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <i
            v-bind="props"
            class="fa-solid fa-right-from-bracket exit"
            @click="exitGame"
          ></i>
        </template>
        Leave Game
      </v-tooltip>

    </div>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function exitGame() {
  router.push('/dashboard')
}
</script>

<style scoped>
.game-topbar {
  width: 100%;
  height: 55px;
  background: #4a4a4a;
  display: flex;
  align-items: center;
  padding: 0 25px;
  box-sizing: border-box;
}

.icons {
  display: flex;
  gap: 20px;
}

.icons i {
  font-size: 22px;
  color: white;
  cursor: pointer;
  transition: 0.3s;
}

.icons i:hover {
  color: #00ffff;
}

.exit {
  color: #d36a6a;
}

.exit:hover {
  color: #ff3b3b;
}
</style>
