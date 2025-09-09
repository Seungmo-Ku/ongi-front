'use client'

import { Check, ChevronLeft } from 'lucide-react'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'


export const HeaderCommunication = () => {
    const { back } = useDirectionalRouter()
    const pathname = usePathname()
    const [canGoBack, setCanGoBack] = useState(false)
    
    const isRootPage = useMemo(() => {
        return pathname === '/'
    }, [pathname])
    
    useEffect(() => {
        setCanGoBack(window.history.length > 1 && !isRootPage)
    }, [isRootPage, pathname])
    
    return (
        <div className='w-full flex flex-col items-center justify-center bg-blue-200 gap-y-2.5'>
            <div className='w-full flex flex-row items-center justify-center px-2.5'>
                {
                    canGoBack && (
                        <div className='size-8 shrink-0 items-center justify-center' onClick={back}>
                            <ChevronLeft className='text-ongi-my-communication size-8 shrink-0'/>
                        </div>
                    )
                }
                <div className='grow text-center'>
                    progressbar
                </div>
            </div>
            <div className='w-full px-6'>
                <div className='w-full bg-white/50 rounded-[30px] px-[10px] h-[30px] flex items-center justify-start gap-x-2.5'>
                    <div className='size-[18px] flex items-center justify-center shrink-0 rounded-full bg-white'>
                        <Check className='text-ongi-my-communication w-[14px] h-[14px] shrink-0'/>
                    </div>
                    <p className='text-13-regular text-black'>
                        오늘의 순간 하나를 자세히 털어놓기
                    </p>
                </div>
            </div>
        </div>
    )
}