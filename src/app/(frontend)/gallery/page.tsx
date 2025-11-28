import { getPayload } from 'payload'
import config from '@/payload.config'
import GalleryComponent from '@/components/Gallery'

export default async function GalleryPage() {
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const galleryQuery = await payload.find({
        collection: 'gallery',
        sort: '-createdAt',
        limit: 100,
    })

    const galleries = galleryQuery.docs

    if (!galleries || galleries.length === 0) {
        return (
            <section className="relative mx-auto flex w-full max-w-5xl flex-col px-6 py-16 md:px-10 md:py-20">
                <header className="flex flex-col gap-3 text-left md:text-center">
                    <span className="text-xs uppercase tracking-[0.35em] text-neutral-500">[Gallery]</span>
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                        Recent Highlights
                    </h1>
                    <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 md:mx-auto md:text-base">
                        A minimal stream of snapshots from the Spartan Racing Baja pit. Hover to preview each moment without clutter—the motion does the heavy lifting.
                    </p>
                </header>
                <div className="mt-10 flex flex-col gap-6 lg:hidden">
                    <p className="text-center text-neutral-500">No gallery items available at the moment. Please check back later.</p>
                </div>
            </section>
        )
    }

    return (
        <section className="relative mx-auto flex w-full max-w-5xl flex-col px-6 py-16 md:px-10 md:py-20">
            <header className="flex flex-col gap-3 text-left md:text-center">
                <span className="text-xs uppercase tracking-[0.35em] text-neutral-500">Gallery</span>
                <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
                    Recent Highlights
                </h1>
                <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 md:mx-auto md:text-base">
                    A minimal stream of snapshots from the Spartan Racing Baja pit. Hover to preview each moment without clutter—the motion does the heavy lifting.
                </p>
            </header>
            <GalleryComponent galleries={galleries} />
        </section>
    )
}
