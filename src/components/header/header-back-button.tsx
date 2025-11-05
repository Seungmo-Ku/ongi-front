'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useDirectionalRouter } from '@/hooks/use-directional-router'


export const HeaderBackButton = () => {
    const { back } = useDirectionalRouter()
    const pathname = usePathname()
    const [canGoBack, setCanGoBack] = useState(false)
    
    const isRootPage = useMemo(() => {
        return pathname === '/'
    }, [pathname])
    
    useEffect(() => {
        setCanGoBack(window.history.length > 1 && !isRootPage)
    }, [isRootPage, pathname])
    
    if (!canGoBack) return null
    
    return (
        <div className='size-8 shrink-0 items-center justify-center' onClick={back}>
            <ChevronLeft className='text-ongi-my-communication size-8 shrink-0'/>
        </div>
    )
}