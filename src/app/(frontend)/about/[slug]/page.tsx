import { getPayload } from 'payload'
import config from '@/payload.config'
import RichText from '@/components/RichText'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateStaticParams() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const aboutPages = await payload.find({
    collection: 'about-page',
    limit: 100,
  })

  return aboutPages.docs.map((page) => ({
    slug: page.slug,
  }))
}

export default async function AboutDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const aboutPageQuery = await payload.find({
    collection: 'about-page',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const aboutPage = aboutPageQuery.docs[0]

  if (!aboutPage) {
    notFound()
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-start py-16 px-4">
      <article className="max-w-5xl w-full">
        <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li>
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
            </li>
            <li aria-hidden>›</li>
            <li className="text-foreground">{aboutPage.title}</li>
          </ol>
        </nav>
        <header className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground pl-0.5">[About]</p>
          <h1 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">{aboutPage.title}</h1>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <RichText content={aboutPage.content} />
        </div>
      </article>
    </main>
  )
}
