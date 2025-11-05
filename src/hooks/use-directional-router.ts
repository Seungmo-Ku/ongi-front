'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useDirection } from '@/components/layout/direction-provider'


export const useDirectionalRouter = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { setDirection, setPastPath } = useDirection()
    
    const push = (path: string) => {
        setPastPath(pathname)
        setDirection('forward')
        router.push(path)
    }
    
    const back = () => {
        setDirection('backward')
        router.back()
    }
    
    return { push, back }
}