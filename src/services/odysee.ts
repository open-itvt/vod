import type { VodItem } from '../stores/streamStore'

const BASE = 'https://api.itvt.xyz'

export interface ApiVodItem {
  id: string
  name: string
  title: string
  description: string | null
  thumbnail: string
  duration: number
  releaseTime: number
  url: string
}

export interface ApiEpgChannel {
  id: string
  name: string
  category: string
  epg: ApiEpgProgram[]
}

export interface ApiEpgProgram {
  id: string
  channelId: string
  title: string
  description: string | null
  start: string
  end: string
  category: { id: string; name: string }
  _virtual?: boolean
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractPart(title: string): number | undefined {
  const match = title.match(/#(\d+)/)
  return match ? parseInt(match[1], 10) : undefined
}

function parseProgramName(title: string): string {
  const cleaned = title.replace(/#\d+\s*\|\s*.*$/, '').trim()
  return cleaned || title
}

function mapApiToVodItem(item: ApiVodItem): VodItem {
  const part = extractPart(item.title)
  const videoName = item.name
  const programName = item.title.includes('Oliwier Stream') || videoName.startsWith('o.stream')
    ? 'Oliwier Stream'
    : parseProgramName(item.title)
  const releaseDate = item.releaseTime
    ? new Date(item.releaseTime * 1000).toISOString().split('T')[0]
    : undefined
  const thumb = item.thumbnail

  return {
    id: parseInt(item.id.slice(0, 8), 16) || Math.random(),
    title: item.title,
    programName,
    part: part || 0,
    programSlug: slugify(programName),
    videoName,
    claimId: item.id,
    thumbnailUrl: thumb,
    date: releaseDate,
    releaseTime: item.releaseTime,
    views: 0,
  }
}

function getFallbackVod(): VodItem[] {
  return [
    {
      id: 101, title: '📺 iTVT | Retro time #5 | 28.11.24', programName: 'Retro Time', part: 5, programSlug: 'retro-time',
      videoName: 'retrotime_28.11.24', claimId: 'a4052396df05e011d2cbbbb0b16a00238fd54fcd',
      thumbnailUrl: 'https://thumbs.odycdn.com/7a0c0eb4784dad3ccae984488f7a5a72.webp',
      date: '2024-11-28', releaseTime: 1732831200, views: 120,
    },
    {
      id: 102, title: '📺 iTVT | Retro time #4 | 07.11.24', programName: 'Retro Time', part: 4, programSlug: 'retro-time',
      videoName: 'retrotime_07.11.24', claimId: '902e5415f158991e140dda0151f9f9fe9e2b5e1f',
      thumbnailUrl: 'https://thumbs.odycdn.com/7a0c0eb4784dad3ccae984488f7a5a72.webp',
      date: '2024-11-07', releaseTime: 1731016800, views: 85,
    },
  ]
}

function getFallbackChannels() {
  return [
    { id: 'fallback-itvt', name: 'iTVT', category: 'importowane', epg: [] },
    { id: 'fallback-oliwier', name: 'Oliwier Stream', category: 'importowane', epg: [] },
    { id: 'fallback-itvt-now', name: 'iTVT Now', category: 'importowane', epg: [] },
  ]
}

export async function fetchChannelVideos(): Promise<VodItem[]> {
  try {
    const res = await fetch(`${BASE}/api/vod`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: { items: ApiVodItem[] } = await res.json()
    return (data.items || []).map(mapApiToVodItem)
  } catch (err) {
    console.warn('VOD API failed, using fallback:', err)
    return getFallbackVod()
  }
}

export async function fetchEpgChannels() {
  try {
    const res = await fetch(`${BASE}/api/epg`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data: { channels: ApiEpgChannel[] } = await res.json()
    return data.channels || []
  } catch (err) {
    console.warn('EPG API failed, using fallback:', err)
    return getFallbackChannels()
  }
}
