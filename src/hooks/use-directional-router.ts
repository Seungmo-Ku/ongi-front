'use client'

import { useRouter } from 'next/navigation'
import { useDirection } from '@/components/layout/direction-provider'


export const useDirectionalRouter = () => {
    const router = useRouter()
    const { setDirection } = useDirection()
    
    const push = (path: string) => {
        setDirection('forward')
        router.push(path)
    }
    
    const back = () => {
        setDirection('backward')
        router.back()
    }
    
    return { push, back }
}