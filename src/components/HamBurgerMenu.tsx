"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type Props = {}

const HamBurgerMenu = (props: Props) => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [selectedIndicator, setSelectedIndicator] = useState(pathname)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const items = [
    { label: 'Home', href: '/' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <div className="md:hidden">
      {/* Toggle button */}
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="hbm-panel"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-10 items-center justify-center rounded-full border bg-background hover:bg-accent transition-colors"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Overlay + Panel */}
      <div
        id="hbm-panel"
        className={`fixed inset-0 z-[9999] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Drawer */}
        <aside
          className={`absolute right-0 top-0 bottom-0 w-[78%] max-w-sm border-l bg-background shadow-xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="p-6 flex flex-col h-full gap-6">
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">Navigation</span>
              <button
                className="inline-flex size-9 items-center justify-center rounded-full border bg-background hover:bg-accent transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 grid content-start gap-3">
              {items.map((item) => {
                const active = (selectedIndicator || pathname) === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setSelectedIndicator(item.href)
                      setOpen(false)
                    }}
                    aria-current={active ? 'page' : undefined}
                    className={`rounded-lg px-3 py-2 text-base transition-colors ${active ? 'bg-accent text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-accent'}`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="grid gap-3">
              <Link
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full h-10 px-5 text-sm font-medium bg-foreground text-background hover:opacity-90"
              >
                Donate
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default HamBurgerMenu
