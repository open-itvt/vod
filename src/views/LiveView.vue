<script setup lang="ts">
import { computed, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const openUnavailablePopup = inject<() => void>('openUnavailablePopup')

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
    <iframe
      v-if="playerUrl"
      :src="playerUrl"
      class="live-iframe"
      allow="autoplay; encrypted-media; fullscreen"
      sandbox="allow-scripts allow-same-origin allow-forms"
      referrerpolicy="no-referrer"
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

.live-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
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
