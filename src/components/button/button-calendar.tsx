'use client'

import { Record } from '@/libs/interfaces/record.interface'
import clsx from 'clsx'


interface ButtonCalendarProps {
    recordForDay: Record | null | undefined
    day: number
    onClick?: () => void
    isSelected?: boolean
    isToday?: boolean
}

export const ButtonCalendar = ({
    recordForDay = null,
    day,
    onClick,
    isSelected = false,
    isToday = false,
    ...props
}: ButtonCalendarProps) => {
    
    return (
        <div
            {...props}
            className='relative flex flex-col items-center overflow-hidden w-full h-full'
        >
            {recordForDay ? (
                // 기록이 있으면 이미지 출력
                <div className={
                    clsx('relative w-full aspect-[50/64] shrink-0 rounded-[24px] object-cover cursor-pointer bg-black/60',
                        isSelected ? 'border-[2px] border-[#3674B5]' : 'border-none')
                }>
                    <img
                        src={recordForDay.imageUrl}
                        alt={`Record for day ${day}`}
                        className='w-full aspect-[50/64] shrink-0 rounded-[24px] object-cover cursor-pointer opacity-60'
                        onClick={onClick}
                    />
                </div>
            ) : (
                 // 기록이 없으면 빈 칸
                 <div
                     className={clsx('w-full aspect-[50/64] shrink-0 rounded-[24px] bg-[#F5F5F5]', isSelected ? 'border-[2px] border-[#3674B5]' : 'border-none')}
                     onClick={() => {
                         if (isToday && onClick) {
                             onClick()
                         }
                     }}
                 />
             )}
            <span className='text-12-bold text-white absolute bottom-2 shadow-black shadow-2xl rounded-full'>{day}</span>
        </div>
    )
}