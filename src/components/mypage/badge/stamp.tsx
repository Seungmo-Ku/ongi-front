'use client'

import { useGetLastRecordsQuery } from '@/hooks/use-react-query'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'


export const StampComponent = () => {
    const { t } = useTranslation('common')
    const { data } = useGetLastRecordsQuery()
    
    const count = useMemo(() => {
        if (!data) return 0
        return data.count
    }, [data])
    
    const lastRecords = useMemo(() => {
        if (!data) return []
        return data.records
    }, [data])
    
    return (
        <div className='w-full flex flex-col items-start justify-start px-4 py-5 gap-y-4 rounded-[20px] bg-[#EDEDED]/30 text-black'>
            <div className='flex flex-col gap-y-2.5'>
                <p className='text-black text-16-bold'>
                    {t('seven_step_stamp')}
                </p>
                <p className='text-13-regular text-[#5F5F5F]'>
                    {t('seven_step_stamp_description')}
                </p>
            </div>
            <div className='w-full grid grid-cols-7 gap-x-1 shrink-0 justify-start'>
                {
                    Array.from({ length: 7 }).map((_, index) => {
                        if (index + 1 <= count) {
                            const record = lastRecords[index]
                            return (
                                <div
                                    key={index}
                                    className='w-full shrink-0 overflow-hidden flex flex-col gap-y-1.5 items-center justify-start relative'
                                >
                                    <img src={record.imageUrl} className='w-full aspect-square rounded-full shrink-0 object-cover'/>
                                    <img src='/images/check_logo.png' alt='Check logo' className='absolute w-full'/>
                                    <p className='text-[#5F5F5F] text-13-regular'>
                                        {`${record.createdAt.getMonth() + 1}/${record.createdAt.getDate()}`}
                                    </p>
                                </div>
                            )
                        }
                        if (index === 6) { // 마지막 칸
                            return (
                                <div className='w-full aspect-square shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-[#D9D9D9] border-[3px] border-[#5F5F5F] text-13-regular text-[#5F5F5F]' key={index}>
                                    {t('open')}
                                </div>
                            )
                        } else {
                            return (
                                <div className='w-full aspect-square shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-[#D9D9D9] text-13-regular text-[#5F5F5F]' key={index}>
                                    {t('day_n', { day: index + 1 })}
                                </div>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}
