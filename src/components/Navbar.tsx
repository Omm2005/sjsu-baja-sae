"use client"

import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import FlipText from './ui/FlipText'
import HamBurgerMenu from './HamBurgerMenu'

type Props = {}
const Navbar = (props: Props) => {
        const navRef = useRef<HTMLElement | null>(null)
        useEffect(() => {
          const updateVar = () => {
            const h = navRef.current?.offsetHeight || 64
            document.documentElement.style.setProperty('--nav-h', `${h}px`)
          }
          updateVar()
          window.addEventListener('resize', updateVar)
          return () => window.removeEventListener('resize', updateVar)
        }, [])
        const navs = [
        { name: 'Spartan Racing', description: '[SJSU Baja SAE]', href: '/' },
        { name: 'Gallery', description:'[Cool Stuff]', href: '/gallery' },
        { name: 'Contact', description: '[Meet the Team]', href: '/contact' },
    ]

  return (
    <nav ref={navRef} className="w-full border-b md:bg-background/80 md:supports-[backdrop-filter]:backdrop-blur-sm">
      <div className="p-6 md:flex gap-6 w-full hidden">
        <div className="hidden flex-wrap w-full items-center justify-between sm:gap-14 md:flex">
          {
            navs.map((nav) => (
                    <a href={nav.href} key={nav.name}>
                        <>
                        <p className="text-xl font-semibold leading-none"> {nav.name} </p>
                        <FlipText className="text-muted-foreground" Text={nav.description} />
                        </>
                    </a>
            ))
          }
          <div />
        </div>
        <Button
          variant="default"
          className="rounded-full px-10 py-4 h-auto text-2xl md:flex hidden font-medium shadow-sm"
        >
            <a href="" >
            <FlipText Text='Donate' />
            </a>
        </Button>
      </div>
      <div className='flex md:hidden w-full p-4 items-center h-auto' >
        <div className="flex-wrap w-full items-start justify-start sm:gap-14 flex flex-col">
                        <p className="text-lg font-semibold leading-none"> Spartan Racing </p>
                        <p className="text-muted-foreground text-sm"> SJSU BAJA SAE </p>
            </div>
        <HamBurgerMenu />
      </div>
    </nav>
  )
}

export default Navbar
