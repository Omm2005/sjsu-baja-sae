import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import config from '@/payload.config'
import ContactTabs, { type ContactPageData } from "@/components/contact/ContactTabs"

export default async function ContactPage() {
    const headers = await getHeaders()
    const payloadConfig = await config
    const payload = await getPayload({ config: payloadConfig })

    const contactQuery = await payload.find({
        collection: 'contact-page',
        limit: 1,
    })
    const cmsData = contactQuery.docs[0]

    if (!cmsData) return null

    const content: ContactPageData = {
        heroTitle: cmsData.heroTitle,
        heroIntro: cmsData.heroIntro,
        teamEmail: cmsData.teamEmail,
        sponsorTab: cmsData.sponsorTab ? {
            label: cmsData.sponsorTab.label,
            description: cmsData.sponsorTab.description,
            formHeading: cmsData.sponsorTab.formHeading,
            formSubtitle: cmsData.sponsorTab.formSubtitle,
            highlights: cmsData.sponsorTab.highlights?.map((h: any) => h.highlight) || [],
        } : null,
        joinTab: cmsData.joinTab ? {
            label: cmsData.joinTab.label,
            description: cmsData.joinTab.description,
            formHeading: cmsData.joinTab.formHeading,
            formSubtitle: cmsData.joinTab.formSubtitle,
            highlights: cmsData.joinTab.highlights?.map((h: any) => h.highlight) || [],
            meetings: cmsData.joinTab.meetings?.map((m: any) => ({
                label: m.label,
                time: m.time,
                location: m.location
            })) || []
        } : null
    }

    return <ContactTabs content={content} />
}
