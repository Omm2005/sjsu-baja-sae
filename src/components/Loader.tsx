"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"

const STORAGE_PREFIX = "app:loaderTitle:"

const Loader = () => {
  const [progress, setProgress] = useState(1)
  const [loaded, setLoaded] = useState(false)
  const [done, setDone] = useState(false)
  const [titleHint, setTitleHint] = useState<string | null>(null)
  const intervalRef = useRef<number | null>(null)
  const prevHtmlOverflow = useRef<string | null>(null)
  const prevBodyOverflow = useRef<string | null>(null)
  const prevBodyOverscroll = useRef<string | null>(null)
  const pathname = usePathname()

  const isHome = pathname === "/"

  const fallbackTitle = useMemo(() => {
    if (isHome) return null
    const segments = pathname.split("/").filter(Boolean)
    if (!segments.length) return null
    const last = segments[segments.length - 1]
    if (!last) return null
    return last
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }, [pathname, isHome])

  useEffect(() => {
    const handleLoad = () => setLoaded(true)
    if (document.readyState === "complete") setLoaded(true)
    else window.addEventListener("load", handleLoad)

    const step = 1
    const interval = window.setInterval(() => {
      setProgress((p) => {
        if (!loaded && p >= 95) return p
        if (p >= 100) return 100
        return Math.min(100, p + step)
      })
    }, 20)
    intervalRef.current = interval

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      window.removeEventListener("load", handleLoad)
    }
  }, [loaded])

  useEffect(() => {
    if (progress >= 100) {
      const id = window.setTimeout(() => setDone(true), 200)
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return () => window.clearTimeout(id)
    }
  }, [progress])

  useEffect(() => {
    if (typeof window === "undefined") return

    const segments = pathname.split("/").filter(Boolean)
    if (segments.length < 2) {
      setTitleHint(null)
      return
    }

    const parent = segments[segments.length - 2]
    if (parent !== "gallery") {
      setTitleHint(null)
      return
    }

    const id = segments[segments.length - 1]
    const cacheKey = `${STORAGE_PREFIX}${id}`

    let cached: string | null = null

    try {
      cached = window.sessionStorage.getItem(cacheKey)
      setTitleHint(cached ?? null)
    } catch {
      setTitleHint(null)
    }

    let cancelled = false
    const controller = new AbortController()

    const fetchTitle = async () => {
      try {
        const response = await fetch(`/api/gallery-title/${id}`, {
          signal: controller.signal,
          cache: "no-store",
        })
        if (!response.ok) return
        const data = await response.json()
        if (!cancelled && data?.title) {
          setTitleHint(data.title)
          try {
            window.sessionStorage.setItem(cacheKey, data.title)
          } catch {
            // Ignore storage errors
          }
        }
      } catch {
        // Ignore network failures; loader will fall back to default text
      }
    }

    if (!cached) {
      fetchTitle()
    }

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [pathname])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleHint = (event: Event) => {
      const customEvent = event as CustomEvent<{ id?: string; title?: string }>
      const detail = customEvent.detail
      if (!detail?.id || !detail?.title) return

      const segments = pathname.split("/").filter(Boolean)
      if (segments.length < 2) return
      if (segments[segments.length - 2] !== "gallery") return
      const id = segments[segments.length - 1]
      if (detail.id !== id) return

      setTitleHint(detail.title)
      try {
        window.sessionStorage.setItem(`${STORAGE_PREFIX}${detail.id}`, detail.title)
      } catch {
        // Ignore storage errors
      }
    }

    window.addEventListener("app:loaderTitleHint", handleHint as EventListener)
    return () => {
      window.removeEventListener("app:loaderTitleHint", handleHint as EventListener)
    }
  }, [pathname])

  useEffect(() => {
    if (done) {
      window.dispatchEvent(new Event("app:loaderDone"))
    }
  }, [done])

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    if (!done) {
      if (prevHtmlOverflow.current === null) prevHtmlOverflow.current = html.style.overflow
      if (prevBodyOverflow.current === null) prevBodyOverflow.current = body.style.overflow
      if (prevBodyOverscroll.current === null) prevBodyOverscroll.current = (body.style as any).overscrollBehavior
      html.style.overflow = "hidden"
      body.style.overflow = "hidden"
      ;(body.style as any).overscrollBehavior = "none"
    } else {
      if (prevHtmlOverflow.current !== null) html.style.overflow = prevHtmlOverflow.current
      if (prevBodyOverflow.current !== null) body.style.overflow = prevBodyOverflow.current
      if (prevBodyOverscroll.current !== null) (body.style as any).overscrollBehavior = prevBodyOverscroll.current
    }
    return () => {
      if (prevHtmlOverflow.current !== null) html.style.overflow = prevHtmlOverflow.current
      if (prevBodyOverflow.current !== null) body.style.overflow = prevBodyOverflow.current
      if (prevBodyOverscroll.current !== null) (body.style as any).overscrollBehavior = prevBodyOverscroll.current
    }
  }, [done])

  const resolvedTitle = titleHint ?? fallbackTitle

  const displayText = isHome
    ? progress < 100
      ? `${progress}`
      : "Welcome"
    : resolvedTitle ?? "Loading"

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="text-5xl md:text-7xl font-bold tracking-tight select-none">
            [{displayText}]
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Loader
