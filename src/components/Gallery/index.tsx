'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import React, { useState } from 'react'
import Project from './Project'
import Modal from './Modal'
import { Gallery, Media } from '@/payload-types'

const GalleryComponent = ({ galleries }: { galleries: Gallery[] }) => {
  const [modal, setModal] = useState({ active: false, index: 0 })

  return (
    <>
      <div className="mt-10 flex flex-col gap-6 lg:hidden">
        {galleries.map((gallery) => {
          const firstImage = gallery.images?.[0]
          const media = firstImage?.image as Media | undefined
          const imageUrl = media?.url
          const alt = firstImage?.alt || media?.alt || gallery.title
          return (
            <Link
              key={`${gallery.title}-grid`}
              href={`/gallery/${gallery.id}`}
              className="group"
            >
              <figure className="flex flex-col gap-3 rounded-2xl border border-neutral-200/70 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="relative aspect-4/3 overflow-hidden rounded-xl border border-neutral-200/50 bg-neutral-100">
                  <Image
                    src={imageUrl || ''}
                    alt={alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <figcaption className="text-base font-semibold text-neutral-900">{gallery.title}</figcaption>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors group-hover:bg-neutral-100">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">View {gallery.title}</span>
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-neutral-600">{gallery.description}</p>
              </figure>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 hidden divide-y divide-neutral-200 border-y border-neutral-200 lg:block">
        {galleries.map((gallery, index) => (
          <Project key={gallery.id} index={index} gallery={gallery} setModal={setModal} />
        ))}
      </div>

      <div className="hidden lg:block">
        <Modal modal={modal} galleries={galleries} />
      </div>
    </>
  )
}

export default GalleryComponent
