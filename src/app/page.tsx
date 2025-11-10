'use client'

import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useEffect } from 'react'


export default function Home() {
    const { push } = useDirectionalRouter()
    
    useEffect(() => {
        push('/record')
    }, [push])
    
    return (
        <div
            className='w-full h-full flex flex-col items-center justify-start text-white pt-20 px-6 gap-y-8'
        >
  
        </div>
    )
}
