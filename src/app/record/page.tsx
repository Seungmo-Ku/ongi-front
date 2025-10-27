'use client'

import RecordUploadPage from '@/app/record/upload/page'
import { useRecord } from '@/hooks/use-record'
import React, { useEffect, useState } from 'react'
import { Record } from '@/libs/interfaces/record.interface'
import { useAccount } from '@/components/layout/account-context-provider'
import { useCurrentDate } from '@/components/layout/current-date-provider'
import Button from '@/components/button'
import clsx from 'clsx'
import { getAuth } from '@firebase/auth'
import { noop } from 'lodash'
import { useAccountDocument } from '@/hooks/use-account-document'


export default function RecordPage() {
    const { account, user, setUser } = useAccount()
    const { updateUserAccount } = useAccountDocument()
    const { getTodayRecord, getWeeklyRecords } = useRecord()
    
    const [todayRecord, setTodayRecord] = useState<Record | null | undefined>(undefined)
    const [weeklyRecord, setWeeklyRecord] = useState<{ [day: number]: Record }>({})
    const [isLoading, setIsLoading] = useState(false)
    const [isWeeklyLoading, setIsWeeklyLoading] = useState(false)
    
    const { currentDate, showingDate, setShowingDate } = useCurrentDate()
    
    const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
    
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
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const record = await getTodayRecord(showingDate)
            setTodayRecord(record)
            setIsLoading(false)
        }
        
        if (account) { // account 정보가 있을 때만 실행
            fetchData()
        }
    }, [account, currentDate, getTodayRecord, showingDate]) // currentDate나 account가 바뀌면 재실행
    
    useEffect(() => {
        const fetchData = async () => {
            setIsWeeklyLoading(true)
            const records = await getWeeklyRecords(currentDate)
            setWeeklyRecord(records)
            setIsWeeklyLoading(false)
        }
        
        if (account) { // account 정보가 있을 때만 실행
            fetchData()
        }
    }, [account, currentDate, getWeeklyRecords, showingDate]) // currentDate나 account가 바뀌면 재실행
    
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
    
    return (
        <div className='w-full h-full flex flex-col items-center justify-start gap-y-5 overflow-y-scroll px-5'>
            <div className='w-full grid grid-cols-7 gap-x-2.5'>
                {
                    DAY_NAMES.map((name, index) => {
                        const record = weeklyRecord[index]
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
                (isLoading || isWeeklyLoading) ? (
                    <div className='w-full flex flex-col items-center justify-center gap-y-7'>
                        <div
                            className='w-full aspect-square shrink-0 object-contain rounded-[15px] bg-gray-400 animate-pulse'
                        />
                    </div>
                ) : (
                    !todayRecord ? <RecordUploadPage/> : (
                        <div className='w-full flex flex-col items-center justify-center gap-y-7'>
                            <img
                                src={todayRecord.imageUrl}
                                alt={`image-${currentDate.toLocaleDateString()}`}
                                className='w-full aspect-square shrink-0 object-contain rounded-[15px]'
                            />
                            <p className='text-black text-14-regular gap-x-1'>
                                <span className='text-14-bold mr-1'>
                                    Q
                                </span>
                                {todayRecord.question}
                            </p>
                            <p className='text-black text-14-regular gap-x-1 self-start'>
                                <span className='text-14-bold mr-1'>
                                    A
                                </span>
                                {todayRecord.answer}
                            </p>
                        </div>
                    )
                )
            }
        </div>
    )
}