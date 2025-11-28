'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import VideoMotion from './VideoMotion'
import { MoveDown } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

type Props = {}

const Hero = (props: Props) => {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end end'] })
  const [travelY, setTravelY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [endScale, setEndScale] = useState(1.35)

  useEffect(() => {
    const compute = () => {
      const navVar = getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
      const nav = parseFloat(navVar) || 64
      const vh = window.innerHeight
      const vw = window.innerWidth
      const first = Math.max(0, vh - nav)
      const distance = 0.75 * first + 0.5 * vh
      setTravelY(distance)
      setIsMobile(window.innerWidth < 768)
      // Target scale so the 720x420 video fits within the viewport with slight side padding
      const baseW = 720
      const baseH = 420
      const paddingFactor = 0.94 // leave a little space on sides
      const containScale = Math.min(vw / baseW, vh / baseH) * paddingFactor
      setEndScale(containScale)
    }
    compute()
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [])

  const yBase = useTransform(scrollYProgress, v => v * travelY)
  // Disable enlarging on mobile; desktop scales to computed full-screen contain size
  const scale = useTransform(scrollYProgress, v => (isMobile ? 1 : 1 + (endScale - 1) * v))

  return (
    <div ref={rootRef} className='w-full flex flex-col items-stretch justify-start overflow-hidden'>
      {/* Screen 1: First two sections share one viewport height */}
      <section className='w-full min-h-[calc(100svh-var(--nav-h,64px))] flex flex-col'>
        {/* Top half: Video */}
        <div className='relative flex-1 px-4 sm:px-8 flex items-center justify-center overflow-visible'>
          <motion.div style={{ y: (isMobile ? 0 : (yBase as any)), scale }} className='will-change-transform z-50 pointer-events-none'>
            <VideoMotion disableScrollScale />
          </motion.div>
        </div>

        {/* Bottom half: Big headline */}
        <div className='relative flex-1 px-6 sm:px-10 flex items-center justify-center overflow-visible z-10'>
          {/* Corner labels */}
          <span className="absolute top-6 left-6 text-xs md:text-sm font-semibold tracking-wide">A</span>
          <span className="absolute top-6 left-1/2 -translate-x-1/2 text-xs md:text-sm font-semibold tracking-widest">SERIOUSLY</span>
          <span className="absolute top-6 right-6 text-xs md:text-sm font-semibold tracking-wide">GOOD</span>

          {/* Center headline */}
          <h2 className="text-foreground md:text-[14vw] text-[12vw] leading-none font-extrabold tracking-tight text-center select-none">
            [Racing Team]
          </h2>

          {/* Bottom hints */}
          <div className="absolute bottom-6 left-6 text-sm md:text-base flex items-center gap-2">
            <MoveDown />
            <span>Scroll for</span>
          </div>
          <div className="absolute bottom-6 right-6 text-sm md:text-base flex items-center gap-2">
            <span>more info</span>
            <span className="text-lg">
              <MoveDown />
            </span>
          </div>
        </div>
      </section>
      <section className='w-full min-h-[calc(100svh-var(--nav-h,64px))] items-center justify-center hidden md:flex'></section>
    </div>
  )
}

export default Hero
