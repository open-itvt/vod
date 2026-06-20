<script setup lang="ts">
import { ref, computed, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const openUnavailablePopup = inject<() => void>('openUnavailablePopup')
const loaded = ref(false)

const name = computed(() => route.params.name as string)

const playerUrl = computed(() => {
  if (!name.value) return null
  return `https://player-itv.itvt.xyz/channels/${name.value}`
})

const backPath = computed(() => (route.query.ref as string) || '/')

onMounted(() => {
  if (name.value === 'itvt-now') {
    openUnavailablePopup?.()
    router.replace(backPath.value)
  }
})

function goBack() {
  router.push(backPath.value)
}
</script>

<template>
  <div v-if="name !== 'itvt-now'" class="live-container">
    <div v-if="!loaded" class="live-loader" />
    <iframe
      v-if="playerUrl"
      :src="playerUrl"
      class="live-iframe"
      :class="{ loaded }"
      allow="autoplay; encrypted-media; fullscreen"
      sandbox="allow-scripts allow-same-origin allow-forms"
      referrerpolicy="no-referrer"
      @load="loaded = true"
    />
    <div class="live-overlay">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Powrót
      </button>
    </div>
  </div>
</template>

<style scoped>
.live-container {
  flex: 1;
  position: relative;
  background: #000;
}

.live-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 30px;
  background:
    linear-gradient(#A81414 50%,#0000 0),
    linear-gradient(#0000 50%,#A81414 0),
    linear-gradient(#A81414 50%,#0000 0),
    linear-gradient(#0000 50%,#A81414 0),
    linear-gradient(#A81414 50%,#0000 0),
    linear-gradient(#0000 50%,#A81414 0)
    #333;
  background-size: calc(100%/6 + 1px) 200%;
  background-repeat: no-repeat;
  border-radius: 6px;
  animation: l12 1.5s infinite;
  z-index: 1;
}

@keyframes l12 {
  0%     { background-position: calc(0*100%/5) 100%,calc(1*100%/5)   0%,calc(2*100%/5) 100%,calc(3*100%/5)   0%,calc(4*100%/5) 100%,calc(5*100%/5)   0% }
  16.67% { background-position: calc(0*100%/5)   0%,calc(1*100%/5)   0%,calc(2*100%/5) 100%,calc(3*100%/5)   0%,calc(4*100%/5) 100%,calc(5*100%/5)   0% }
  33.33% { background-position: calc(0*100%/5)   0%,calc(1*100%/5) 100%,calc(2*100%/5) 100%,calc(3*100%/5)   0%,calc(4*100%/5) 100%,calc(5*100%/5)   0% }
  50%    { background-position: calc(0*100%/5)   0%,calc(1*100%/5) 100%,calc(2*100%/5)   0%,calc(3*100%/5)   0%,calc(4*100%/5) 100%,calc(5*100%/5)   0% }
  66.67% { background-position: calc(0*100%/5)   0%,calc(1*100%/5) 100%,calc(2*100%/5)   0%,calc(3*100%/5) 100%,calc(4*100%/5) 100%,calc(5*100%/5)   0% }
  83.33% { background-position: calc(0*100%/5)   0%,calc(1*100%/5) 100%,calc(2*100%/5)   0%,calc(3*100%/5) 100%,calc(4*100%/5)   0%,calc(5*100%/5)   0% }
  100%   { background-position: calc(0*100%/5)   0%,calc(1*100%/5) 100%,calc(2*100%/5)   0%,calc(3*100%/5) 100%,calc(4*100%/5)   0%,calc(5*100%/5) 100% }
}

.live-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.live-iframe.loaded {
  opacity: 1;
}

.live-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: var(--space-md);
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%);
  pointer-events: none;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: var(--pure-white);
  padding: 8px 16px;
  border-radius: var(--radius);
  cursor: pointer;
  font-family: var(--font-family);
  font-size: 14px;
  pointer-events: auto;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255,255,255,0.1);
}
</style>
