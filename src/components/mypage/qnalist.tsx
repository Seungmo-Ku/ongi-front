'use client'

import { useGet100QnAQuery } from '@/hooks/use-react-query'
import { useInView } from 'react-intersection-observer'
import { useEffect, useMemo } from 'react'
import { Spinner } from '@/components/spinner'


export const QnAList = () => {
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGet100QnAQuery()
    const { ref, inView } = useInView()
    
    const qnaList = useMemo(() => {
        if (!data) return []
        return data.pages.flatMap(page => page.records)
    }, [data])
    
    useEffect(() => {
        // 다음 페이지가 있고, 감지되었고, 지금 로딩 중이 아니라면
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])
    
    return (
        <div className='w-full flex flex-col items-center justify-start px-2 gap-y-5 mt-6'>
            {
                qnaList.map((item, index) => (
                    <div
                        className='w-full flex flex-col items-start justify-start text-black'
                        key={index}
                    >
                        <p className='text-16-bold break-keep'>
                            {`${index + 1}. ${item.question}`}
                        </p>
                        <p className='text-16-light break-keep flex flex-row'>
                            <span className='w-1 shrink-0'/>
                            {item.answer}
                        </p>
                    </div>
                ))
            }
            {isFetchingNextPage && (
                <div className='flex flex-row items-center justify-center gap-x-2'>
                    <p>로딩중...</p>
                    <Spinner.Loading/>
                </div>
            )}
            <div ref={ref}/>
        </div>
    )
}