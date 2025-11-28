import React from 'react'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const footerLinks = await payload.findGlobal({
    slug: 'footer',
  })

  return (
    <html lang="en">
      <body>
        <main>
          <Navbar />
          {children}
          <Footer links={{ pages: footerLinks.pages, social: footerLinks.social }} />
        </main>
      </body>
    </html>
  )
}
