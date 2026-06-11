<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary'
  label: string
}>()
</script>

<template>
  <button :class="['btn', variant ?? 'primary']">
    {{ label }}
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius);
  font-family: var(--font-family);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary {
  background: var(--highlight-red);
  color: var(--pure-white);
}

.primary:hover {
  filter: brightness(0.85);
}

.secondary {
  background: transparent;
  color: var(--pure-white);
  border: 1px solid var(--light-grey);
}

.secondary:hover {
  border-color: var(--pure-white);
}
</style>
