'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useTransform, useSpring } from 'framer-motion'

type Props = { disableScrollScale?: boolean }

// Track last known pointer X globally to seed position after loaders/route changes
let __lastPointerX: number | null = null

const VideoMotion = ({ disableScrollScale = false }: Props) => {
  const cursorX = useMotionValue(0)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [enabled, setEnabled] = useState(false)

  // Track global page scroll to optionally ease x back to center and scale
  const { scrollYProgress } = useScroll()
  const scrollPhase = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  useEffect(() => {
    const updateEnabled = () => {
      setEnabled(window.innerWidth >= 768) // disable motion on small screens
    }
    updateEnabled()
    window.addEventListener('resize', updateEnabled)
    return () => window.removeEventListener('resize', updateEnabled)
  }, [])

  const movePointer = useCallback(
    (clientX: number) => {
      if (!enabled) {
        cursorX.set(0)
        return
      }

      const viewportWidth = window.innerWidth
      const containerRect = containerRef.current?.getBoundingClientRect()
      const containerCenter =
        containerRect != null ? containerRect.left + containerRect.width / 2 : viewportWidth / 2
      const videoRect = videoRef.current?.getBoundingClientRect()
      const vidWidth =
        videoRect?.width ?? videoRef.current?.clientWidth ?? containerRect?.width ?? viewportWidth
      let minShift = vidWidth / 2 - containerCenter
      let maxShift = viewportWidth - containerCenter - vidWidth / 2

      if (minShift > maxShift) {
        const neutral = (minShift + maxShift) / 2
        minShift = neutral
        maxShift = neutral
      }

      const target = clientX - containerCenter
      const clamped = Math.max(minShift, Math.min(maxShift, target))

      cursorX.set(clamped)
    },
    [cursorX, enabled]
  )

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      __lastPointerX = e.clientX
      movePointer(e.clientX)
    }
    const onMouseMove = (e: MouseEvent) => {
      __lastPointerX = e.clientX
      movePointer(e.clientX)
    }
    const onPointerRaw = (e: any) => {
      if (typeof e.clientX === 'number') {
        __lastPointerX = e.clientX
        movePointer(e.clientX)
      }
    }
    const onMouseEnter = (e: MouseEvent) => {
      __lastPointerX = e.clientX
      movePointer(e.clientX)
    }

    // Listen in capture phase to ensure overlay elements don't block
    window.addEventListener('pointermove', onPointerMove, { capture: true, passive: true })
    window.addEventListener('mousemove', onMouseMove, { capture: true, passive: true })
    window.addEventListener('pointerrawupdate', onPointerRaw as any, { capture: true, passive: true })
    window.addEventListener('mouseenter', onMouseEnter as any, { capture: true, passive: true })

    // Seed with last-known pointer position if available
    requestAnimationFrame(() => {
      if (__lastPointerX !== null) movePointer(__lastPointerX)
      else cursorX.set(0)
    })

    return () => {
      window.removeEventListener('pointermove', onPointerMove, { capture: true } as any)
      window.removeEventListener('mousemove', onMouseMove, { capture: true } as any)
      window.removeEventListener('pointerrawupdate', onPointerRaw as any, { capture: true } as any)
      window.removeEventListener('mouseenter', onMouseEnter as any, { capture: true } as any)
    }
  }, [cursorX, enabled, movePointer])

  // After loader finishes, force a quick refresh so cursor following activates immediately
  useEffect(() => {
    const handler = () => {
      requestAnimationFrame(() => {
        if (__lastPointerX !== null) {
          movePointer(__lastPointerX)
        } else {
          cursorX.set(0)
        }
      })
    }
    window.addEventListener('app:loaderDone', handler)
    return () => window.removeEventListener('app:loaderDone', handler)
  }, [cursorX, movePointer])

  // Interpolate cursor motion back to center as the user scrolls
  const xCombined = useTransform([cursorX, scrollPhase], ([cx, p]: any) => {
    return enabled ? cx * (1 - p) : 0
  })
  const xSmooth = useSpring(xCombined, { stiffness: 120, damping: 20, mass: 0.5 })

  // Optional scroll-based scale-up
  const scaleBase = disableScrollScale || !enabled ? [1, 1] : [1, 1.25]
  const scale = useTransform(scrollPhase, [0, 1], scaleBase)
  const scaleSmooth = useSpring(scale, { stiffness: 120, damping: 20, mass: 0.5 })

  return (
    <div ref={containerRef} className="w-full px-6 sm:px-10 lg:px-24">
      <motion.video
        ref={videoRef}
        src="https://sjsubajasae.com/wp-content/uploads/2025/01/baja-header-Made-with-Clipchamp.mp4"
        autoPlay
        loop
        muted
        width={720}
        height={420}
        className="block max-w-full mx-auto rounded-lg origin-center"
        onMouseMove={(e) => {
          __lastPointerX = e.clientX
          /* seed */
        }}
        style={{ x: xSmooth, scale: scaleSmooth }}
      />
    </div>
  )
}

export default VideoMotion
