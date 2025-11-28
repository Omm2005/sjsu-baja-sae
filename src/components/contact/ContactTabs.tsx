"use client"

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"

export type ContactMeeting = {
  label: string
  time?: string
  location?: string
}

export type ContactTabContent = {
  label: string
  description?: string
  formHeading: string
  formSubtitle?: string
  highlights?: string[]
  meetings?: ContactMeeting[]
}

export type ContactPageData = {
  heroTitle: string
  heroIntro: string
  teamEmail: string
  sponsorTab?: ContactTabContent | null
  joinTab?: ContactTabContent | null
}

type InquiryType = "sponsor" | "join"

type ContactTabsProps = {
  content: ContactPageData
}

export default function ContactTabs({ content }: ContactTabsProps) {
  const [activeTab, setActiveTab] = useState<InquiryType>("sponsor")
  const [lastSubmitted, setLastSubmitted] = useState<InquiryType | null>(null)

  const tabEntries = useMemo(() => {
    const entries: { id: InquiryType; data: ContactTabContent }[] = []

    if (content.sponsorTab?.label?.trim() && content.sponsorTab.formHeading?.trim()) {
      entries.push({ id: "sponsor", data: content.sponsorTab })
    }

    if (content.joinTab?.label?.trim() && content.joinTab.formHeading?.trim()) {
      entries.push({ id: "join", data: content.joinTab })
    }

    return entries
  }, [content.joinTab, content.sponsorTab])

  const tabOrder = useMemo(
    () =>
      tabEntries.map((entry) => ({
        id: entry.id,
        label: entry.data.label.trim(),
        description: entry.data.description?.trim() ?? "",
      })),
    [tabEntries],
  )

  const availableTabIds = useMemo(() => tabOrder.map((tab) => tab.id), [tabOrder])

  useEffect(() => {
    if (!availableTabIds.includes(activeTab) && availableTabIds[0]) {
      setActiveTab(availableTabIds[0])
      setLastSubmitted(null)
    }
  }, [activeTab, availableTabIds])

  if (availableTabIds.length === 0) {
    return null
  }

  const currentTab: InquiryType = availableTabIds.includes(activeTab) ? activeTab : availableTabIds[0]
  const currentTabData = tabEntries.find((entry) => entry.id === currentTab)?.data

  if (!currentTabData) {
    return null
  }

  const handleSubmit = (type: InquiryType) => (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = (formData.get("name") as string | null)?.trim() ?? ""
    const senderEmail = (formData.get("email") as string | null)?.trim() ?? ""
    const message = (formData.get("message") as string | null)?.trim() ?? ""

    const prefix = type === "sponsor" ? "SPONSER" : "JOIN"
    const subjectName = name || "Spartan Racing Baja Inquiry"
    const subject = `${prefix} - ${subjectName}`

    const bodyLines = [
      name ? `Name: ${name}` : null,
      senderEmail ? `Email: ${senderEmail}` : null,
      "",
      message || "Message not provided.",
    ]
      .filter(Boolean)
      .join("\n")

    const mailtoUrl = content.teamEmail
      ? `mailto:${content.teamEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`
      : ""

    if (mailtoUrl) {
      window.location.href = mailtoUrl
      event.currentTarget.reset()
      setLastSubmitted(type)
    }
  }

  const renderDirectEmailBlock = () => {
    if (!content.teamEmail) {
      return null
    }

    return (
      <section className="rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm" key={uuidv4()} >
        <h3 className="text-sm font-semibold text-foreground">Email us directly</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Reach out anytime and we will connect you with the right subsystem lead.
        </p>
        <a
          href={`mailto:${content.teamEmail}`}
          className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4"
        >
          {content.teamEmail}
        </a>
      </section>
    )
  }

  const renderSponsorAside = () => {
    const sponsorContent = content.sponsorTab
    if (!sponsorContent) {
      return null
    }

    const blocks: ReactNode[] = []
    const directEmail = renderDirectEmailBlock()
    if (directEmail) {
      blocks.push(directEmail)
    }

    const sponsorHighlights = (sponsorContent.highlights ?? []).filter((item) => Boolean(item && item.trim()))
    if (sponsorHighlights.length > 0) {
      blocks.push(
        <section key="sponsor-highlights" className="rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Why sponsor us</h3>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            {sponsorHighlights.map((highlight, index) => (
              <li key={`${highlight}-${index}`} className="rounded-lg border border-border/50 bg-background/60 px-4 py-3">
                {highlight}
              </li>
            ))}
          </ul>
        </section>,
      )
    }

    if (blocks.length === 0) {
      return null
    }

    return <div className="space-y-6">{blocks}</div>
  }

  const renderJoinAside = () => {
    const joinContent = content.joinTab
    if (!joinContent) {
      return null
    }

    const blocks: ReactNode[] = []
    const directEmail = renderDirectEmailBlock()
    if (directEmail) {
      blocks.push(directEmail)
    }

    const meetings = (joinContent.meetings ?? []).filter((meeting) => Boolean(meeting?.label?.trim()))
    if (meetings.length > 0) {
      blocks.push(
        <section key="join-meetings" className="rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">When we meet</h3>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            {meetings.map(({ label, time, location }, index) => (
              <li key={`${label}-${index}`} className="rounded-lg border border-border/50 bg-background/60 px-4 py-3">
                <p className="font-medium text-foreground">{label}</p>
                {time && <p>{time}</p>}
                {location && <p className="text-xs uppercase tracking-wide text-foreground/70">{location}</p>}
              </li>
            ))}
          </ul>
        </section>,
      )
    }

    const joinHighlights = (joinContent.highlights ?? []).filter((item) => Boolean(item && item.trim()))
    if (joinHighlights.length > 0) {
      blocks.push(
        <section key="join-highlights" className="rounded-2xl border border-border/70 bg-background/70 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground">Why you should join</h3>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            {joinHighlights.map((highlight, index) => (
              <li key={`${highlight}-${index}`} className="rounded-lg border border-border/50 bg-background/60 px-4 py-3">
                {highlight}
              </li>
            ))}
          </ul>
        </section>,
      )
    }

    if (blocks.length === 0) {
      return null
    }

    return <div className="space-y-6">{blocks}</div>
  }

  const activeTabCopy = tabOrder.find((tab) => tab.id === currentTab)
  const activeContent = currentTabData

  return (
    <main className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-5xl flex-col justify-center gap-8 px-6 py-8 sm:gap-10 sm:py-10">
      <section className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">[Contact]</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{content.heroTitle}</h1>
        {content.heroIntro && <p className="max-w-3xl text-sm text-muted-foreground">{content.heroIntro}</p>}
      </section>

      <nav className="flex flex-wrap gap-2" aria-label="Contact options">
        {tabOrder.map((tab) => {
          const isActive = tab.id === currentTab
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id)
                setLastSubmitted(null)
              }}
              className={[
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background/60 text-foreground hover:bg-background/80",
              ].join(" ")}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>

      {activeTabCopy && (
        <section className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">{activeTabCopy.label}</h2>
          {activeTabCopy.description && (
            <p className="text-sm text-muted-foreground">{activeTabCopy.description}</p>
          )}
        </section>
      )}

      <section className="pb-2">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <form
            onSubmit={handleSubmit(currentTab)}
            className="grid gap-4 rounded-2xl border border-border/80 bg-background/80 p-5 shadow-sm sm:p-6"
          >
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {currentTab === "sponsor" ? "Sponsor inquiry" : "Join inquiry"}
              </p>
              <h3 className="text-base font-semibold text-foreground">{activeContent.formHeading}</h3>
              {activeContent.formSubtitle && (
                <p className="text-sm text-muted-foreground">{activeContent.formSubtitle}</p>
              )}
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 focus:ring-offset-background"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 focus:ring-offset-background"
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder={
                  currentTab === "sponsor"
                    ? "Tell us about your organization and how you would like to support the team."
                    : "Share your interests, skills, or questions so we can plug you into the right subteam."
                }
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 focus:ring-offset-background"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                <p>We reply within two business days.</p>
                <p>No spam, just Spartan Racing updates.</p>
              </div>
              <Button type="submit">
                {currentTab === "sponsor" ? "Send sponsor message" : "Send join message"}
              </Button>
            </div>

            {lastSubmitted === currentTab && (
              <p className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Thanks! Your email client is opening so you can send the message.
              </p>
            )}
          </form>

          {(currentTab === "sponsor" ? renderSponsorAside() : renderJoinAside()) ?? null}
        </div>
      </section>
    </main>
  )
}
