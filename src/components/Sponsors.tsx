'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
    ScrollVelocityContainer,
    ScrollVelocityRow,
} from '@/components/ui/scroll-based-velocity'
import { Sponsor, Media } from '@/payload-types'

type SponsorsProps = {
    sponsors: Sponsor[]
}

const Sponsors = ({ sponsors }: SponsorsProps) => {
    if (!sponsors || sponsors.length === 0) {
        return null
    }

    // Filter out sponsors without logos
    const validSponsors = sponsors.filter((s) => (s.logo as Media)?.url)

    if (validSponsors.length === 0) {
        return null
    }

    return (
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-12">

            <ScrollVelocityContainer className="gap-8">
                <ScrollVelocityRow baseVelocity={15} direction={1}>
                    {validSponsors.map((sponsor) => {
                        const media = sponsor.logo as Media | undefined
                        const logoUrl = media?.url!
                        const alt = sponsor.alt || media?.alt || sponsor.name

                        const logoElement = (
                            <div
                                key={sponsor.id}
                                className="relative mx-6 flex h-24 w-40 items-center justify-center rounded-lg border border-0 bg-card p-4"
                            >
                                <Image
                                    src={logoUrl}
                                    alt={alt}
                                    fill
                                    sizes="160px"
                                    className="object-contain p-2"
                                />
                            </div>
                        )

                        if (sponsor.website) {
                            return (
                                <Link
                                    key={sponsor.id}
                                    href={sponsor.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block transition-opacity hover:opacity-70"
                                >
                                    {logoElement}
                                </Link>
                            )
                        }

                        return logoElement
                    })}
                </ScrollVelocityRow>
            </ScrollVelocityContainer>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background"></div>
        </div>
    )
}

export default Sponsors
