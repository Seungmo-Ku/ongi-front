'use client'

import { usePathname } from 'next/navigation'
import { useCurrentDate } from '@/components/layout/current-date-provider'
import { Calendar, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'


export const HeaderMain = () => {
    const pathname = usePathname()
    const { currentDate, setCurrentDate, calendarMode, setCalendarMode } = useCurrentDate()
    
    const changeMonth = (amount: number) => {
        const prev = currentDate
        if (pathname.startsWith('/calendar')) {
            setCurrentDate(new Date(prev.getFullYear(), prev.getMonth() + amount, prev.getDate()))
            return
        }
        setCurrentDate(new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + (amount * 7)))
    }
    
    if(pathname.startsWith('/login')) return null
    
    return (
        <div className='w-full h-14 shrink-0 p-4 flex justify-between text-16-bold text-[#121212]'>
            <p>
                {`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}
            </p>
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
                        calendarMode === 'grid' ? (
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
        </div>
    )
    
}