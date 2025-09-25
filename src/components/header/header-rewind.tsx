'use client'

import Button from '@/components/button'
import { useRewindStep } from '@/components/layout/rewind-step-provider'
import clsx from 'clsx'
import { useDirectionalRouter } from '@/hooks/use-directional-router'


export const HeaderRewind = () => {
    
    const { step, setStep } = useRewindStep()
    const { back } = useDirectionalRouter()
    
    return (
        <div
            className={clsx('w-full flex items-center gap-y-2.5 px-4 pt-4', (step === 0) ? 'justify-between' : 'justify-end')}
        >
            {
                (step === 0) && (
                    <Button.Communication
                        className='!w-fit !h-7 !text-12-regular px-4 bg-white/50 !text-[#7B7B7B]'
                        onClick={() => {
                            setStep(1)
                        }}
                    >
                        {'>> SKIP'}
                    </Button.Communication>
                )
            }
            <Button.Communication
                className='!w-fit !h-7 !text-12-regular px-4'
                onClick={() => {
                    back()
                }}
            >
                종료하기
            </Button.Communication>
        </div>
    )
}