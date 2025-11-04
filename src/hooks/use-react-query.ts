'use client'

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query'
import { useAccount } from '@/components/layout/account-context-provider'
import { useRecord } from '@/hooks/use-record'
import { isEmpty } from 'lodash'
import { getWeekSundayDate } from '@/libs/utils/date-calculate'
import { RecordCreateRequest } from '@/libs/dto/record.dto'


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

export const useGetAllRecordsCountQuery = () => {
    const { account } = useAccount()
    const { getAllRecordsCount } = useRecord()
    
    return useQuery({
        queryKey: ['all-records-count', account?.uid],
        queryFn: () => getAllRecordsCount(),
        enabled: !isEmpty(account?.uid),
        staleTime: 1000 * 60 * 5
    })
}

export const useGetMonthlyRecordsCountQuery = () => {
    const { account } = useAccount()
    const { getMonthlyRecordsCount } = useRecord()
    
    return useQuery({
        queryKey: ['monthly-records-count', account?.uid],
        queryFn: () => getMonthlyRecordsCount(),
        enabled: !isEmpty(account?.uid),
        staleTime: 1000 * 60 * 5
    })
}

export const useGet100QnAQuery = (pageLimit: number = 10) => {
    const { account } = useAccount()
    const { get100QnA } = useRecord()
    
    const MAX_PAGE = 100 / pageLimit
    
    return useInfiniteQuery({
        queryKey: ['100-qna', account?.uid],
        queryFn: ({ pageParam }) => get100QnA({ pageParam, pageLimit }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.records.length < pageLimit) {
                return undefined
            }
            if (allPages.length >= MAX_PAGE) {
                return undefined
            }
            
            return lastPage.lastVisible
        },
        enabled: !!account?.uid
    })
}

export const useGetLastRecordsQuery = () => {
    const { account } = useAccount()
    const { getLastRecords } = useRecord()
    
    return useQuery({
        queryKey: ['last-records', account?.uid],
        queryFn: () => getLastRecords(),
        enabled: !!account?.uid,
        staleTime: 1000 * 60 * 5
    })
}

export const useCreateRecordMutation = () => {
    const { account } = useAccount()
    const { createRecord } = useRecord()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (request: RecordCreateRequest) => await createRecord(request),
        onSuccess: async (data) => {
            if (!data) return
            const date = new Date()
            await queryClient.invalidateQueries({ queryKey: ['monthly', account?.uid, date.getFullYear(), date.getMonth()] })
            await queryClient.invalidateQueries({ queryKey: ['weekly', account?.uid, date.getFullYear(), date.getMonth(), getWeekSundayDate(date)] })
            await queryClient.invalidateQueries({ queryKey: ['single', account?.uid, date.getFullYear(), date.getMonth(), date.getDate()] })
            await queryClient.invalidateQueries({ queryKey: ['all-records-count', account?.uid] })
            await queryClient.invalidateQueries({ queryKey: ['monthly-records-count', account?.uid] })
            await queryClient.invalidateQueries({ queryKey: ['last-records', account?.uid] })
        }
    })
}