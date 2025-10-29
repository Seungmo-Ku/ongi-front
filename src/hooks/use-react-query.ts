'use client'

import { useQuery } from 'react-query'
import { useAccount } from '@/components/layout/account-context-provider'
import { useRecord } from '@/hooks/use-record'
import { isEmpty } from 'lodash'
import { getWeekSundayDate } from '@/libs/utils/date-calculate'

export const useGetMonthlyRecordsQuery = (date: Date) => {
    const { account } = useAccount()
    const { getMonthlyRecords } = useRecord()
    
    return useQuery({
        queryKey: ['monthly', account?.uid, date.getFullYear(), date.getMonth()],
        queryFn: () => getMonthlyRecords(date),
        enabled: !isEmpty(account?.uid) && !!date,
        staleTime: 1000 * 60 * 5
    })
}

export const useGetWeeklyRecordsQuery = (date: Date) => {
    const { account } = useAccount()
    const { getWeeklyRecords } = useRecord()
    
    return useQuery({
        queryKey: ['weekly', account?.uid, date.getFullYear(), date.getMonth(), getWeekSundayDate(date)],
        queryFn: () => getWeeklyRecords(date),
        enabled: !isEmpty(account?.uid) && !!date,
        staleTime: 1000 * 60 * 5
    })
}

export const useGetTodayRecordQuery = (date: Date) => {
    const { account } = useAccount()
    const { getTodayRecord } = useRecord()
    
    return useQuery({
        queryKey: ['single', account?.uid, date.getFullYear(), date.getMonth(), date.getDate()],
        queryFn: () => getTodayRecord(date),
        enabled: !isEmpty(account?.uid) && !!date,
        staleTime: 1000 * 60 * 5
    })
}