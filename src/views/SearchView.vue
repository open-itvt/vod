<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStreamStore, type ContentType } from '../stores/streamStore'

const route = useRoute()
const router = useRouter()
const store = useStreamStore()

const sortBy = ref<'name' | 'date'>('name')
const sortDir = ref<'asc' | 'desc'>('asc')
const activeFilter = ref<ContentType | 'all'>('all')

const query = computed(() => (route.query.q as string) ?? '')

watch(query, (q) => {
  store.searchQuery = q
})

function itemSortValue(item: any): number | string {
  if (sortBy.value === 'name') return item.title.toLowerCase()
  return 'releaseTime' in item ? item.releaseTime : 0
}

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim()
  if (!q) return []

  let results = store.searchResults.filter(
    item => item.title.toLowerCase().includes(q) || item.programName.toLowerCase().includes(q)
  )

  if (activeFilter.value !== 'all') {
    results = results.filter(item => item.type === activeFilter.value)
  }

  results.sort((a, b) => {
    const va = itemSortValue(a)
    const vb = itemSortValue(b)
    let cmp: number
    if (typeof va === 'string' && typeof vb === 'string') {
      cmp = va.localeCompare(vb)
    } else {
      cmp = (va as number) - (vb as number)
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

const grouped = computed(() => {
  const groups: { label: string; key: string; items: typeof filtered.value }[] = [
    { label: 'Kanały TV', key: 'tv', items: [] },
    { label: 'Programy VOD', key: 'vod', items: [] },
  ]

  for (const item of filtered.value) {
    const g = groups.find(g => g.key === item.type)
    if (g) g.items.push(item)
  }

  return groups.filter(g => g.items.length)
})

function goToItem(item: any) {
  if (item.type === 'vod') {
    router.push(`/vod/${item.programSlug}/${item.part}?ref=` + encodeURIComponent(route.fullPath))
  } else {
    router.push('/live/' + item.name + '?ref=' + encodeURIComponent(route.fullPath))
  }
}
</script>

<template>
  <main class="search-page">
    <template v-if="query">
      <h1 class="search-heading">Wyniki wyszukiwania</h1>

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
        <div class="filter-chips">
          <button
            class="chip"
            :class="{ active: activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >Wszystkie</button>
          <button
            class="chip"
            :class="{ active: activeFilter === 'tv' }"
            @click="activeFilter = 'tv'"
          >Kanały TV</button>
          <button
            class="chip"
            :class="{ active: activeFilter === 'vod' }"
            @click="activeFilter = 'vod'"
          >Programy VOD</button>
        </div>
      </div>

      <p class="result-count">Wyniki dla "{{ query }}" — {{ filtered.length }}</p>

      <section v-for="group in grouped" :key="group.key" class="result-group">
        <h2 class="group-title">{{ group.label }}</h2>
        <div class="group-list">
          <article
            v-for="item in group.items"
            :key="item.type + '-' + item.id"
            class="result-card"
            @click="goToItem(item)"
          >
            <div class="result-card-body">
              <img
                v-if="'thumbnailUrl' in item"
                :src="item.thumbnailUrl"
                :alt="item.title"
                class="result-thumb"
                loading="lazy"
              />
              <h3 class="result-card-title">{{ item.title }}</h3>
              <p class="result-card-program">{{ item.programName }}</p>
              <span v-if="'timeRange' in item" class="result-card-time">{{ item.timeRange }}</span>
              <span v-else-if="'part' in item && item.part" class="result-card-time">Część {{ item.part }}</span>
            </div>
          </article>
        </div>
      </section>

      <p v-if="!filtered.length" class="empty">Brak wyników</p>
    </template>
    <div v-else class="empty-state">
      <p>Wpisz frazę, aby wyszukać programy</p>
    </div>
  </main>
</template>

<style scoped>
.search-page {
  flex: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.search-heading {
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

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.chip {
  padding: 6px 14px;
  border: 1px solid var(--light-grey);
  border-radius: 20px;
  background: transparent;
  color: var(--light-grey);
  font-family: var(--font-family);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.chip.active {
  background: var(--secondary-dark);
  border-color: var(--secondary-dark);
  color: var(--pure-white);
}

.result-count {
  font-size: var(--meta-size);
  color: var(--light-grey);
  margin: 0;
}

.result-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.group-title {
  font-size: var(--h2-size);
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
}

.group-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-md);
}

.result-card {
  padding: var(--space-md);
  background: var(--primary-dark);
  border-radius: var(--radius);
  cursor: pointer;
  transition: filter 0.2s;
}

.result-card:hover {
  filter: brightness(1.1);
}

.result-card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: calc(var(--radius) - 2px);
  margin-bottom: var(--space-sm);
}

.result-card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--pure-white);
  margin: 0;
}

.result-card-program {
  font-size: var(--program-desc-size);
  color: var(--light-grey);
  margin: 0;
}

.result-card-time {
  font-size: var(--meta-size);
  color: var(--disabled-grey);
}

.empty {
  text-align: center;
  color: var(--light-grey);
  padding: var(--space-lg);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--light-grey);
}

@media (max-width: 768px) {
  .group-list {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 501px) {
  .result-thumb {
    max-width: 250px;
    aspect-ratio: 16 / 10;
  }

  .result-card {
    display: flex;
    align-items: center;
    gap: var(--space-md);
  }

  .result-card-body {
    flex: 1;
  }
}
</style>
