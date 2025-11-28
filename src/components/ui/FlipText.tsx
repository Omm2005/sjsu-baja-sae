'use client'

import React from 'react'
import { motion } from 'framer-motion'

type Props = {
    Text: string,
    className?: string
}

const FlipText = ({
    Text,
    className
}: Props) => {
  return (
    <motion.p 
    initial='initial'
    whileHover='hovered'
    className={`${className} relative inline-block overflow-hidden whitespace-nowrap align-middle`}
    >
        <motion.span
        className='block will-change-transform'
        variants={{
            initial: { y: 0 },
            hovered: { y: "-100%" }
        }}
        transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
        >
            {Text}
        </motion.span>
        <motion.span
        className='absolute inset-0 will-change-transform'
        variants={{
            initial: { y: "100%" },
            hovered: { y: 0 }
        }}
        transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
        aria-hidden
        >
            {Text}
        </motion.span>
    </motion.p>
  )
}

export default FlipText
