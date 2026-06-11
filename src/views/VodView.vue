<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStreamStore } from '../stores/streamStore'
import VodPlayer from '../components/media/VodPlayer.vue'

const route = useRoute()
const router = useRouter()
const store = useStreamStore()

const programSlug = computed(() => route.params.programName as string)
const part = computed(() => Number(route.params.part))

const item = computed(() =>
  store.vodItems.find(
    v => v.programSlug === programSlug.value && v.part === part.value
  )
)

const backPath = computed(() => (route.query.ref as string) || '/')

function goBack() {
  router.push(backPath.value)
}
</script>

<template>
  <main class="vod-page">
    <template v-if="item">
      <button class="back-btn" @click="goBack">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Powrót
      </button>
      <h1 class="vod-title">{{ item.title }}</h1>
      <p class="vod-meta">{{ item.programName }}<template v-if="item.part"> — Część {{ item.part }}</template></p>
      <div class="player-wrap">
        <VodPlayer :video-name="item.videoName" :claim-id="item.claimId" />
      </div>
      <p v-if="item.date" class="vod-date">Data emisji: {{ item.date }}</p>
    </template>
    <p v-else class="not-found">Nie znaleziono VOD</p>
  </main>
</template>

<style scoped>
.vod-page {
  flex: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  text-align: center;
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
  align-self: flex-start;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255,255,255,0.1);
}

.vod-title {
  font-size: var(--h1-size);
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
}

.vod-meta {
  font-size: var(--program-desc-size);
  color: var(--light-grey);
  margin: 0;
}

.player-wrap {
  width: 100%;
  max-width: 960px;
  border-radius: var(--radius);
  overflow: hidden;
}

.vod-date {
  font-size: var(--meta-size);
  color: var(--disabled-grey);
  margin: 0;
}

.not-found {
  text-align: center;
  color: var(--light-grey);
  padding: var(--space-lg);
}
</style>
