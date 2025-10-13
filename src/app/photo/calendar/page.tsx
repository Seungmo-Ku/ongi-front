'use client'

import { useAccount } from '@/components/layout/account-context-provider'
import { useRecord } from '@/hooks/use-record'
import { useCallback, useEffect, useState } from 'react'
import { Record } from '@/libs/interfaces/record.interface'
import { getAuth } from '@firebase/auth'
import { noop } from 'lodash'
import { useAccountDocument } from '@/hooks/use-account-document'


export default function PhotoCalendarPage() {
    const { account, user, setUser } = useAccount()
    const { getMonthlyRecords } = useRecord()
    const { updateUserAccount } = useAccountDocument()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [monthlyRecords, setMonthlyRecords] = useState<{ [day: number]: Record }>({})
    const [isLoading, setIsLoading] = useState(false)
    
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
            // 함수를 호출하고 결과를 state에 저장합니다.
            const records = await getMonthlyRecords(currentDate)
            setMonthlyRecords(records)
            setIsLoading(false)
        }
        
        if (account) { // account 정보가 있을 때만 실행
            fetchData()
        }
    }, [account, currentDate, getMonthlyRecords]) // currentDate나 account가 바뀌면 재실행
    
    console.log('monthlyRecords', monthlyRecords)
    
    // 월을 이전/다음으로 변경하는 함수
    const changeMonth = useCallback((amount: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1))
    }, [])
    
    const renderCalendarGrid = () => {
        // (실제 구현 시에는 해당 월의 첫 날 요일, 마지막 날 등을 계산해야 합니다)
        return Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
            const recordForDay = monthlyRecords[day] // 해당 날짜의 기록을 가져옴
            
            return (
                <div key={day} className='border h-32 flex flex-col items-center p-1'>
                    <span className='font-bold'>{day}</span>
                    {recordForDay ? (
                        // 기록이 있으면 이미지 출력
                        <img
                            src={recordForDay.imageUrl}
                            alt={`Record for day ${day}`}
                            className='w-full h-full object-cover mt-1 rounded-sm cursor-pointer'
                            onClick={() => alert(`질문: ${recordForDay.question}\n답변: ${recordForDay.answer}`)}
                        />
                    ) : (
                         // 기록이 없으면 빈 칸
                         <div className='w-full h-full bg-gray-50 mt-1'/>
                     )}
                </div>
            )
        })
    }
    
    if (!account) {
        return (
            <div className='h-full w-full flex flex-col overflow-hidden items-center justify-center gap-y-5 px-3'>
                <p className='text-black'>No Account</p>
            </div>
        )
    }
    
    return (
        <div className='h-full w-full flex flex-col overflow-hidden items-center justify-center gap-y-5'>
            <div className='flex justify-between items-center mb-4'>
                <button onClick={() => changeMonth(-1)} className='p-2 border rounded'>이전 달</button>
                <h2 className='text-2xl font-bold'>
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                </h2>
                <button onClick={() => changeMonth(1)} className='p-2 border rounded'>다음 달</button>
            </div>
            
            {isLoading ? (
                <div className='text-center p-10'>로딩 중...</div>
            ) : (
                 <div className='grid grid-cols-7 gap-1 w-full'>
                     {renderCalendarGrid()}
                 </div>
             )}
        </div>
    )
}