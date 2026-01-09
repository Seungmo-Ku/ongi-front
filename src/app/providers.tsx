'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { I18nextProvider } from 'react-i18next'
import i18n from '../libs/i18n'


function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000 // 1분
            }
        }
    })
}

// 리렌더링 시에도 QueryClient가 다시 생성되지 않도록 처리
let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
    if (typeof window === 'undefined') {
        // 서버 환경에서는 항상 새 클라이언트를 생성합니다.
        return makeQueryClient()
    }
    
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()
    
    return (
        <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
                {children}
            </I18nextProvider>
            
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}
