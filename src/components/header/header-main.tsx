'use client'

import { usePathname } from 'next/navigation'
import { useCurrentDate } from '@/components/layout/current-date-provider'
import { Calendar, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { useCallback, useMemo } from 'react'


export const HeaderMain = () => {
    const pathname = usePathname()
    const { currentDate, setCurrentDate, calendarMode, setCalendarMode } = useCurrentDate()
    
    const changeMonth = useCallback((amount: number) => {
        const prev = currentDate
        if (pathname.startsWith('/calendar')) {
            setCurrentDate(new Date(prev.getFullYear(), prev.getMonth() + amount, prev.getDate()))
            return
        }
        setCurrentDate(new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + (amount * 7)))
    }, [currentDate, pathname, setCurrentDate])
    
    const isMyPage = useMemo(() => {
        return pathname.startsWith('/my')
    }, [pathname])
    
    const isRegisterPage = useMemo(() => {
        return pathname.startsWith('/login') && pathname.endsWith('/register')
    }, [pathname])
    
    const title = useMemo(() => {
        if (isMyPage) return <p>마이페이지</p>
        if (isRegisterPage) return <p>회원가입</p>
        if (currentDate) {
            return <p>{`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}</p>
        } else return null
    }, [currentDate, isMyPage, isRegisterPage])
    
    const showChevron = useMemo(() => {
        return !isRegisterPage && !isMyPage
    }, [isMyPage, isRegisterPage])
    
    if (pathname.startsWith('/login') && !pathname.endsWith('/register')) return null
    
    return (
        <div className='w-full h-[88px] p-4 shrink-0 flex flex-col justify-start gap-y-4'>
            <img src='/images/logo.png' alt='logo' className='w-[100px] aspect-[722/152]'/>
            <div className='w-full flex justify-between text-16-bold text-[#121212]'>
                {title}
                {
                    showChevron && (
                        <div className='flex flex-row gap-x-2 shrink-0 h-full'>
                            <ChevronLeft
                                className='h-6 shrink-0'
                                onClick={() => {
                                    changeMonth(-1)
                                }}
                            />
                            <ChevronRight
                                className='h-6 shrink-0'
                                onClick={() => {
                                    changeMonth(1)
                                }}
                            />
                            {
                                pathname.startsWith('/calendar') &&
                                (
                                    calendarMode === 'calendar' ? (
                                        <LayoutGrid
                                            className='h-6 shrink-0'
                                            onClick={() => {
                                                setCalendarMode('calendar')
                                            }}
                                        />
                                    ) : (
                                        <Calendar
                                            className='h-6 shrink-0'
                                            onClick={() => {
                                                setCalendarMode('grid')
                                            }}
                                        />
                                    )
                                )
                            }
                        </div>
                    )
                }
            </div>
        
        </div>
    )
    
}