<script setup lang="ts">
import { ref, computed } from 'vue'
import HeroPlayer from '../components/media/HeroPlayer.vue'
import StreamList from '../components/media/StreamList.vue'
import { useStreamStore } from '../stores/streamStore'

const store = useStreamStore()

const FEATURED_SLUGS = ['itvt', 'oliwier-stream', 'retro-time']

const featuredCategories = computed(() =>
  store.categories.filter(c => FEATURED_SLUGS.includes(c.slug))
)

function getThumbnail(catName: string): string {
  const vod = store.vodItems.find(v => v.programName === catName || v.title.includes(catName))
  return vod?.thumbnailUrl ?? ''
}

const openFaq = ref<number | null>(null)

function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
} 

const privacyItems = [
  {
    title: 'O nas',
    content: 'Jesteśmy serwisem streamingowym oferującym dostęp do kanałów iTVT Poland Group w czasie rzeczywistym.',
  },
  {
    title: 'Media',
    content: 'Podczas odtwarzania wideo dodatkowe dane mogą być pobierane na Twoje urządzenie i wysyłane do innych serwerów.',
  },
  {
    title: 'Cookies',
    content: 'Przeglądarka może używać plików cookies do prawidłowego wyświetlania wideo.',
  },
  {
    title: 'Osadzone treści z innych stron',
    content: 'Elementy na stronie mogą zawierać osadzone treści (np. wideo, obrazy, artykuły). Osadzone treści z innych stron zachowują się podobnie, jakby użytkownik odwiedził tę stronę bezpośrednio. Strony te mogą zbierać informacje o Tobie, używać cookies, dołączać dodatkowe systemy śledzenia i monitorować Twoje interakcje z osadzonym materiałem.',
  },
  {
    title: 'Jak długo przechowujemy Twoje dane?',
    content: 'Jeśli zostawisz komentarz lub napiszesz wiadomość e-mail, treść i metadane będą przechowywane bezterminowo. Pozwala nam to łatwo odpowiadać na Twoje wiadomości. Jeśli użytkownik zarejestrował się na naszej stronie, przechowujemy również dane osobowe wprowadzone w profilu. Każdy użytkownik może w każdej chwili przeglądać, poprawiać lub usuwać swoje dane osobowe (z wyjątkiem nazwy użytkownika).',
  },
  {
    title: 'Twoje prawa do danych',
    content: 'Jeśli masz konto użytkownika lub wysłałeś wiadomość przez formularz lub e-mail, możesz poprosić o plik z wyeksportowanymi danymi osobowymi, które posiadamy. Możesz również poprosić o usunięcie wszystkich swoich danych osobowych. Nie dotyczy to danych, które jesteśmy zobowiązani przechowywać ze względów administracyjnych, prawnych lub bezpieczeństwa.',
  },
  {
    title: 'Gdzie wysyłamy Twoje dane?',
    content: 'Twoje informacje, takie jak adres IP, wersja systemu i przeglądarki, mogą być wysyłane do administratora strony w celu optymalizacji i stabilności działania serwisu.',
  },
]

const faqItems = [
  { q: 'Czym jest iVOD?', a: 'Platforma streamingowa iTVT Group — oglądaj kanały TV na żywo oraz nagrania VOD w jednym miejscu.' },
  { q: 'Jak oglądać kanał TV?', a: 'Wybierz kanał z listy "Kanały TV" lub kliknij kartę w karuzeli, a następnie kliknij "Watch live".' },
  { q: 'Gdzie znajdę nagrania VOD?', a: 'Nagrania VOD znajdziesz w sekcji "Kategorie". Kliknij wybraną kategorię, a następnie wybierz interesujące Cię nagranie.' },
  { q: 'Jak wyszukiwać treści?', a: 'Użyj paska wyszukiwania u góry strony — wpisz frazę, a wyniki pojawią się automatycznie.' },
  { q: 'Czy mogę oglądać na telefonie?', a: 'Tak! Pobierz aplikację iTVT z: <a href="https://vod.itvt.xyz/apps" target="_blank" class="inline-link">vod.itvt.xyz/apps/</a>' },
  { q: 'Gdzie zgłosić problem?', a: 'Skontaktuj się z nami przez e-mail: <a href="mailto:kontakt@itvt.xyz" class="inline-link">kontakt@itvt.xyz</a>' },
]
</script>

<template>
  <main>
    <HeroPlayer />
    <h2 class="section-heading">Kanały TV</h2>
    <StreamList />

    <section id="kategorie" v-if="store.categories.length" class="categories-section">
      <h2 class="section-heading">Kategorie</h2>
      <div class="category-cards">
        <router-link
          v-for="cat in featuredCategories"
          :key="cat.slug"
          :to="`/category/${cat.slug}`"
          class="category-card"
        >
          <div class="cat-thumb">
            <img
              v-if="getThumbnail(cat.name)"
              :src="getThumbnail(cat.name)"
              :alt="cat.name"
              class="cat-img"
            />
            <span v-else class="cat-fallback">iTVT</span>
          </div>
          <span class="cat-name">{{ cat.name }}</span>
        </router-link>

        <router-link to="/category/other" class="category-card">
          <div class="cat-thumb">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--pure-white)" stroke="var(--pure-white)" stroke-width="2">
              <circle cx="12" cy="12" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="4" cy="12" r="2"/>
            </svg>
          </div>
          <span class="cat-name">Inne</span>
        </router-link>
      </div>
    </section>

    <section id="prywatnosc" class="timeline-section">
      <h2 class="section-heading">Prywatność</h2>
      <div class="timeline">
        <div
          v-for="(item, i) in privacyItems"
          :key="i"
          class="timeline-item"
        >
          <div class="timeline-dot">
            <div class="timeline-dot-inner" />
          </div>
          <div class="timeline-content">
            <h3 class="timeline-title">{{ item.title }}</h3>
            <p class="timeline-body" v-html="item.content"></p>
          </div>
        </div>
      </div>
    </section>

    <div class="section-spacer" />

    <section id="faq" class="accordion-section">
      <h2 class="section-heading">FAQ — Najczęściej zadawane pytania</h2>
      <div class="accordion">
        <div
          v-for="(item, i) in faqItems"
          :key="i"
          class="accordion-item"
        >
          <button class="accordion-header" @click="toggleFaq(i)">
            <span>{{ item.q }}</span>
            <svg
              class="accordion-arrow"
              :class="{ open: openFaq === i }"
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            ><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div v-show="openFaq === i" class="accordion-body" v-html="item.a"></div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  flex: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.section-heading {
  font-size: var(--h2-size);
  font-weight: 700;
  color: var(--light-grey);
  margin: 0;
  text-align: left;
}

.categories-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.category-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  background: var(--primary-dark);
  border-radius: var(--radius);
  text-decoration: none;
  transition: filter 0.2s;
}

.category-card:hover {
  filter: brightness(1.1);
}

.cat-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-dark);
  border-radius: calc(var(--radius) - 2px);
  overflow: hidden;
}

.cat-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cat-initial {
  display: none;
}

.cat-fallback {
  font-size: 28px;
  font-weight: 700;
  color: #0EA5E9;
  letter-spacing: 2px;
}

.cat-name {
  font-size: var(--channel-title-size);
  font-weight: 600;
  color: var(--pure-white);
  text-align: center;
}

/* Section spacer */
.section-spacer {
  height: var(--space-lg);
}

/* Timeline (Prywatność) */
.timeline-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  scroll-margin-top: 80px;
}

.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: 28px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 9px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--secondary-dark);
}

.timeline-item {
  position: relative;
  display: flex;
  gap: var(--space-md);
  padding-bottom: var(--space-lg);
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -28px;
  top: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-dot-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--highlight-red);
}

.timeline-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--pure-white);
  margin: 0;
}

.timeline-body {
  font-size: var(--program-desc-size);
  color: var(--light-grey);
  margin: 0;
  line-height: 1.6;
}

/* Accordion (FAQ) */
.accordion-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  scroll-margin-top: 80px;
}

.accordion {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--secondary-dark);
  border-radius: var(--radius);
  overflow: hidden;
}

.accordion-item {
  border-bottom: 1px solid var(--secondary-dark);
}

.accordion-item:last-child {
  border-bottom: none;
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  background: var(--primary-dark);
  border: none;
  color: var(--pure-white);
  font-family: var(--font-family);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}

.accordion-header:hover {
  background: var(--secondary-dark);
}

.accordion-arrow {
  flex-shrink: 0;
  transition: transform 0.2s;
  color: var(--light-grey);
}

.accordion-arrow.open {
  transform: rotate(180deg);
}

.accordion-body {
  padding: 0 var(--space-md) var(--space-md);
  font-size: var(--program-desc-size);
  color: var(--light-grey);
  line-height: 1.6;
}

:deep(.inline-link) {
  color: var(--highlight-red);
  text-decoration: none;
}

:deep(.inline-link:hover) {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .category-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
