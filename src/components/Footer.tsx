"use client"

import Link from "next/link"
import Image from "next/image"
import FlipText from "@/components/ui/FlipText"

type FooterLink = {
  href: string
  label: string
  external?: boolean | null
}

type SocialLink = {
  href: string
  label: string
  platform?: "x" | "linkedin" | "github" | "custom"
}

type FooterProps = {
  links?: {
    pages?: FooterLink[] | null
    social?: SocialLink[] | null
  }
}

const defaultLinks: Required<FooterProps>["links"] = {
  pages: [
    { href: "/#about", label: "About" },
    { href: "/#team", label: "Team", external: false },
    { href: "/", label: "Sponsors", external: false },
  ],
  social: [
    { href: "https://twitter.com", label: "Twitter", platform: "x" },
    { href: "https://www.linkedin.com", label: "LinkedIn", platform: "linkedin" },
    { href: "https://github.com", label: "GitHub", platform: "github" },
  ],
}

export default function Footer({ links }: FooterProps) {
  const year = new Date().getFullYear()

  const pages = links?.pages && links.pages.length ? links.pages : defaultLinks.pages
  const social = links?.social && links.social.length ? links.social : defaultLinks.social

  const socialIcons: Record<NonNullable<SocialLink["platform"]>, React.FC<React.SVGProps<SVGSVGElement>>> = {
    x: XIcon,
    linkedin: LinkedInIcon,
    github: GitHubIcon,
    custom: LinkIcon,
  }

  return (
    <footer className="mt-auto border-t border-border/60 bg-background/70 supports-[backdrop-filter]:backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <Image
                src="/BAJASJSU.png"
                alt="Spartan Racing Baja"
                width={28}
                height={28}
                className="rounded object-contain"
                priority
              />
              <span className="text-sm font-medium tracking-tight group-hover:opacity-90">
                Spartan Racing Baja
              </span>
            </Link>
            <p className="text-xs text-muted-foreground">© {year} Spartan Racing Baja</p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer" className="flex flex-col gap-8 sm:flex-row sm:gap-12">
            <ul className="space-y-2 text-sm">
              <li className="text-[11px] uppercase tracking-wide text-foreground/70">Pages</li>
              {pages?.map((l) => (
                <li key={`${l.label}-${l.href}`}>
                  <Link
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noreferrer noopener" : undefined}
                    className="inline-block rounded underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <FlipText Text={l.label} />
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="space-y-2 text-sm">
              <li className="text-[11px] uppercase tracking-wide text-foreground/70">Social</li>
              {social?.map(({ href, label, platform }) => {
                const Icon = platform ? socialIcons[platform] : LinkIcon
                return (
                  <li key={`${label}-${href}`}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 rounded underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      aria-label={label}
                    >
                      <Icon className="h-4 w-4 opacity-70" />
                      <FlipText Text={label} />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

/* --- tiny inline icons to keep it minimal — no extra deps --- */
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M6 9v10M6 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3ZM10 19V9h4v2a3 3 0 015 2.5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.19-3.37-1.19-.46-1.16-1.12-1.47-1.12-1.47-.92-.63.07-.62.07-.62 1.02.07 1.56 1.05 1.56 1.05.9 1.55 2.36 1.1 2.94.84.09-.66.35-1.1.63-1.36-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0112 7.5c.85 0 1.7.11 2.5.33 1.9-1.3 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.02 1.59 1.02 2.68 0 3.83-2.35 4.67-4.58 4.92.36.31.68.92.68 1.86v2.76c0 .26.18.57.69.48A10 10 0 0012 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M10 14a5 5 0 01-7 0 5 5 0 010-7 5 5 0 017 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 10a5 5 0 017 0 5 5 0 010 7 5 5 0 01-7 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
