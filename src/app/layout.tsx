'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ClientSideWrapper from '@/components/layout/client-side-wrapper'
import { DirectionProvider } from '@/components/layout/direction-provider'
import { useEffect } from 'react'
import Header from '@/components/header'


const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    useEffect(() => {
        const isInWebView =
            navigator.userAgent.includes('wv') || // 안드로이드 WebView
            window.navigator.userAgent.includes('WebView') // iOS WebView
        if (!isInWebView) {
            function setViewportHeight() {
                const vh = window.innerHeight * 0.01
                document.documentElement.style.setProperty('--vh', `${vh}px`)
            }
            
            window.addEventListener('resize', setViewportHeight)
            setViewportHeight()
            return () => window.removeEventListener('resize', setViewportHeight)
        }
    }, [])
    
    return (
        <html lang='ko'>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}>
        <div className='max-w-xl max-h-[1200px] mx-auto overflow-hidden bg-gray-400'
             style={{
                 height: 'calc(var(--vh, 1vh) * 100)'
             }}
        >
            <DirectionProvider>
                <ClientSideWrapper>
                    <header className='w-full shrink-0'>
                        <Header.Main/>
                    </header>
                    {children}
                </ClientSideWrapper>
            </DirectionProvider>
        </div>
        </body>
        </html>
    )
}
