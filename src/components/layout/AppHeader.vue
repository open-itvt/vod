<script setup lang="ts">
import { watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStreamStore } from '../../stores/streamStore'

const store = useStreamStore()
const router = useRouter()
const route = useRoute()
const prevRoute = ref('/')

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const searchOpen = ref(false)
const menuOpen = ref(false)
const searchInput = ref('')

watch(() => store.searchQuery, (query) => {
  if (debounceTimer) clearTimeout(debounceTimer)

  if (!query.trim()) {
    router.push(prevRoute.value)
    return
  }

  debounceTimer = setTimeout(() => {
    const target = '/search?q=' + encodeURIComponent(query.trim())
    if (route.fullPath === target) return
    if (route.name !== 'search') {
      prevRoute.value = route.fullPath
    }
    router.push(target)
  }, 300)
})

function doSearch(query: string) {
  if (!query.trim()) return
  store.searchQuery = query
  searchOpen.value = false
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="header">
    <router-link to="/" class="logo">iVOD</router-link>

    <div class="search-wrap">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
      <input
        v-model="store.searchQuery"
        class="search"
        type="text"
        placeholder="Szukaj, swoich ulubionych programów"
      />
    </div>

    <button class="mobile-search-btn" @click="searchOpen = true" aria-label="Szukaj">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    </button>

    <nav class="nav">
      <router-link class="nav-link" to="/">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
        Kanały TV
      </router-link>
      <router-link class="nav-link" to="/#kategorie">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
        Kategorie
      </router-link>
      <router-link class="nav-link" to="/#prywatnosc">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Prywatność
      </router-link>
      <router-link class="nav-link" to="/apps">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h4"/></svg>
        Aplikacje
      </router-link>
      <router-link class="nav-link" to="/#faq">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        FAQ
      </router-link>
    </nav>

    <button class="menu-btn" @click="menuOpen = !menuOpen" aria-label="Menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
    </button>
  </header>

  <!-- Mobile search popup -->
  <Teleport to="body">
    <Transition name="search">
      <div v-if="searchOpen" class="search-overlay" @click.self="searchOpen = false">
        <div class="search-popup">
          <input
            ref="mobileSearchInput"
            v-model="searchInput"
            class="search-popup-input"
            type="text"
            placeholder="Szukaj, swoich ulubionych programów"
            @keydown.enter="doSearch(searchInput)"
          />
          <div class="search-popup-actions">
            <button class="search-popup-btn primary" @click="doSearch(searchInput)">Szukaj</button>
            <button class="search-popup-btn" @click="searchOpen = false">Anuluj</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Mobile menu drawer -->
  <Teleport to="body">
    <div v-if="menuOpen" class="menu-overlay" @click.self="closeMenu">
      <aside class="menu-drawer">
        <button class="menu-close" @click="closeMenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <nav class="drawer-nav">
          <router-link class="drawer-link" to="/" @click="closeMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
            Kanały TV
          </router-link>
          <router-link class="drawer-link" to="/#kategorie" @click="closeMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
            Kategorie
          </router-link>
          <router-link class="drawer-link" to="/#prywatnosc" @click="closeMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Prywatność
          </router-link>
          <router-link class="drawer-link" to="/apps" @click="closeMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h4"/></svg>
            Aplikacje
          </router-link>
          <router-link class="drawer-link" to="/#faq" @click="closeMenu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            FAQ
          </router-link>
        </nav>
      </aside>
    </div>
  </Teleport>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  gap: var(--space-md);
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--pure-white);
  white-space: nowrap;
  text-decoration: none;
}

.search-wrap {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 10px;
  color: var(--light-grey);
  opacity: 0.55;
  pointer-events: none;
  transform: scaleX(-1);
}

.search {
  width: 100%;
  padding: 10px 12px 10px 34px;
  background: var(--secondary-dark);
  border: none;
  border-radius: var(--radius);
  color: var(--pure-white);
  font-family: var(--font-family);
  font-size: 14px;
  outline: none;
}

.search::placeholder {
  color: var(--light-grey);
}

.mobile-search-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--pure-white);
  cursor: pointer;
  padding: 4px;
}

.nav {
  display: flex;
  gap: var(--space-md);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--pure-white);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--light-grey);
}

.menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--pure-white);
  cursor: pointer;
  padding: 4px;
}

/* Search popup (mobile) */
.search-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 17, 0.95);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
  z-index: 10000;
}

.search-popup {
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.search-popup-input {
  width: 100%;
  padding: 14px 16px;
  background: var(--secondary-dark);
  border: none;
  border-radius: var(--radius);
  color: var(--pure-white);
  font-family: var(--font-family);
  font-size: 16px;
  outline: none;
}

.search-popup-input::placeholder {
  color: var(--light-grey);
}

.search-popup-actions {
  display: flex;
  gap: var(--space-sm);
}

.search-popup-btn {
  flex: 1;
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--light-grey);
  background: transparent;
  color: var(--light-grey);
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.search-popup-btn.primary {
  background: var(--highlight-red);
  border-color: var(--highlight-red);
  color: var(--pure-white);
}

.search-popup-btn.primary:hover {
  filter: brightness(0.85);
}

/* Search popup transition */
.search-enter-active {
  transition: opacity 0.25s ease;
}

.search-leave-active {
  transition: opacity 0.15s ease;
}

.search-enter-from,
.search-leave-to {
  opacity: 0;
}

.search-enter-active .search-popup {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.search-leave-active .search-popup {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.search-enter-from .search-popup,
.search-leave-to .search-popup {
  transform: translateY(-20px);
  opacity: 0;
}

/* Menu drawer (mobile) */
.menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 15, 17, 0.6);
  z-index: 10000;
}

.menu-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 280px;
  background: var(--primary-dark);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  animation: slideIn 0.25s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.menu-close {
  align-self: flex-end;
  background: transparent;
  border: none;
  color: var(--pure-white);
  cursor: pointer;
  padding: 4px;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--pure-white);
  text-decoration: none;
  font-size: 16px;
  padding: 8px 0;
  transition: color 0.2s;
}

.drawer-link:hover {
  color: var(--light-grey);
}

@media (max-width: 768px) {
  .header {
    flex-wrap: nowrap;
    padding: var(--space-sm) var(--space-md);
  }

  .search-wrap {
    display: none;
  }

  .nav {
    display: none;
  }

  .mobile-search-btn {
    display: flex;
  }

  .menu-btn {
    display: flex;
  }
}
</style>
