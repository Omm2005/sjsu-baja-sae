
"use client"

import { TeamMember, Media } from '@/payload-types'
import Image from "next/image"
import { useState } from "react"

function MemberTile({ member }: { member: TeamMember }) {
  const [failed, setFailed] = useState(false)

  // Handle Payload media object
  const media = member.image as Media | undefined
  const imageUrl = media?.url
  const imageAlt = member.alt || media?.alt || member.name

  return (
    <div className="group overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="relative aspect-square w-full">
        {imageUrl && !failed ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover md:grayscale transition-all duration-300 group-hover:scale-105 md:group-hover:grayscale-0"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground" aria-label="Image unavailable">
            <span className="text-xs">No Image</span>
          </div>
        )}
      </div>
      <div className="px-3 py-3 text-center">
        <p className="text-[12px] font-semibold tracking-tight text-foreground/90">{member.name}</p>
        {member.role ? (
          <p className="mt-0.5 text-[10px] text-muted-foreground/80">{member.role}</p>
        ) : null}
      </div>
    </div>
  )
}

export default function TeamBlock({
  members,
}: {
  members: TeamMember[]
}) {
  return (
    <section className="w-full py-12">
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="mb-10 text-start">
          <p className="text-xl font-medium uppercase tracking-[0.3em] text-muted-foreground pl-1">[Meet the]</p>
          <h2 className="mt-2 text-4xl sm:text-5xl md:text-[11vw] font-bold tracking-tight">Team</h2>
          <div className="mx-auto mt-4 h-px w-24 bg-border" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {members.map((m) => (
            <MemberTile key={m.id} member={m} />
          ))}
        </div>
      </div>
    </section>
  )
}
