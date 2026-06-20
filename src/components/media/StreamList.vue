<script setup lang="ts">
import { computed } from 'vue'
import { useStreamStore } from '../../stores/streamStore'
import StreamCard from './StreamCard.vue'

const store = useStreamStore()

const visibleChannels = computed(() =>
  store.tvChannels.filter(ch => ch.name !== 'itvt-now')
)
</script>

<template>
  <section v-if="visibleChannels.length" class="grid">
    <StreamCard
      v-for="channel in visibleChannels"
      :key="channel.id"
      :channel="channel"
    />
  </section>
  <p v-else class="empty">Brak dostępnych kanałów</p>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
}

.empty {
  text-align: center;
  color: var(--light-grey);
  font-size: 16px;
  padding: var(--space-lg);
  margin: 0;
}
</style>
