<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const protocolAvailable = ref(false)
const checking = ref(true)

const path = computed(() => {
  const name = route.name
  if (name === 'vod') return `/vod/${route.params.programName}/${route.params.part}`
  if (name === 'live') return `/live/${route.params.name}`
  if (name === 'category') return `/category/${route.params.slug}`
  if (name === 'search') return `/search?q=${route.query.q || ''}`
  if (name === 'apps') return '/download'
  return '/vod'
})

function detectProtocol() {
  const timer = setTimeout(() => {
    cleanup()
    checking.value = false
    protocolAvailable.value = false
  }, 800)

  function onVisibility() {
    if (document.hidden) {
      clearTimeout(timer)
      cleanup()
      checking.value = false
      protocolAvailable.value = true
    }
  }

  function onBlur() {
    clearTimeout(timer)
    cleanup()
    checking.value = false
    protocolAvailable.value = true
  }

  function cleanup() {
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('blur', onBlur)
  }

  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('blur', onBlur)

  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = 'itvt://'
  document.body.appendChild(iframe)
  setTimeout(() => iframe.remove(), 100)
}

onMounted(() => {
  if (navigator.userAgent.indexOf('iTVT Desktop App') !== -1) {
    checking.value = false
    return
  }
  detectProtocol()
})

function openApp() {
  window.location.href = 'itvt://open?path=' + encodeURIComponent(path.value)
  setTimeout(() => {
    if (!document.hidden) {
      window.location.href = 'https://desktop-app.itvt.xyz/apps?path=' + encodeURIComponent(path.value)
    }
  }, 1500)
}
</script>

<template>
  <div v-if="!checking && protocolAvailable" class="deeplink-bar">
    <span class="deeplink-text">
      Otwórz w aplikacji iTVT
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    </span>
    <button class="deeplink-btn" @click="openApp">Otwórz</button>
  </div>
</template>

<style scoped>
.deeplink-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px var(--space-md);
  background: #1D4ED8;
  color: #fff;
  z-index: 99998;
  font-size: 14px;
}

.deeplink-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.deeplink-btn {
  flex-shrink: 0;
  padding: 8px 18px;
  border: none;
  border-radius: var(--radius);
  background: #fff;
  color: #1D4ED8;
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.2s;
}

.deeplink-btn:hover {
  filter: brightness(0.9);
}

@media (max-width: 768px) {
  .deeplink-bar {
    padding: 8px var(--space-sm);
    font-size: 13px;
  }

  .deeplink-btn {
    padding: 6px 14px;
    font-size: 13px;
  }
}
</style>
