<template>
  <div class="game-topbar">
    <div class="icons">

      <!-- Hint button -->
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <i
            v-bind="props"
            class="fa-solid fa-lightbulb"
            @click="handleHintClick"
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

// Props ONLY used for HackerAcademy
const props = defineProps({
  usedHint1: {
    type: Boolean,
    default: null
  },
  usedHint2: {
    type: Boolean,
    default: null
  }
})

const emit = defineEmits(['show-hint', 'show-hint1', 'show-hint2'])

function exitGame() {
  router.push('/dashboard')
}

function handleHintClick() {
  // If props are null → this is GameCountries → use the old event
  if (props.usedHint1 === null) {
    emit("show-hint")
    return
  }

  // HackerAcademy logic
  if (!props.usedHint1) {
    emit("show-hint1")
  } else if (!props.usedHint2) {
    emit("show-hint2")
  }
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
