'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/header/index'


export const HeaderMain = () => {
    const pathname = usePathname()
    
    if (pathname.startsWith('/communication')) {
        return <Header.Communication/>
    }
    return null
    
}