'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ClientSideWrapper from '@/components/layout/client-side-wrapper'
import { DirectionProvider } from '@/components/layout/direction-provider'
import { useEffect } from 'react'
import Header from '@/components/header'
import { Footer } from '@/components/footer/footer'


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
        <head>
            <meta
                name='viewport'
                content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            />
            <title>Ongi</title>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}>
        <div className='max-w-xl max-h-[1200px] mx-auto overflow-hidden bg-white'
             style={{
                 height: 'calc(var(--vh, 1vh) * 100)'
             }}
        >
            <DirectionProvider>
                <ClientSideWrapper>
                    <header className='w-full shrink-0'>
                        <Header.Main/>
                    </header>
                    <div className='w-full flex grow overflow-hidden mb-[100px]'>
                        {children}
                    </div>
                    <footer className='w-full shrink-0 absolute bottom-0'>
                        <Footer/>
                    </footer>
                </ClientSideWrapper>
            </DirectionProvider>
        </div>
        </body>
        </html>
    )
}
