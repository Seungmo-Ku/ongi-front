'use client'

import { useAccount } from '@/components/layout/account-context-provider'
import { useCurrentDate } from '@/components/layout/current-date-provider'
import Button from '@/components/button'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useGetMonthlyRecordsQuery } from '@/hooks/use-react-query'
import { useTranslation } from 'react-i18next'


export default function PhotoCalendarPage() {
    const { t } = useTranslation('common')
    const { account } = useAccount()
    const { push } = useDirectionalRouter()
    
    const { currentDate, setShowingDate, setCurrentDate, calendarMode } = useCurrentDate()
    
    const DAY_NAMES = [t('day_sun'), t('day_mon'), t('day_tue'), t('day_wed'), t('day_thu'), t('day_fri'), t('day_sat')]
    
    const { data: monthlyRecords, isLoading } = useGetMonthlyRecordsQuery(currentDate)
    
    const renderCalendar = () => {
        if (!monthlyRecords || isLoading) return []
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        
        const firstDayOfMonth = new Date(year, month, 1).getDay()
        
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        
        const paddingDays = []
        for (let i = 0 ; i < firstDayOfMonth ; i++) {
            paddingDays.push(
                <div key={`pad-${i}`}/>
            )
        }
        
        const dayButtons = []
        for (let day = 1 ; day <= daysInMonth ; day++) {
            const recordForDay = monthlyRecords[day]
            dayButtons.push(
                <Button.Calendar
                    recordForDay={recordForDay}
                    day={day}
                    key={day}
                    onClick={() => {
                        setShowingDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                        push('/record')
                    }}
                />
            )
        }
        
        return [...paddingDays, ...dayButtons]
    }
    
    const renderGrid = () => {
        if (!monthlyRecords || isLoading) return []
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        
        const dayButtons = []
        for (let day = 1 ; day <= daysInMonth ; day++) {
            const recordForDay = monthlyRecords[day]
            if (!recordForDay) continue
            dayButtons.push(
                <div
                    key={`grid-${day}`}
                    className='w-full aspect-square shrink-0 rounded-[15px] overflow-hidden relative'
                    onClick={() => {
                        setShowingDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
                        push('/record')
                    }}
                >
                    <div className='absolute w-full h-full z-[1] bg-black/30'/>
                    <img src={recordForDay.imageUrl} alt='imageUrl' className='w-full h-full opacity-60 object-cover'/>
                    <p className='absolute text-white z-[2] text-16-bold bottom-2.5 left-2'>
                        {t('month_day_format', { month: month + 1, day })}
                    </p>
                </div>
            )
        }
        
        return dayButtons
    }
    
    if (!account) {
        return (
            <div className='h-full w-full flex flex-col overflow-hidden items-center justify-center gap-y-5 px-3'>
                <p className='text-black'>{t('no_account')}</p>
            </div>
        )
    }
    
    return (
        <div className='h-full w-full flex flex-col overflow-y-scroll items-center justify-start gap-y-5 shrink-0'>
            {isLoading ? (
                <div className='text-center p-10'>{t('loading')}</div>
            ) : (
                 calendarMode === 'calendar' ? (
                     <div className='grid grid-cols-7 gap-1 gap-y-5 w-full px-3'>
                         {DAY_NAMES.map((day) => {
                             return (
                                 <div key={day} className='text-center text-black text-14-bold'>
                                     {day}
                                 </div>
                             )
                         })}
                         {renderCalendar()}
                     </div>
                 ) : ( // grid
                     <div className='grid grid-cols-2 gap-[5px] w-full px-3'>
                         {renderGrid()}
                     </div>
                 )
             )}
        
        </div>
    )
}
