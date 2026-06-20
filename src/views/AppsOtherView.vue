<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loaded = ref(false)

function goBack() {
  router.push('/apps')
}
</script>

<template>
  <main class="other-page">
    <button class="back-btn" @click="goBack">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      Powrót do aplikacji
    </button>
    <div class="embed-wrap">
      <div v-if="!loaded" class="embed-loader" />
      <iframe
        src="https://hub.itvt.xyz/static/android"
        class="embed-iframe"
        :class="{ loaded }"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-forms"
        referrerpolicy="no-referrer"
        @load="loaded = true"
      />
    </div>
  </main>
</template>

<style scoped>
.other-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: var(--space-md);
  gap: var(--space-md);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--pure-white);
  padding: 8px 16px;
  border-radius: var(--radius);
  cursor: pointer;
  font-family: var(--font-family);
  font-size: 14px;
  align-self: flex-start;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.embed-wrap {
  flex: 1;
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
}

.embed-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 24px;
  background:
    linear-gradient(#1D4ED8 50%,#0000 0),
    linear-gradient(#0000 50%,#1D4ED8 0),
    linear-gradient(#1D4ED8 50%,#0000 0),
    linear-gradient(#0000 50%,#1D4ED8 0),
    linear-gradient(#1D4ED8 50%,#0000 0),
    linear-gradient(#0000 50%,#1D4ED8 0)
    #333;
  background-size: calc(100%/6 + 1px) 200%;
  background-repeat: no-repeat;
  border-radius: 4px;
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

.embed-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.embed-iframe.loaded {
  z-index: 2;
}
</style>
