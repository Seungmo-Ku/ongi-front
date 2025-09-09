'use client'

import { useDirectionalRouter } from '@/hooks/use-directional-router'


export default function Home() {
    const { push } = useDirectionalRouter()
    return (
        <div className='w-full h-full flex flex-col items-center justify-center bg-black text-white'>
            <div onClick={() => push('/communication')} className='h-full flex items-center justify-center'>
                /communication
            </div>
            <div onClick={() => push('/communication/diditalk')} className='h-full flex items-center justify-center'>
                /communication/talk
            </div>
        </div>
    )
}
