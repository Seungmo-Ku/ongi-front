'use client'


import { Spinner } from '@/components/spinner/index'
import { Image } from 'lucide-react'
import { atom, useAtomValue } from 'jotai'

interface SpinnerViewProps {
    show: boolean
}

export const SpinnerViewAtom = atom<SpinnerViewProps>({
    show: false
})

export const SpinnerView = () => {
    
    const useSpinnerViewAtom = useAtomValue(SpinnerViewAtom)
    const { show } = useSpinnerViewAtom
    
    if (!show) return null
    return (
        <div className='absolute w-full h-full z-10 flex flex-col items-center justify-center bg-white/70 gap-y-5'>
            <Spinner.Loading className='!w-10 !h-10'/>
            <div className='flex flex-row text-16-regular text-black'>
                <p>로딩중..</p>
                <Image />
            </div>
        </div>
    )
}