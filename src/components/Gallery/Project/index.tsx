'use client';

import { type Dispatch, type SetStateAction } from 'react'
import styles from './style.module.css'
import { type Gallery } from '@/payload-types';
import { useRouter } from 'next/navigation';

type ProjectProps = {
  gallery: Gallery
  index: number
  setModal: Dispatch<SetStateAction<{ active: boolean, index: number }>>
}

const Project = ({ gallery, index, setModal }: ProjectProps) => {
  const handleEnter = () => setModal({ active: true, index })
  const handleLeave = () => setModal({ active: false, index })
  const router = useRouter()

  const rememberLoaderTitle = () => {
    if (typeof window === 'undefined') return
    try {
      window.sessionStorage.setItem(`app:loaderTitle:${gallery.id}`, gallery.title)
      window.dispatchEvent(new CustomEvent('app:loaderTitleHint', { detail: { id: gallery.id, title: gallery.title } }))
    } catch {
      // Ignore storage errors
    }
  }

  const goToGallery = () => {
    rememberLoaderTitle()
    router.push(`/gallery/${gallery.id}`)
  }

  const projectNumber = String(index + 1).padStart(2, '0')

  return (
    <div
      onClick={goToGallery}
      className={styles.project}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleEnter()
        }
      }}
      onKeyUp={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleLeave()
          goToGallery()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Preview ${gallery.title}`}
    >
      <div className={styles.projectHeading}>
        <span className={styles.projectIndex}>[{projectNumber}]</span>
        <h2 className={styles.projectTitle}>{gallery.title}</h2>
      </div>
      <p className={styles.projectCaption}>{gallery.description}</p>
    </div>
  )
}

export default Project
