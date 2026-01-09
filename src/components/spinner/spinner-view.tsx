'use client'


import { Spinner } from '@/components/spinner/index'
import { Image } from 'lucide-react'
import { atom, useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface SpinnerViewProps {
    show: boolean
}

export const InitialLoadingAtom = atom<SpinnerViewProps>({
    show: true
})

export const SpinnerViewAtom = atom<SpinnerViewProps>({
    show: false
})

export const SpinnerView = () => {
    const { t } = useTranslation('common')
    const useSpinnerViewAtom = useAtomValue(SpinnerViewAtom)
    const useInitialLoadingAtom = useAtomValue(InitialLoadingAtom)
    const { show: spinnerShow } = useSpinnerViewAtom
    const { show: initialLoadingShow } = useInitialLoadingAtom
    
    const show = useMemo(() => spinnerShow || initialLoadingShow, [spinnerShow, initialLoadingShow])
    
    if (!show) return null
    return (
        <div className='absolute w-full h-full z-10 flex flex-col items-center justify-center bg-white/70 gap-y-5'>
            <Spinner.Loading className='!w-10 !h-10'/>
            <div className='flex flex-row text-16-regular text-black'>
                <p>{t('loading')}</p>
                <Image />
            </div>
        </div>
    )
}