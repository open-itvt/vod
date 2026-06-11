<script setup lang="ts">
defineProps<{
  videoName: string
  claimId: string
}>()
</script>

<template>
  <div class="embed-wrap">
    <iframe
      width="100%"
      height="100%"
      :src="`https://odysee.com/$/embed/${videoName}/${claimId}`"
      class="odysee-iframe"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowfullscreen
      title="Media Embed"
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

.odysee-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
