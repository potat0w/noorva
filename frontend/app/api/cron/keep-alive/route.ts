import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const maxDuration = 30

const getBackendHealthUrl = () => {
  const base = (process.env.NEXT_PUBLIC_API_URL || "https://noorva.onrender.com").replace(/\/$/, "")
  return `${base}/health`
}

const getSiteUrl = () => {
  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`
  return process.env.NEXT_PUBLIC_SITE_URL || "https://noorva-bm65.vercel.app"
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get("authorization")
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  const siteUrl = getSiteUrl()
  const backendHealthUrl = getBackendHealthUrl()
  const targets = [
    { name: "frontend", url: `${siteUrl}/ping` },
    { name: "backend", url: backendHealthUrl },
  ]

  const results = await Promise.all(
    targets.map(async (target) => {
      const started = Date.now()
      try {
        const response = await fetch(target.url, {
          method: "GET",
          cache: "no-store",
          signal: AbortSignal.timeout(25000),
        })
        const body = await response.text()
        return {
          name: target.name,
          url: target.url,
          ok: response.ok,
          status: response.status,
          durationMs: Date.now() - started,
          body: body.slice(0, 200),
        }
      } catch (error) {
        return {
          name: target.name,
          url: target.url,
          ok: false,
          status: 0,
          durationMs: Date.now() - started,
          error: error instanceof Error ? error.message : "Ping failed",
        }
      }
    }),
  )

  const allOk = results.every((result) => result.ok)

  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      results,
    },
    { status: allOk ? 200 : 503 },
  )
}
