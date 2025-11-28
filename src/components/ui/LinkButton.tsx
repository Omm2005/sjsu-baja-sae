"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MoveUpRight } from 'lucide-react'

interface LinkButtonProps {
    href: string
    children: React.ReactNode
    className?: string
}

export default function LinkButton({ href, children, className }: LinkButtonProps) {
    return (
        <Link href={href}>
            <motion.span
                className={cn(
                    "group inline-flex items-center gap-2 relative font-medium cursor-pointer",
                    "after:content-[''] after:absolute after:w-full after:h-px",
                    "after:bg-current after:left-0 after:bottom-0",
                    "after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
                    "hover:after:scale-x-100",
                    className
                )}
            >
                {children}
                <MoveUpRight size={16} className="shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.span>
        </Link>
    )
}
