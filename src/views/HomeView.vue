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
    title: 'Informacje ogólne',
    content: 'Niniejsza Polityka Prywatności określa zasady przetwarzania danych osobowych użytkowników serwisu iTVT zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).<br/><br/><strong>Data obowiązywania:</strong> 16.01.2026',
  },
  {
    title: '1. Administrator danych',
    content: 'Administratorem danych osobowych jest właściciel serwisu iTVT – Telewizja Internetowa.<br/>Kontakt w sprawach danych osobowych: <a href="mailto:kontakt@itvt.xyz" class="inline-link">kontakt@itvt.xyz</a>',
  },
  {
    title: '2. Zakres przetwarzanych danych',
    content: 'Przetwarzane mogą być: adresy IP, dane zawarte w formularzu kontaktowym (np. imię, adres e-mail), dane statystyczne i techniczne (przeglądarka, system, czas wizyty), dane zawarte w plikach cookies.<br/><br/>Podanie danych jest dobrowolne, ale może być konieczne do korzystania z wybranych funkcji serwisu.',
  },
  {
    title: '3. Cele i podstawy prawne',
    content: 'Dane przetwarzane są w celu:<br/>– świadczenia usług drogą elektroniczną – art. 6 ust. 1 lit. b RODO,<br/>– kontaktu z użytkownikiem – art. 6 ust. 1 lit. a lub b RODO,<br/>– realizacji obowiązków prawnych – art. 6 ust. 1 lit. c RODO,<br/>– analiz statystycznych i poprawy działania serwisu – art. 6 ust. 1 lit. f RODO,<br/>– zapewnienia bezpieczeństwa – art. 6 ust. 1 lit. f RODO.',
  },
  {
    title: '4. Odbiorcy danych',
    content: 'Dane mogą być przekazywane podmiotom wspierającym działanie serwisu (np. hosting, serwery, dostawcy IT), wyłącznie na podstawie umów powierzenia przetwarzania danych.<br/><br/>Dane nie są przekazywane poza Unię Europejską, chyba że dostawca usług zapewnia odpowiedni stopień ochrony danych.',
  },
  {
    title: '5. Okres przechowywania danych',
    content: 'Dane przechowywane są:<br/>– przez czas trwania korzystania z serwisu,<br/>– do momentu cofnięcia zgody,<br/>– przez okres wymagany przepisami prawa,<br/>– do czasu przedawnienia ewentualnych roszczeń.',
  },
  {
    title: '6. Prawa użytkownika',
    content: 'Użytkownik ma prawo do: dostępu do danych, ich sprostowania, usunięcia („prawo do bycia zapomnianym”), ograniczenia przetwarzania, przenoszenia danych, wniesienia sprzeciwu, cofnięcia zgody w dowolnym momencie.',
  },
  {
    title: '7. Pliki cookies',
    content: 'Serwis wykorzystuje pliki cookies w celu: prawidłowego działania strony, analizy statystyk, poprawy jakości usług.<br/><br/>Użytkownik może samodzielnie zarządzać cookies w ustawieniach przeglądarki.',
  },
  {
    title: '8. Zabezpieczenia danych',
    content: 'Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające ochronę danych osobowych.',
  },
  {
    title: '9. Zmiany polityki prywatności',
    content: 'Polityka może być aktualizowana. Aktualna wersja jest zawsze dostępna w serwisie.',
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
