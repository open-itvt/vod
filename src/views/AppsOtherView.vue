<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const HUB_URL = 'https://hub.itvt.xyz/static/android'

onMounted(() => {
  window.location.href = HUB_URL
})

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
    <p class="redirect-info">Przekierowywanie do <a :href="HUB_URL" target="_blank">{{ HUB_URL }}</a>...</p>
  </main>
</template>

<style scoped>
.other-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  gap: var(--space-md);
}

.back-btn {
  position: absolute;
  top: var(--space-md);
  left: var(--space-md);
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
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.redirect-info {
  font-size: var(--program-desc-size);
  color: var(--light-grey);
  text-align: center;
}

.redirect-info a {
  color: var(--highlight-red);
}
</style>
