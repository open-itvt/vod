<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStreamStore } from '../stores/streamStore'

const route = useRoute()
const router = useRouter()
const store = useStreamStore()

const sortBy = ref<'name' | 'date'>('name')
const sortDir = ref<'asc' | 'desc'>('asc')

const slug = computed(() => route.params.slug as string)

const FEATURED_SLUGS = ['itvt', 'oliwier-stream', 'retro-time']

const isAll = computed(() => slug.value === 'all')
const isOther = computed(() => slug.value === 'other')

const category = computed(() => {
  if (isAll.value) return { name: 'Wszystkie kategorie', slug: 'all' }
  if (isOther.value) return { name: 'Inne', slug: 'other' }
  return store.categories.find(c => c.slug === slug.value) ?? null
})

const otherCategories = computed(() =>
  store.categories.filter(c => !FEATURED_SLUGS.includes(c.slug))
)

const items = computed(() => {
  if (isOther.value) return []
  if (!category.value) return []

  let results = isAll.value
    ? store.vodItems.map(v => ({ ...v, type: 'vod' as const }))
    : store.itemsByCategory(category.value.name)

  results.sort((a, b) => {
    let cmp = 0
    if (sortBy.value === 'name') {
      cmp = a.title.localeCompare(b.title)
    } else if (sortBy.value === 'date') {
      cmp = a.releaseTime - b.releaseTime
    }
    return sortDir.value === 'asc' ? cmp : -cmp
  })

  return results
})

function setSort(field: 'name' | 'date') {
  if (sortBy.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDir.value = field === 'name' ? 'asc' : 'desc'
  }
}

function goToItem(item: { programSlug: string; part: number }) {
  router.push(`/vod/${item.programSlug}/${item.part}?ref=` + encodeURIComponent(route.fullPath))
}
</script>

<template>
  <main class="category-page">
    <template v-if="category && !isOther">
      <h1 class="page-heading">{{ category.name }}</h1>

      <div class="filter-bar">
        <div class="sort-group">
          <button
            class="filter-btn"
            :class="{ active: sortBy === 'name' }"
            @click="setSort('name')"
          >Nazwa {{ sortBy === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : '' }}</button>
          <button
            class="filter-btn"
            :class="{ active: sortBy === 'date' }"
            @click="setSort('date')"
          >Data {{ sortBy === 'date' ? (sortDir === 'asc' ? '▲' : '▼') : '' }}</button>
        </div>
      </div>

      <p class="item-count">Liczba wyników: {{ items.length }}</p>

      <div class="items-grid">
        <article
          v-for="item in items"
          :key="item.id"
          class="item-card"
          @click="goToItem(item)"
        >
          <div class="item-card-body">
            <img
              :src="item.thumbnailUrl"
              :alt="item.title"
              class="item-thumb"
              loading="lazy"
            />
            <h3 class="item-title">{{ item.title }}</h3>
            <p class="item-program">{{ item.programName }}</p>
            <span v-if="item.part" class="item-meta">Część {{ item.part }}</span>
          </div>
        </article>
      </div>

      <p v-if="!items.length" class="empty">Brak wyników</p>
    </template>

    <template v-else-if="isOther">
      <h1 class="page-heading">Inne kategorie</h1>
      <p class="item-count">Pozostałe kategorie ({{ otherCategories.length }})</p>
      <div class="other-grid">
        <router-link
          v-for="cat in otherCategories"
          :key="cat.slug"
          :to="`/category/${cat.slug}`"
          class="other-card"
        >
          <div class="other-thumb">
            <span class="other-fallback">iTVT</span>
          </div>
          <span class="other-name">{{ cat.name }}</span>
        </router-link>
      </div>
      <p v-if="!otherCategories.length" class="empty">Brak innych kategorii</p>
    </template>

    <p v-else class="empty">Nie znaleziono kategorii</p>
  </main>
</template>

<style scoped>
.category-page {
  flex: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.page-heading {
  font-size: var(--h1-size);
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
  text-align: left;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-md);
}

.sort-group {
  display: flex;
  gap: 4px;
}

.filter-btn {
  padding: 6px 14px;
  border: 1px solid var(--light-grey);
  border-radius: var(--radius);
  background: transparent;
  color: var(--light-grey);
  font-family: var(--font-family);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn.active {
  background: var(--highlight-red);
  border-color: var(--highlight-red);
  color: var(--pure-white);
}

.item-count {
  font-size: var(--meta-size);
  color: var(--light-grey);
  margin: 0;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-md);
}

.item-card {
  padding: var(--space-md);
  background: var(--primary-dark);
  border-radius: var(--radius);
  cursor: pointer;
  transition: filter 0.2s;
}

.item-card:hover {
  filter: brightness(1.1);
}

.item-card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: calc(var(--radius) - 2px);
  margin-bottom: var(--space-sm);
}

.item-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
}

.item-program {
  font-size: var(--program-desc-size);
  color: var(--light-grey);
  margin: 0;
}

.item-meta {
  font-size: var(--meta-size);
  color: var(--disabled-grey);
}

.empty {
  text-align: center;
  color: var(--light-grey);
  padding: var(--space-lg);
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-md);
}

.other-card {
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

.other-card:hover {
  filter: brightness(1.1);
}

.other-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--secondary-dark);
  border-radius: calc(var(--radius) - 2px);
}

.other-fallback {
  font-size: 24px;
  font-weight: 700;
  color: #0EA5E9;
  letter-spacing: 2px;
}

.other-name {
  font-size: var(--channel-title-size);
  font-weight: 600;
  color: var(--pure-white);
  text-align: center;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr;
  }

  .other-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
