import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Hero from "@/components/Hero"
import { ScrollVelocity } from "@/components/scrollVelocity"
import { TextReveal } from "@/components/ui/text-reveal"
import LinkButton from "@/components/ui/LinkButton"
import TeamBlock from "@/components/TeamBlock"
import GalleryForHome from "@/components/Gallery/HomePage"
import Sponsors from "@/components/Sponsors"
import RichText from "@/components/RichText"

export default async function Home() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch data
  const homeAbout = await payload.findGlobal({
    slug: 'home-about',
  })

  const teamQuery = await payload.find({
    collection: 'team-member',
    sort: 'orderRank',
    limit: 100,
  })

  const sponsorsQuery = await payload.find({
    collection: 'sponsor',
    sort: 'orderRank',
    limit: 100,
  })

  const galleryQuery = await payload.find({
    collection: 'gallery',
    limit: 10, // Recent highlights
    sort: '-createdAt',
  })

  // Fallback text if HomeAbout is not configured
  const defaultText = "Spartan Racing Baja is an entirely student-built and fundraised project vehicle, designed and built to compete in the annual SAE International Collegiate Design Competition. The mission of the club is to enhance the skills and knowledge gained in the classroom and help students develop new ones. This is done by providing the opportunity for real-world research, design, manufacturing, and business experience, all the way throughout the product development process."

  return (
    <main className="min-h-full w-full flex flex-col items-start justify-start">
      <Hero />
      <section className="relative min-h-screen flex flex-col justify-center items-start md:p-20 p-2 w-full" id="about" >
        <p className="text-xl font-medium uppercase tracking-[0.3em] text-muted-foreground pl-1">[About]</p>
        <h2 className="mt-2 text-4xl sm:text-5xl md:text-[8vw] font-bold tracking-tight">
          {homeAbout?.title || "Who are we?"}
        </h2>
        <div className="relative w-full">
          <TextReveal>{homeAbout?.description || defaultText}</TextReveal>
          {homeAbout?.linkPage && typeof homeAbout.linkPage === 'object' && homeAbout.linkPage.slug && (
            <div className="absolute bottom-8 right-4 md:right-20 z-10">
              <LinkButton href={`/about/${homeAbout.linkPage.slug}`}>
                {homeAbout.linkText || "Learn More"}
              </LinkButton>
            </div>
          )}
        </div>
      </section>
      <section className="relative flex flex-col justify-center items-start w-full " >
        <ScrollVelocity />
      </section>
      <section className="relative w-full py-10">
        <GalleryForHome galleries={galleryQuery.docs} />
      </section>
      <div className="relative mx-auto max-w-screen-2xl flex w-full flex-col px-4 py-16 md:px-10 md:py-20">
        <header className="flex flex-col gap-3 text-left mb-4">
          <p className="text-xl font-medium uppercase tracking-[0.3em] text-muted-foreground pl-1">[Meet our]</p>
          <h2 className="mt-2 text-4xl sm:text-5xl md:text-[8vw] font-bold tracking-tight">
            Sponsors
          </h2>
        </header>
        <Sponsors sponsors={sponsorsQuery.docs} />
      </div>
      <section className="relative w-full py-10" id="team">
        <TeamBlock members={teamQuery.docs} />
      </section>
    </main>
  )
}
