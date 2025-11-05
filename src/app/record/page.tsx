'use client'

import RecordUploadPage from '@/app/record/upload/page'
import React, { useEffect, useMemo } from 'react'
import { useAccount } from '@/components/layout/account-context-provider'
import { useCurrentDate } from '@/components/layout/current-date-provider'
import Button from '@/components/button'
import clsx from 'clsx'
import { getAuth } from '@firebase/auth'
import { noop } from 'lodash'
import { useAccountDocument } from '@/hooks/use-account-document'
import { useGetTodayRecordQuery, useGetWeeklyRecordsQuery } from '@/hooks/use-react-query'
import { useSetAtom } from 'jotai'
import { SpinnerViewAtom } from '@/components/spinner/spinner-view'


export default function RecordPage() {
    const { user, setUser } = useAccount()
    const { updateUserAccount } = useAccountDocument()
    
    const { currentDate, showingDate, setShowingDate } = useCurrentDate()
    
    const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
    
    const { data: weeklyRecord } = useGetWeeklyRecordsQuery(currentDate)
    const { data: todayRecord, isLoading } = useGetTodayRecordQuery(showingDate)
    
    const setLoadingShow = useSetAtom(SpinnerViewAtom)
    
    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (user?.uid === firebaseUser?.uid) return
            setUser(firebaseUser)
            if (firebaseUser) updateUserAccount(firebaseUser).then(noop)
        })
        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setUser, updateUserAccount])
    
    const getDateForWeekIndex = (index: number) => {
        // 기준 날짜가 속한 주의 "일요일"에 해당하는 날짜 숫자를 계산
        const sundayDateNumber = currentDate.getDate() - currentDate.getDay()
        
        // new Date()가 자동으로 월/연도를 올바르게 계산해 줍니다.
        return new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            sundayDateNumber + index
        ) // e.g., Date 객체 (2025-11-01)
    }
    
    useEffect(() => {
        if (todayRecord) setLoadingShow({ show: false })
    }, [setLoadingShow, todayRecord])
    
    const showingDayComponent = useMemo(() => {
        if (!todayRecord) return null
        return (
            <div className='w-full flex flex-col items-center justify-center gap-y-7'>
                <img
                    src={todayRecord.imageUrl}
                    alt={`image-${showingDate.toLocaleDateString()}`}
                    className='w-full aspect-square shrink-0 object-contain rounded-[15px]'
                />
                <p className='text-black text-14-regular gap-x-1'>
                    <span className='text-14-bold mr-1'>
                        Q
                    </span>
                    {todayRecord.question}
                </p>
                <p className='text-black text-14-regular gap-x-1'>
                    <span className='text-14-bold mr-1'>
                        A
                    </span>
                    {todayRecord.answer}
                </p>
            </div>
        )
    }, [showingDate, todayRecord])
    
    return (
        <div className='w-full h-full flex flex-col items-center justify-start gap-y-5 overflow-y-scroll px-5'>
            <div className='w-full grid grid-cols-7 gap-x-2.5'>
                {
                    DAY_NAMES.map((name, index) => {
                        const record = weeklyRecord?.[index] ?? null
                        const dateForButton = getDateForWeekIndex(index)
                        const dayNumber = dateForButton.getDate()
                        const isSelected = dateForButton.toDateString() === showingDate.toDateString()
                        const isToday = dateForButton.toDateString() === new Date().toDateString()
                        
                        return (
                            <div key={name} className='flex flex-col items-center justify-start gap-y-1 w-full'>
                                <Button.Calendar
                                    recordForDay={record}
                                    day={dayNumber}
                                    onClick={() => {
                                        setShowingDate(dateForButton)
                                    }}
                                    isSelected={isSelected}
                                    isToday={isToday}
                                />
                                <div className={clsx('text-10-regular text-black text-center rounded-full p-1 shrink-0 w-[15px] h-[15px] flex items-center justify-center',
                                    isSelected ? 'bg-[#3674B5] !text-white' : isToday ? 'bg-[#C6F3FF]' : 'bg-none')}>
                                    <p>{name}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <p className='text-16-bold text-black text-left self-start'>하루 한장 기록</p>
            {
                isLoading ? (
                    <div className='w-full flex flex-col items-center justify-center gap-y-7'>
                        <div
                            className='w-full aspect-square shrink-0 object-contain rounded-[15px] bg-[#EFEFEF] animate-pulse'
                        />
                    </div>
                ) : (
                    !todayRecord ? <RecordUploadPage/> : (showingDayComponent)
                )
            }
        </div>
    )
}