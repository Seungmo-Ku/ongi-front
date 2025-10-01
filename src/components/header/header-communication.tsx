'use client'

import { HeaderCommunicationProgressbar } from '@/components/header/communucation/header-communication-progressbar'
import { useCommunicationStep } from '@/components/layout/communication-step-provider'
import Button from '@/components/button'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useGetEmpathy } from '@/hooks/use-get-empathy'
import useAccount from '@/hooks/use-account'
import { usePathname } from 'next/navigation'
import { isEmpty } from 'lodash'


export const HeaderCommunication = () => {
    
    const { currentStep, totalSteps, chat, sid, emotionList, isLoading, setIsLoading } = useCommunicationStep()
    const pathname = usePathname()
    
    const { back } = useDirectionalRouter()
    const { createEmpathy } = useGetEmpathy()
    const { account } = useAccount()
    
    return (
        <div
            className='w-full flex flex-col items-center justify-center gap-y-2.5'
        >
            <div className='w-full flex flex-row items-center justify-center pl-2.5 pr-5 gap-x-2'>
                {/*<Header.BackButton/>*/}
                <div className='grow text-center shrink-0 min-h-10 flex items-center justify-center'>
                    {
                        !pathname.startsWith('/communication/rewind') && (
                            <HeaderCommunicationProgressbar totalSteps={totalSteps} currentStep={currentStep}/>
                        )
                    }
                </div>
                <Button.Communication
                    className='!w-fit !h-7 !text-12-regular px-1'
                    onClick={async () => {
                        if (isLoading) return
                        setIsLoading(true)
                        const response = await createEmpathy({
                            uid: account?.uid ?? '',
                            sid,
                            chats: chat,
                            emotion: emotionList.join(', '),
                            finished: false,
                            isRemind: isEmpty(emotionList) && totalSteps < 3 // 이걸 만족하면 rewind
                        })
                        if (response) {
                            back()
                        }
                        setIsLoading(false)
                    }}
                    disabled={isLoading}
                >
                    종료하기
                </Button.Communication>
            </div>
        </div>
    )
}