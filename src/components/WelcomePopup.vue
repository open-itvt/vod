<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{ done: [] }>()

const showPopup = ref(false)
const COOKIE_NAME = 'iVodRel'
const COOKIE_VALUE = '1.0.0'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

onMounted(() => {
  if (getCookie(COOKIE_NAME) !== COOKIE_VALUE) {
    showPopup.value = true
  }
})

function handleClose() {
  setCookie(COOKIE_NAME, COOKIE_VALUE, 365)
  showPopup.value = false
  emit('done')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="welcome">
      <div v-if="showPopup" class="welcome-overlay">
        <div class="welcome-card">
          <div class="welcome-badge">Nowość</div>
          <h1 class="welcome-title">Witaj w nowej aplikacji iVOD!</h1>
          <p class="welcome-sub">
            Od teraz będziesz mieć łatwiejszy dostęp do treści na żądanie (VOD) wraz z integracją z Odysee.
          </p>

          <div class="welcome-features">
            <div class="feature">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </div>
              <div class="feature-text">
                <strong>VOD na żądanie</strong>
                <span>Oglądaj nagrania programów z kanałów iTVT Group w dowolnym momencie</span>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div class="feature-text">
                <strong>Integracja z Odysee</strong>
                <span>Treści VOD pobierane bezpośrednio z platformy Odysee — zawsze aktualne</span>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="feature-text">
                <strong>Kanały TV na żywo</strong>
                <span>Oglądaj transmisje z naszych kanałów na żywo</span>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
              </div>
              <div class="feature-text">
                <strong>Wyszukiwarka treści</strong>
                <span>Szybkie znajdowanie ulubionych programów i kanałów</span>
              </div>
            </div>
            <div class="feature">
              <div class="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
              </div>
              <div class="feature-text">
                <strong>Kategorie i playlisty</strong>
                <span>Treści posegregowane w kategoriach</span>
              </div>
            </div>
          </div>

          <div class="welcome-optimizations">
            <h3 class="opt-title">Optymalizacje</h3>
            <ul class="opt-list">
              <li>Szybkie ładowanie — strona uruchamia się w ułamku sekundy</li>
              <li>Tryb ciemny — przyjazny dla oczu interfejs przez cały dzień</li>
              <li>Responsywność — w pełni działająca wersja mobilna i desktopowa</li>
              <li>Cache danych VOD — aktualizacja co 12 godzin bez spowalniania aplikacji</li>
              <li>Lekka i nowoczesna technologia Vite + Vue 3 + Pinia</li>
            </ul>
          </div>

          <button class="welcome-btn" @click="handleClose">Rozumiem, zaczynajmy!</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.welcome-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 100001;
  padding: var(--space-lg);
  overflow-y: auto;
}

.welcome-card {
  background: var(--secondary-dark);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius);
  padding: var(--space-lg);
  max-width: 560px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-top: 40px;
  margin-bottom: 40px;
}

.welcome-badge {
  align-self: flex-start;
  padding: 4px 12px;
  border-radius: 20px;
  background: var(--highlight-red);
  color: var(--pure-white);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.welcome-title {
  font-size: var(--h1-size);
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
}

.welcome-sub {
  font-size: var(--program-desc-size);
  color: var(--light-grey);
  margin: 0;
  line-height: 1.6;
}

.welcome-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.feature {
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
}

.feature-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  background: rgba(168, 20, 20, 0.15);
  color: var(--highlight-red);
}

.feature-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.feature-text strong {
  font-size: 15px;
  color: var(--pure-white);
}

.feature-text span {
  font-size: var(--meta-size);
  color: var(--light-grey);
  line-height: 1.5;
}

.welcome-optimizations {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.opt-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--pure-white);
  margin: 0;
}

.opt-list {
  margin: 0;
  padding-left: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.opt-list li {
  font-size: var(--meta-size);
  color: var(--light-grey);
  line-height: 1.5;
}

.welcome-btn {
  padding: 14px 24px;
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

.welcome-btn:hover {
  filter: brightness(0.85);
}

.welcome-enter-active,
.welcome-leave-active {
  transition: opacity 0.35s ease;
}

.welcome-enter-from,
.welcome-leave-to {
  opacity: 0;
}
</style>
