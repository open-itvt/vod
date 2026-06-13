<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useStreamStore } from './stores/streamStore'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import FirstLoadPopup from './components/FirstLoadPopup.vue'
import WelcomePopup from './components/WelcomePopup.vue'
import DeepLinkPrompt from './components/DeepLinkPrompt.vue'
import router from './router'

const route = useRoute()
const store = useStreamStore()
const routeLoading = ref(false)
const welcomeDone = ref(false)

router.beforeEach(() => {
  routeLoading.value = true
})

router.afterEach(() => {
  routeLoading.value = false
})

onMounted(() => {
  store.loadVodItems()
})

function showFooter() {
  return route.name !== 'live'
}
</script>

<template>
  <WelcomePopup @done="welcomeDone = true" />
  <FirstLoadPopup v-if="welcomeDone" />
  <div class="route-loader" :class="{ active: routeLoading }" />
  <AppHeader />
  <RouterView />
  <DeepLinkPrompt v-if="showFooter()" />
  <AppFooter v-if="showFooter()" />
</template>

<style>
.route-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #0F0F11;
  z-index: 99999;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.route-loader::after {
  content: '';
  display: block;
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, #A81414, #15bf7a);
  border-radius: 0 2px 2px 0;
  animation: routeLoad 1s ease infinite;
}

.route-loader.active {
  opacity: 1;
}

@keyframes routeLoad {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
</style>
