'use client'

import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useCommunicationStep } from '@/components/layout/communication-step-provider'


export default function Home() {
    const { push } = useDirectionalRouter()
    const { setTotalSteps, setCurrentStep, setCurrentGoal } = useCommunicationStep()
    return (
        <div className='w-full h-full flex flex-col items-center justify-center bg-black text-white'>
            <div
                onClick={() => {
                    push('/communication')
                    setTotalSteps(4)
                    setCurrentStep(3)
                    setCurrentGoal('내가 원하는 대로 대화 이끌기')
                }}
                className='h-full flex items-center justify-center'
            >
                /communication
            </div>
            <div
                onClick={() => {
                    push('/login')
                }}
                className='h-full flex items-center justify-center'
            >
                /login
            </div>
        </div>
    )
}
