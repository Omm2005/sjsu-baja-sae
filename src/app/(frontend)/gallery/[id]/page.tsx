import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Images } from 'lucide-react'

import { getPayload } from 'payload'
import config from '@payload-config'
import LightboxGallery from '@/components/Gallery/LightboxGallery'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { Gallery, Media } from '@/payload-types'

type PageProps = {
    params: Promise<{
        id: string
    }>
}

const GalleryPage = async ({ params }: PageProps) => {
    const { id } = await params

    if (!id) {
        notFound()
    }

    let gallery: Gallery | null = null

    try {
        const payload = await getPayload({ config })
        const result = await payload.find({
            collection: 'gallery',
            where: {
                id: {
                    equals: parseInt(id),
                },
            },
            depth: 2, // Populate image relations
        })

        gallery = result.docs[0] || null
    } catch (error) {
        console.error('[gallery detail] fetch failed', error)
    }

    if (!gallery) {
        notFound()
    }

    // Transform images to the format expected by LightboxGallery
    const images = gallery.images.map((item) => ({
        image: typeof item.image === 'number' ? ({} as Media) : item.image,
        alt: item.alt,
        caption: item.caption,
    })).filter((item) => item.image.url) // Filter out invalid images

    return (
        <main className="min-h-screen w-full bg-background">
            <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-8 md:py-12">
                {/* Breadcrumbs */}
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/gallery">Gallery</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{gallery.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Minimal Header */}
                <header className="mb-12 text-center">
                    <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {gallery.title}
                    </h1>

                    {gallery.description && (
                        <p className="mx-auto max-w-2xl text-muted-foreground">
                            {gallery.description}
                        </p>
                    )}
                </header>

                {/* Gallery Content */}
                <section>
                    {images.length > 0 ? (
                        <LightboxGallery images={images} title={gallery.title} />
                    ) : (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/20 px-6 py-12 text-center">
                            <Images className="mb-4 h-10 w-10 text-muted-foreground/40" />
                            <h3 className="text-lg font-medium text-foreground">No photos yet</h3>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default GalleryPage
