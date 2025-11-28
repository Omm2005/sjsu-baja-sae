"use client"

import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from "react"
import { motion, MotionValue, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string
}

export const TextReveal: FC<TextRevealProps> = ({ children, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 50%", "end 100%"],
  })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 20, mass: 0.6 })

  const inView = useInView(targetRef, { margin: "0px 0px -50% 0px", amount: 0.01 })
  const gate = useMotionValue(0)
  if (gate.get() !== (inView ? 1 : 0)) gate.set(inView ? 1 : 0)

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string")
  }

  // more robust splitting: collapse whitespace/newlines to single spaces
  const words = children.trim().split(/\s+/)
  const indexProgress = useTransform(p, (v) => v * words.length)

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[160vh] md:h-[200vh]", className)}>
      <div
        className="sticky top-[var(--nav-h,0px)] min-h-[calc(100svh-var(--nav-h,0px))] w-full flex items-center bg-transparent px-4 sm:px-8 md:px-20 py-8"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div className="max-w-3xl md:max-w-4xl">
          <span className="flex flex-wrap leading-[1.35] sm:leading-[1.2] tracking-tight text-lg sm:text-2xl md:text-3xl lg:text-4xl font-semibold md:font-bold text-foreground/25 dark:text-white/25">
            {words.map((word, i) => (
              <Word key={i} index={i} indexProgress={indexProgress} gate={gate}>
                {word}
              </Word>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}

interface WordProps {
  children: ReactNode
  index: number
  indexProgress: MotionValue<number>
  gate: MotionValue<number>
}

const Word: FC<WordProps> = ({ children, index, indexProgress, gate }) => {
  const base = useTransform(indexProgress, (iv) => {
    const t = iv - index
    if (t <= 0) return 0
    if (t >= 1) return 1
    return t
  })
  const opacity = useTransform([base, gate], ([b, g]: any) => b * g)
  const y = useTransform(base, [0, 1], [8, 0])

  return (
    <span className="relative mx-[0.2em] sm:mx-[0.25em]">
      <span className="absolute opacity-20 select-none">{children}</span>
      <motion.span style={{ opacity, y }} className="text-foreground dark:text-white">
        {children}
      </motion.span>
    </span>
  )
}
