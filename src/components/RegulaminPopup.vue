<script setup lang="ts">
defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div class="reg-overlay" @click.self="$emit('close')">
      <div class="reg-card">
        <h2 class="reg-title">Regulamin serwisu iVOD</h2>
        <p class="reg-date">Ważny od: 16.01.2026</p>

        <div class="reg-body">
          <p><strong>§1.</strong> Serwis iTVT jest telewizją internetową, o tematyce: technologii, newsów, muzyki, streamerów.</p>
          <p><strong>§2.</strong> iTVT jest ogólnodostępnym, darmowym oraz otwarto źródłowym projektem.</p>
          <p><strong>§3.</strong> Polityka prywatności serwisu znajduje się w zakładce Prywatność.</p>
          <p><strong>§4.</strong> Twórcy, którzy występują podczas programów w trakcie transmisji oraz powtórek, wyrazili zgodę na publikowanie.</p>
          <p><strong>§5.</strong> Wszelkie wstawki oraz utwory muzyczne używane przez iTVT podczas transmisji są naszego wykonania, a wszelkie użycie ich bez zgody właścicieli zostanie skutecznie udaremnione.</p>
          <p><strong>§6.</strong> Regulamin może się zmienić w każdym momencie i będzie zawsze dostępny w serwisie.</p>
        </div>

        <button class="reg-btn" @click="$emit('close')">Zamknij</button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.reg-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100003;
  padding: var(--space-md);
}

.reg-card {
  background: var(--secondary-dark);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius);
  padding: var(--space-lg);
  max-width: 560px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.reg-title {
  font-size: var(--h2-size);
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
}

.reg-date {
  font-size: var(--meta-size);
  color: var(--light-grey);
  margin: 0;
}

.reg-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.reg-body p {
  font-size: var(--program-desc-size);
  color: var(--light-grey);
  margin: 0;
  line-height: 1.6;
}

.reg-body strong {
  color: var(--pure-white);
}

.reg-btn {
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

.reg-btn:hover {
  filter: brightness(0.85);
}
</style>
