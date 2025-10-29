'use client'

import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode } from 'react'
import { useDirection } from '@/components/layout/direction-provider'


const ClientSideWrapper = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()
    const { direction, pastPath } = useDirection()
    
    const variants = {
        initial: { opacity: 0, x: direction === 'forward' ? 100 : -100 },
        animate: { opacity: 1, x: 0 }
    }
    
    if (pathname.startsWith('/record')) {
        variants.initial.x = -100
    }
    
    if (pathname.startsWith('/calendar') && !pastPath.startsWith('/record')) {
        variants.initial.x = -100
    }
    
    return (
        <AnimatePresence mode='wait'>
            <motion.div
                key={pathname}
                variants={variants}
                initial='initial'
                animate='animate'
                transition={{ duration: 0.3 }}
                className='w-full grow overflow-hidden'
            >
                <div className='w-full h-full flex flex-col items-center overflow-hidden relative'>
                    {children}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default ClientSideWrapper