import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ClientSideWrapper from '@/components/layout/client-side-wrapper'
import { DirectionProvider } from '@/components/layout/direction-provider'
// import { useEffect } from 'react'
import Header from '@/components/header'
import { Footer } from '@/components/footer/footer'
import { Metadata, Viewport } from 'next'
import Providers from '@/app/providers'


export const metadata: Metadata = {
    title: 'Ongi'
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
}

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
    
    // useEffect(() => {
    //     const isInWebView =
    //         navigator.userAgent.includes('wv') || // 안드로이드 WebView
    //         window.navigator.userAgent.includes('WebView') // iOS WebView
    //     if (!isInWebView) {
    //         function setViewportHeight() {
    //             const vh = window.innerHeight * 0.01
    //             document.documentElement.style.setProperty('--vh', `${vh}px`)
    //         }
    //
    //         window.addEventListener('resize', setViewportHeight)
    //         setViewportHeight()
    //         return () => window.removeEventListener('resize', setViewportHeight)
    //     }
    // }, [])
    
    return (
        <html lang='ko'>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased w-full`}>
        <div className='max-w-xl max-h-[1200px] mx-auto overflow-hidden bg-white'
             style={{
                 height: 'calc(var(--vh, 1vh) * 100)'
             }}
        >
            <Providers>
                <DirectionProvider>
                    <div className='w-full h-full flex flex-col items-center overflow-hidden relative'>
                        <header className='w-full shrink-0'>
                            <Header.Main/>
                        </header>
                        <ClientSideWrapper>
                            <div className='w-full h-full flex overflow-hidden'>
                                {children}
                            </div>
                        </ClientSideWrapper>
                        <footer className='w-full shrink-0'>
                            <Footer/>
                        </footer>
                    </div>
                
                </DirectionProvider>
            </Providers>
        </div>
        </body>
        </html>
    )
}
