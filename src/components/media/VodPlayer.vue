<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  videoName: string
  claimId: string
}>()

const loaded = ref(false)
</script>

<template>
  <div class="embed-wrap">
    <div v-if="!loaded" class="embed-loader" />
    <iframe
      width="100%"
      height="100%"
      :src="`https://odysee.com/$/embed/${videoName}/${claimId}`"
      class="odysee-iframe"
      :class="{ loaded }"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowfullscreen
      title="Media Embed"
      @load="loaded = true"
    />
  </div>
</template>

<style scoped>
.embed-wrap {
  position: relative;
  padding-bottom: 56.25%;
  width: 100%;
  background: #000;
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
    linear-gradient(#15bf7a 50%,#0000 0),
    linear-gradient(#0000 50%,#15bf7a 0),
    linear-gradient(#15bf7a 50%,#0000 0),
    linear-gradient(#0000 50%,#15bf7a 0),
    linear-gradient(#15bf7a 50%,#0000 0),
    linear-gradient(#0000 50%,#15bf7a 0)
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

.odysee-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 2;
}

.odysee-iframe.loaded {
  opacity: 1;
}
</style>
