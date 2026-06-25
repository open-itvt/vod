export default async function handler(request: Request) {
  const url = new URL(request.url)
  const hash = url.pathname.replace('/api/thumb/', '')

  if (!hash || !/^[a-f0-9]{32,}$/.test(hash)) {
    return new Response(JSON.stringify({ error: 'Invalid hash' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  const apiUrl = `http://api.itvt.xyz/api/thumb/${hash}`
  const api = await fetch(apiUrl)

  if (!api.ok) {
    return new Response(JSON.stringify({ error: 'Thumbnail not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    })
  }

  const blob = await api.blob()
  return new Response(blob, {
    headers: {
      'content-type': api.headers.get('content-type') || 'image/webp',
      'cache-control': 'public, max-age=86400',
    },
  })
}

export const config = { runtime: 'edge' }
