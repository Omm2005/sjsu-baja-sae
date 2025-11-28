'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BlurFade } from '@/components/ui/blur-fade'
import { cn } from '@/lib/utils'
import type { Media } from '@/payload-types'

type GalleryImage = {
  image: Media
  alt?: string | null
  caption?: string | null
}

type LightboxGalleryProps = {
  title: string
  images: GalleryImage[]
}

const LightboxGallery = ({ images, title }: LightboxGalleryProps) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})

  const handleLoad = (key: string) => {
    setLoadedImages((prev) => ({
      ...prev,
      [key]: true,
    }))
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
      {images.map((item, index) => {
        const image = item.image
        if (!image?.url) {
          return null
        }

        const imageKey = image.id ?? `${image.url}-${index}`
        const isLoaded = loadedImages[imageKey]
        const width = image.width ?? 1200
        const height = image.height ?? 800
        const altText = item.alt || title

        return (
          <BlurFade key={imageKey} delay={0.05 * index} inView>
            <div className="group relative overflow-hidden rounded-xl bg-muted/40 transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <div
                  className={cn(
                    'absolute inset-0 bg-muted/60 transition-opacity duration-500',
                    isLoaded ? 'opacity-0' : 'animate-pulse',
                  )}
                />
                <Image
                  src={image.url}
                  alt={altText}
                  width={Math.max(width, 1)}
                  height={Math.max(height, 1)}
                  className={cn(
                    'h-full w-full object-cover transition-transform duration-500 group-hover:scale-110',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                  )}
                  onLoadingComplete={() => handleLoad(imageKey.toString())}
                />
              </div>

              {/* Overlay with Title - Always visible on mobile, hover on desktop */}
              {item.alt && (
                <>
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-0 opacity-100 transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                    <h3 className="text-sm font-medium text-white line-clamp-2">
                      {item.alt}
                    </h3>
                  </div>
                </>
              )}
            </div>
          </BlurFade>
        )
      })}
    </div>
  )
}

export default LightboxGallery
