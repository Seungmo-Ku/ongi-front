'use client'

import { useGetAllRecordsCountQuery, useGetMonthlyRecordsCountQuery } from '@/hooks/use-react-query'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { getAuth } from '@firebase/auth'
import { noop } from 'lodash'
import { useAccount } from '@/components/layout/account-context-provider'
import { useAccountDocument } from '@/hooks/use-account-document'
import { QnAList } from '@/components/mypage/qnalist'
import { MyBadge } from '@/components/mypage/mybadge'


const MyPage = () => {
    const { user, setUser } = useAccount()
    const { updateUserAccount } = useAccountDocument()
    
    const { data: allCount } = useGetAllRecordsCountQuery()
    const { data: monthlyCount } = useGetMonthlyRecordsCountQuery()
    
    const [tap, setTap] = useState<'badge' | 'qna'>('badge')
    
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

    return (
        <div className='w-full h-full flex flex-col items-center justify-start gap-y-8 overflow-y-scroll px-4'>
            <div className='w-full border border-[#D0D5DA] rounded-[10px] grid grid-cols-2 py-2'>
                <div className='w-full border border-transparent border-r-[#D0D5DA] flex flex-col items-center justify-center gap-y-2 py-2'>
                    <p className='text-black text-14-regular'>전체 기록</p>
                    <p className='text-black text-16-bold'>{`${allCount ?? 0}개`}</p>
                </div>
                <div className='w-full border border-transparent border-r-[#D0D5DA] flex flex-col items-center justify-center gap-y-2 py-2'>
                    <p className='text-black text-14-regular'>이번 달 기록</p>
                    <p className='text-black text-16-bold'>{`${monthlyCount ?? 0}개`}</p>
                </div>
            </div>
            <div className='w-full grow flex flex-col items-center justify-start'>
                <div className='w-full flex flex-col items-start z-[5]'>
                    <div className='flex flex-row gap-x-1.5 text-16-bold'>
                        <p
                            className={clsx('transition duration-300 border-[1.5px] border-transparent', tap === 'badge' ? 'text-black border-b-black' : 'text-[#E6E6E6]')}
                            onClick={() => setTap('badge')}
                        >
                            나의 배지
                        </p>
                        <p
                            className={clsx('transition duration-300 border-[1.5px] border-transparent', tap === 'qna' ? 'text-black border-b-black' : 'text-[#E6E6E6]')}
                            onClick={() => setTap('qna')}
                        >
                            백분백답
                        </p>
                    </div>
                    <div className='w-full h-[1px] bg-[#D0D5DA] -translate-y-[0.5px] z-0'/>
                    {
                        tap === 'badge' ? <MyBadge/> : <QnAList/>
                    }
                </div>
            </div>
        </div>
    )
}

export default MyPage