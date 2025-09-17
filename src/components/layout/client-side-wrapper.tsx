'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useDirection } from '@/components/layout/direction-provider'


const ClientSideWrapper = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()
    const { direction } = useDirection()
    
    const variants = {
        initial: { opacity: 0, x: direction === 'forward' ? 100 : -100 },
        animate: { opacity: 1, x: 0 }
    }
    
    return (
        <AnimatePresence mode='wait'>
            <motion.div
                key={pathname}
                variants={variants}
                initial='initial'
                animate='animate'
                transition={{ duration: 0.3 }}
                className='w-full h-full flex flex-col items-center overflow-hidden'
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default ClientSideWrapper