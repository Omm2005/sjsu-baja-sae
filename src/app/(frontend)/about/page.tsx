import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'

export default async function AboutPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const aboutPagesQuery = await payload.find({
    collection: 'about-page',
    limit: 100,
  })

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start py-16 px-4">
      <div className="w-full max-w-5xl">
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">[About]</p>
          <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Our Stories
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
            Browse the chapters of Spartan Racing Baja—each page dives into a focus area of the team.
          </p>
        </header>

        <div className="space-y-4">
          {aboutPagesQuery.docs.map((page, idx) => (
            <Link
              key={page.id}
              href={`/about/${page.slug}`}
              className="group flex items-center justify-between rounded-xl border border-border/70 bg-card/70 px-5 py-4 transition-all hover:border-foreground/30 hover:bg-card"
            >
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-muted-foreground/80">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {page.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">Read the overview</p>
                </div>
              </div>
              <svg
                className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {aboutPagesQuery.docs.length === 0 && (
          <p className="text-muted-foreground text-center py-12">No about pages have been created yet.</p>
        )}
      </div>
    </main>
  )
}
