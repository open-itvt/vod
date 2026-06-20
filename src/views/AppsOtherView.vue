<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

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
      <iframe
        src="https://hub.itvt.xyz/static/android"
        class="embed-iframe"
        allowfullscreen
        sandbox="allow-scripts allow-same-origin allow-forms"
        referrerpolicy="no-referrer"
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

.embed-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
