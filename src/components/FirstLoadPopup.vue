<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showPopup = ref(false)
const COOKIE_NAME = 'firstVisited'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

onMounted(() => {
  if (!getCookie(COOKIE_NAME)) {
    showPopup.value = true
  }
})

function handleAccept() {
  setCookie(COOKIE_NAME, String(Date.now()), 365)
  showPopup.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition name="popup">
      <div v-if="showPopup" class="popup-overlay">
        <div class="popup-card">
          <h2 class="popup-title">Weryfikacja uprawnień</h2>
          <p class="popup-body">
            Wchodząc na stronę akceptujesz przechowywanie plików cookies oraz danych o przeglądarce i systemie w celu zapewnienia prawidłowego działania serwisu.
          </p>
          <button class="popup-btn" @click="handleAccept">Rozumiem</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  padding: var(--space-md);
}

.popup-card {
  background: var(--secondary-dark);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius);
  padding: var(--space-lg);
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  text-align: center;
}

.popup-title {
  font-size: var(--h2-size);
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
}

.popup-body {
  font-size: var(--program-desc-size);
  color: var(--light-grey);
  margin: 0;
  line-height: 1.6;
}

.popup-btn {
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius);
  background: var(--highlight-red);
  color: var(--pure-white);
  font-family: var(--font-family);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s;
}

.popup-btn:hover {
  filter: brightness(0.85);
}

/* Transition */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
</style>
