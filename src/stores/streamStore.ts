import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchChannelVideos } from '../services/odysee'

export type ContentType = 'tv' | 'vod'

export interface Channel {
  id: number
  title: string
  name: string
  programName: string
  timeRange: string
  progress: number
  type: ContentType
}

export interface VodItem {
  id: number
  title: string
  programName: string
  part: number
  programSlug: string
  videoName: string
  claimId: string
  thumbnailUrl: string
  date?: string
  releaseTime: number
  views: number
}

export type SearchableItem = Channel | (VodItem & { type: 'vod' })

export interface Category {
  name: string
  slug: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const FEATURED: { name: string; slug: string }[] = [
  { name: 'iTVT', slug: 'itvt' },
  { name: 'Oliwier Stream', slug: 'oliwier-stream' },
  { name: 'Retro Time', slug: 'retro-time' },
]

function matchesOliwier(v: VodItem): boolean {
  return v.title.includes('Oliwier Stream') || v.videoName.startsWith('o.stream')
}

function matchesRetroTime(v: VodItem): boolean {
  const t = v.title.toLowerCase()
  return t.includes('retro time') || v.videoName.includes('retrotime')
}

export const useStreamStore = defineStore('stream', () => {
  const channels = ref<Channel[]>([
    { id: 1, title: 'iTVT', name: 'itvt', programName: 'Klubuntu Stream - Tworzymy razem', timeRange: '18:00', progress: 15, type: 'tv' },
    { id: 2, title: 'Oliwier Stream', name: 'o-stream', programName: 'Wieczorny Stream', timeRange: '21:00', progress: 70, type: 'tv' },
  ])

  const vodItems = ref<VodItem[]>([])
  const vodLoading = ref(false)
  const vodError = ref<string | null>(null)

  const searchQuery = ref('')

  const tvChannels = computed(() =>
    channels.value.filter(ch => ch.type === 'tv')
  )

  const allSearchable = computed((): SearchableItem[] => {
    const vods: (VodItem & { type: 'vod' })[] = vodItems.value.map(v => ({ ...v, type: 'vod' as const }))
    return [...channels.value, ...vods]
  })

  const categories = computed<Category[]>(() => {
    const map = new Map<string, string>()
    FEATURED.forEach(c => map.set(c.name, c.slug))
    vodItems.value.forEach(v => {
      if (matchesOliwier(v)) map.set('Oliwier Stream', 'oliwier-stream')
      else if (matchesRetroTime(v)) map.set('Retro Time', 'retro-time')
      else map.set(v.programName, slugify(v.programName))
    })
    return Array.from(map.entries()).map(([name, slug]) => ({ name, slug }))
  })

  const searchResults = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return allSearchable.value
    return allSearchable.value.filter(
      item => item.title.toLowerCase().includes(q) || item.programName.toLowerCase().includes(q)
    )
  })

  function itemsByCategory(categoryName: string): VodItem[] {
    if (categoryName === 'Oliwier Stream') {
      return vodItems.value.filter(v => matchesOliwier(v))
    }
    if (categoryName === 'Retro Time') {
      return vodItems.value.filter(v => matchesRetroTime(v))
    }
    if (categoryName === 'iTVT') {
      return vodItems.value.filter(v => !matchesOliwier(v) && !matchesRetroTime(v))
    }
    return vodItems.value.filter(v => v.programName === categoryName)
  }

  async function loadVodItems() {
    vodLoading.value = true
    vodError.value = null
    try {
      vodItems.value = await fetchChannelVideos()
    } catch (err: any) {
      vodError.value = err?.message || 'Failed to load VODs'
    } finally {
      vodLoading.value = false
    }
  }

  function setChannels(list: Channel[]) {
    channels.value = list
  }

  return {
    channels,
    vodItems,
    vodLoading,
    vodError,
    searchQuery,
    searchResults,
    allSearchable,
    tvChannels,
    categories,
    itemsByCategory,
    setChannels,
    loadVodItems,
  }
})
