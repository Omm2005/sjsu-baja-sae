"use client"

import { useEffect, useRef } from "react"
import { easeInOut, motion } from "framer-motion"
import Image from "next/image"
import gsap from "gsap"
import styles from "./style.module.css"
import { type Gallery, type Media } from '@/payload-types'

type ModalState = {
  active: boolean
  index: number
}

type GalleryModalProps = {
  modal: ModalState
  galleries: Gallery[]
}

const accents = [
  "#F3F4F6",
  "#EEF2F7",
  "#F8FAFC",
  "#EEF2FF"
]

const scaleAnimation = {
  initial: { scale: 0.8, opacity: 0, x: "-50%", y: "-50%" },
  enter: {
    scale: 1,
    opacity: 1,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.35, ease: easeInOut },
  },
  closed: {
    scale: 0.8,
    opacity: 0,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.28, ease: easeInOut },
  },
}

const GalleryModal = ({ modal, galleries }: GalleryModalProps) => {
  const { active, index } = modal
  const modalContainerRef = useRef<HTMLDivElement | null>(null)
  const cursorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    if (!mediaQuery.matches) return

    const modalContainer = modalContainerRef.current
    const cursor = cursorRef.current
    if (!modalContainer || !cursor) return

    let xMoveContainer = gsap.quickTo(modalContainer, "left", { duration: 0.8, ease: "power3" })
    let yMoveContainer = gsap.quickTo(modalContainer, "top", { duration: 0.8, ease: "power3" })
    //Move cursor
    let xMoveCursor = gsap.quickTo(cursor, "left", { duration: 0.5, ease: "power3" })
    let yMoveCursor = gsap.quickTo(cursor, "top", { duration: 0.5, ease: "power3" })

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event
      xMoveContainer(clientX)
      yMoveContainer(clientY)
      xMoveCursor(clientX)
      yMoveCursor(clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const boundedIndex = Math.max(0, Math.min(index, galleries.length - 1))

  return (
    <>
      <motion.div
        ref={modalContainerRef}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"}
        className={styles.modalContainer}
      >
        <div className={styles.modalSlider} style={{ top: `${boundedIndex * -100}%` }}>
          {galleries.map((gallery, galleryIndex) => {
            const firstImage = gallery.images?.[0]
            const media = firstImage?.image as Media | undefined
            const imageUrl = media?.url
            const width = media?.width || 1200
            const height = media?.height || 800
            const alt = firstImage?.alt || media?.alt || gallery.title

            return (
              <div
                className={styles.modal}
                style={{ backgroundColor: accents[galleryIndex % accents.length] }}
                key={`modal_${galleryIndex}`}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={alt}
                    priority={galleryIndex === boundedIndex}
                    className={styles.modalImage}
                    sizes="(min-width: 1024px) 360px, 60vw"
                  />
                ) : (
                  <div className={styles.modalFallback}>
                    {gallery.title}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        ref={cursorRef}
        className={styles.cursor}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? "enter" : "closed"}
      >
        View
      </motion.div>
    </>
  )
}

export default GalleryModal
