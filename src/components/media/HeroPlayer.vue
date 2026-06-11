<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStreamStore } from '../../stores/streamStore'
import BaseButton from '../common/BaseButton.vue'

const router = useRouter()
const route = useRoute()
const store = useStreamStore()
const currentIndex = ref(0)
const slideDir = ref<'left' | 'right'>('right')

const currentChannel = computed(() =>
  store.channels[currentIndex.value] ?? null
)

const visibleChannels = computed(() => {
  const len = store.channels.length
  if (len === 0) return []
  const prev = store.channels[(currentIndex.value - 1 + len) % len]
  const curr = store.channels[currentIndex.value]
  const next = store.channels[(currentIndex.value + 1) % len]
  return [prev, curr, next]
})

function switchTo(index: number) {
  const len = store.channels.length
  let diff = index - currentIndex.value
  if (diff > len / 2) diff -= len
  if (diff < -len / 2) diff += len
  slideDir.value = diff > 0 ? 'right' : 'left'
  currentIndex.value = index
}

function goLive(channel: any) {
  router.push('/live/' + channel.name + '?ref=' + encodeURIComponent(route.fullPath))
}

function goPrev() {
  const len = store.channels.length
  const prev = (currentIndex.value - 1 + len) % len
  slideDir.value = 'left'
  currentIndex.value = prev
}

function goNext() {
  const len = store.channels.length
  const next = (currentIndex.value + 1) % len
  slideDir.value = 'right'
  currentIndex.value = next
}

function clickCard(channel: any, idx: number) {
  if (idx === 1) {
    goLive(channel)
    return
  }
  if (idx === 0) goPrev()
  else goNext()
}
</script>

<template>
  <section class="hero">
    <div class="carousel-wrap">
      <button class="carousel-arrow carousel-arrow--left" aria-label="Poprzedni" @click="goPrev">‹</button>

      <!-- Desktop 3-card carousel -->
      <div class="carousel carousel-desktop">
        <article
          v-for="(channel, idx) in visibleChannels"
          :key="channel.id"
          class="card-wrap"
          :class="{ center: idx === 1 }"
          @click="clickCard(channel, idx)"
        >
          <template v-if="idx === 1">
            <div class="card-body card-body--center">
              <span class="card-header-title">{{ channel.title }}</span>
              <svg class="play-icon" width="48" height="48" viewBox="0 0 24 24" fill="var(--pure-white)">
                <polygon points="6,3 20,12 6,21" />
              </svg>
              <BaseButton variant="primary" label="Watch live" />
            </div>
          </template>
          <template v-else>
            <div class="card-body card-body--side">
              <span class="card-side-title">{{ channel.title }}</span>
            </div>
          </template>
          <p class="card-event">{{ channel.programName }}</p>
        </article>
      </div>

      <!-- Mobile single-card carousel -->
      <div class="carousel carousel-mobile">
        <article :key="currentChannel?.id" class="card-mobile" :class="'slide-' + slideDir">
          <div class="card-body card-body--center" v-if="currentChannel">
            <span class="card-header-title">{{ currentChannel.title }}</span>
            <svg class="play-icon" width="48" height="48" viewBox="0 0 24 24" fill="var(--pure-white)">
              <polygon points="6,3 20,12 6,21" />
            </svg>
            <BaseButton variant="primary" label="Watch live" @click="goLive(currentChannel)" />
          </div>
          <p class="card-event" v-if="currentChannel">{{ currentChannel.programName }}</p>
        </article>
      </div>

      <button class="carousel-arrow carousel-arrow--right" aria-label="Następny" @click="goNext">›</button>
    </div>
    <div class="dots">
      <button
        v-for="(_, i) in store.channels"
        :key="i"
        class="dot"
        :class="{ active: i === currentIndex }"
        @click="switchTo(i)"
      />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
}

.carousel-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  width: 100%;
}

.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  height: 400px;
  flex: 1;
  min-width: 0;
}

.card-wrap {
  flex: 1 1 0;
  min-width: 0;
  cursor: pointer;
  z-index: 1;
  position: relative;
  transition: transform 0.45s ease, opacity 0.45s ease;
}

.card-wrap.center {
  z-index: 2;
  transform: scale(1.15);
}

.card-wrap:not(.center) {
  transform: scale(0.85);
  opacity: 0.6;
}

.card-wrap:not(.center):hover {
  opacity: 0.8;
}

.card-wrap.center:hover {
  filter: brightness(1.08);
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  margin-bottom: var(--space-sm);
  min-height: 200px;
  padding: var(--space-md);
}

.card-body--center {
  background: var(--secondary-dark);
  gap: var(--space-md);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-body--side {
  background: var(--primary-dark);
  gap: 0;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.card-header-title {
  font-size: var(--channel-title-size);
  color: var(--light-grey);
  text-align: center;
}

.play-icon {
  flex-shrink: 0;
}

.card-side-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--light-grey);
  text-align: center;
}

.card-event {
  font-size: var(--meta-size);
  color: var(--disabled-grey);
  margin: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.carousel-mobile {
  display: none;
}

.dots {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
}

.carousel-arrow {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--light-grey);
  background: transparent;
  color: var(--pure-white);
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.carousel-arrow:hover {
  background: var(--highlight-red);
  border-color: var(--highlight-red);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: var(--disabled-grey);
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
}

.dot.active {
  background: var(--highlight-red);
}

@keyframes slideInRight {
  from { transform: translateX(60px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes slideInLeft {
  from { transform: translateX(-60px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@media (max-width: 768px) {
  .carousel-wrap {
    gap: 0;
  }

  .carousel-desktop {
    display: none;
  }

  .carousel-mobile {
    display: block;
    flex: 1;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-mobile {
    width: 100%;
    cursor: pointer;
  }

  .card-mobile.slide-right {
    animation: slideInRight 0.3s ease;
  }

  .card-mobile.slide-left {
    animation: slideInLeft 0.3s ease;
  }

  .carousel-arrow {
    width: 32px;
    height: 32px;
    font-size: 20px;
    z-index: 3;
  }
}
</style>
