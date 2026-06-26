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
  programStart?: number
  programEnd?: number
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

function mapEpgToChannel(epg: ApiEpgChannel, now: Date = new Date()): Channel {
  const todayStr = `${now.getDate()}.${(now.getMonth() + 1).toString().padStart(2, '0')}`
  const current = epg.epg?.find((p: { start: string; end: string }) => new Date(p.start) <= now && new Date(p.end) > now)
  const upcoming = !current ? epg.epg?.find((p: { start: string }) => new Date(p.start) > now) : undefined
  const program = current || upcoming
  let progress = 0
  let programStart: number | undefined
  let programEnd: number | undefined

  if (current) {
    programStart = new Date(current.start).getTime()
    programEnd = new Date(current.end).getTime()
    const duration = programEnd - programStart
    if (duration > 0) {
      progress = Math.min(100, Math.max(0, ((now.getTime() - programStart) / duration) * 100))
    }
  }

  let name = slugify(epg.name)
  if (epg.name === 'Oliwier Stream') name = 'o-stream'

  let programName = program?.title || epg.name
  let timeRange = '00:00'

  if (program) {
    const pStart = new Date(program.start)
    const pDay = `${pStart.getDate()}.${(pStart.getMonth() + 1).toString().padStart(2, '0')}`
    const hours = pStart.getHours().toString().padStart(2, '0')
    const mins = pStart.getMinutes().toString().padStart(2, '0')
    timeRange = `${hours}:${mins}`
    if (pDay !== todayStr) {
      programName += ` (${pDay})`
    }
  }

  return {
    id: epg.id.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0),
    title: epg.name,
    name,
    programName,
    timeRange,
    progress,
    type: 'tv',
    programStart,
    programEnd,
  }
}

export const useStreamStore = defineStore('stream', () => {
  const channels = ref<Channel[]>([])
  const rawEpg = ref<ApiEpgChannel[]>([])
  const vodItems = ref<VodItem[]>([])
  const vodLoading = ref(false)
  const vodError = ref<string | null>(null)
  const epgLoading = ref(false)

  const searchQuery = ref('')

  let progressTimer: ReturnType<typeof setInterval> | null = null

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
      rawEpg.value = epg
      channels.value = epg.map(c => mapEpgToChannel(c))
      startProgressTimer()
    } catch {
      // fallback — keep existing channels
    } finally {
      epgLoading.value = false
    }
  }

  function startProgressTimer() {
    if (progressTimer) return
    progressTimer = setInterval(() => {
      if (rawEpg.value.length) {
        channels.value = rawEpg.value.map(c => mapEpgToChannel(c))
      }
    }, 30000)
  }

  function cleanup() {
    if (progressTimer) {
      clearInterval(progressTimer)
      progressTimer = null
    }
  }

  function setChannels(list: Channel[]) {
    channels.value = list
  }

  return {
    channels,
    rawEpg,
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
    cleanup,
  }
})
