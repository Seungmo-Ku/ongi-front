'use client'

import React, { useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { Button } from '@headlessui/react'
import { Calendar, Compass, User } from 'lucide-react'
import { useDirectionalRouter } from '@/hooks/use-directional-router'


export const Footer = () => {
    const { push } = useDirectionalRouter()
    const pathname = usePathname()
    
    const selected = useMemo(() => {
        if (pathname.startsWith('/record')) {
            return 0
        } else if (pathname.startsWith('/calendar')) {
            return 1
        } else if (pathname.startsWith('/my')) {
            return 2
        } else return 0
    }, [pathname])
    
    const footerButtonComponent = useCallback((text: string, currentIndex: number, onClick?: () => void) => {
        const isSelected = selected === currentIndex
        const iconClassname = 'h-5 w-5 shrink-0 ' + (isSelected ? 'text-[#45709E]' : 'text-[#C6C6C9]')
        const icon = currentIndex === 0 ? (
            <Compass className={iconClassname}/>
        ) : currentIndex === 1 ? (
            <Calendar className={iconClassname}/>
        ) : (
                <User className={iconClassname}/>
            )
        
        return (
            <Button
                className={
                    clsx(
                        'h-10 flex flex-col p-2 items-center justify-center cursor-pointer',
                        isSelected ? 'text-[#1F2024] text-10-bold' : 'text-[#71727A] text-10-regular'
                    )
                }
                onClick={onClick}
            >
                {icon}
                {text}
            </Button>
        )
    }, [selected])
    
    if (pathname.startsWith('/login')) return null
    
    return (
        <div className='w-full shrink-0 pt-4 pb-8 px-4 grid grid-cols-3 items-center justify-center text-white z-[1] bg-white'>
            {footerButtonComponent('기록', 0, () => push('/record'))}
            {footerButtonComponent('캘린더', 1, () => push('/calendar'))}
            {footerButtonComponent('My', 2, () => push('/my'))}
        </div>
    )
}