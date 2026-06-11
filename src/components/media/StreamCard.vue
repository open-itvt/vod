<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import type { Channel } from '../../stores/streamStore'

defineProps<{
  channel: Channel
}>()

const router = useRouter()
const route = useRoute()

function goLive(channel: Channel) {
  router.push('/live/' + channel.name + '?ref=' + encodeURIComponent(route.fullPath))
}
</script>

<template>
  <article class="card" @click="goLive(channel)">
    <h3 class="card-title">{{ channel.title }}</h3>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: channel.progress + '%' }" />
    </div>
    <p class="card-meta">{{ channel.timeRange }} — {{ channel.programName }}</p>
  </article>
</template>

<style scoped>
.card {
  padding: var(--space-md);
  background: var(--primary-dark);
  border-radius: var(--radius);
  cursor: pointer;
  transition: filter 0.2s ease;
}

.card:hover {
  filter: brightness(1.1);
}

.card-title {
  font-size: var(--channel-title-size);
  font-weight: 700;
  color: var(--pure-white);
  margin: 0 0 var(--space-sm);
}

.progress-bar {
  width: 100%;
  height: 3px;
  background: var(--secondary-dark);
  border-radius: 2px;
  margin-bottom: var(--space-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--highlight-red);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.card-meta {
  font-size: var(--meta-size);
  color: var(--light-grey);
  margin: 0;
}
</style>
