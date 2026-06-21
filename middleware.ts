const WINDOW_MS = 60_000
const MAX_REQUESTS = 40

const ipMap = new Map<string, { count: number; resetAt: number }>()

setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of ipMap) {
    if (entry.resetAt < now) ipMap.delete(ip)
  }
}, 30_000)

export default function middleware(request: Request): Response | undefined {
  const url = new URL(request.url)

  if (url.pathname.match(/\.(js|css|ico|png|jpg|svg|woff2?|ttf)$/)) {
    return
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'

  const now = Date.now()
  let entry = ipMap.get(ip)

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + WINDOW_MS }
    ipMap.set(ip, entry)
  }

  entry.count++

  if (entry.count > MAX_REQUESTS) {
    return new Response('Too Many Requests', { status: 429 })
  }
}
