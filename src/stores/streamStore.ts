import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchChannelVideos, fetchEpgChannels, type ApiEpgChannel } from '../services/odysee'

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

function mapEpgToChannel(epg: ApiEpgChannel): Channel {
  const now = new Date()
  const current = epg.epg?.find((p: { start: string; end: string }) => new Date(p.start) <= now && new Date(p.end) > now)
  const upcoming = !current ? epg.epg?.find((p: { start: string }) => new Date(p.start) > now) : undefined
  const program = current || upcoming

  let name = slugify(epg.name)
  if (epg.name === 'Oliwier Stream') name = 'o-stream'

  return {
    id: epg.id.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0),
    title: epg.name,
    name,
    programName: program?.title || epg.name,
    timeRange: program
      ? `${new Date(program.start).getHours().toString().padStart(2, '0')}:${new Date(program.start).getMinutes().toString().padStart(2, '0')}`
      : '00:00',
    progress: 0,
    type: 'tv',
  }
}

export const useStreamStore = defineStore('stream', () => {
  const channels = ref<Channel[]>([])
  const vodItems = ref<VodItem[]>([])
  const vodLoading = ref(false)
  const vodError = ref<string | null>(null)
  const epgLoading = ref(false)

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

  async function loadEpg() {
    epgLoading.value = true
    try {
      const epg = await fetchEpgChannels()
      channels.value = epg.map(mapEpgToChannel)
    } catch {
      // fallback — keep existing channels
    } finally {
      epgLoading.value = false
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
    epgLoading,
    searchQuery,
    searchResults,
    allSearchable,
    tvChannels,
    categories,
    itemsByCategory,
    setChannels,
    loadVodItems,
    loadEpg,
  }
})
