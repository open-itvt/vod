<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  window.location.href = 'https://hub.itvt.xyz/static/android'
})
</script>

<template>
  <main class="other-page">
    <p class="redirect-info">Przekierowywanie...</p>
  </main>
</template>

<style scoped>
.other-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.redirect-info {
  font-size: var(--program-desc-size);
  color: var(--light-grey);
}
</style>
