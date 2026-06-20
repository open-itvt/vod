<script setup lang="ts">
defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div class="unavailable-overlay">
      <div class="unavailable-card">
        <div class="unavailable-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 class="unavailable-title">Kanał będzie dostępny niebawem</h2>
        <p class="unavailable-text">
          Prosimy sprawdzać aktualizacje na naszych social mediach.
        </p>
        <div class="unavailable-socials">
          <a href="https://facebook.com" target="_blank" class="social-link" aria-label="Facebook">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://x.com" target="_blank" class="social-link" aria-label="X (Twitter)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://instagram.com" target="_blank" class="social-link" aria-label="Instagram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>
        <button class="unavailable-btn" @click="$emit('close')">Rozumiem</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.unavailable-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100002;
  padding: var(--space-md);
}

.unavailable-card {
  background: var(--secondary-dark);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius);
  padding: var(--space-lg);
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  text-align: center;
}

.unavailable-icon {
  color: var(--highlight-red);
}

.unavailable-title {
  font-size: var(--h2-size);
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
}

.unavailable-text {
  font-size: var(--program-desc-size);
  color: var(--light-grey);
  margin: 0;
  line-height: 1.6;
}

.unavailable-socials {
  display: flex;
  gap: var(--space-md);
}

.social-link {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.06);
  color: var(--light-grey);
  transition: all 0.2s;
}

.social-link:hover {
  background: var(--highlight-red);
  color: var(--pure-white);
}

.unavailable-btn {
  width: 100%;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius);
  background: var(--highlight-red);
  color: var(--pure-white);
  font-family: var(--font-family);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s;
}

.unavailable-btn:hover {
  filter: brightness(0.85);
}
</style>
