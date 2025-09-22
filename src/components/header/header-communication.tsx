'use client'

import { HeaderCommunicationGoal } from '@/components/header/communucation/header-communication-goal'
import { HeaderCommunicationProgressbar } from '@/components/header/communucation/header-communication-progressbar'
import { useCommunicationStep } from '@/components/layout/communication-step-provider'
import Button from '@/components/button'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useGetEmpathy } from '@/hooks/use-get-empathy'
import useAccount from '@/hooks/use-account'


export const HeaderCommunication = () => {
    
    const { currentStep, currentGoal, totalSteps, chat, sid, emotionList } = useCommunicationStep()
    const { back } = useDirectionalRouter()
    const { createEmpathy } = useGetEmpathy()
    const { account } = useAccount()
    
    return (
        <div
            className='w-full flex flex-col items-center justify-center gap-y-2.5'
            style={{
                backgroundImage: `url(/images/communication_background.png)`, backgroundSize: 'cover', backgroundPosition: 'top'
            }}
        >
            <div className='w-full flex flex-row items-center justify-center pl-2.5 pr-5 gap-x-2'>
                {/*<Header.BackButton/>*/}
                <div className='grow text-center shrink-0 min-h-10 flex items-center justify-center'>
                    <HeaderCommunicationProgressbar totalSteps={totalSteps} currentStep={currentStep}/>
                </div>
                <Button.Communication
                    className='!w-fit !h-7 !text-12-regular px-1'
                    onClick={async () => {
                        const response = await createEmpathy({
                            uid: account?.uid ?? '',
                            sid,
                            chats: chat,
                            emotion: emotionList.join(', '),
                            finished: false,
                            isRemind: false
                        })
                        if (response) {
                            back()
                        }
                    }}
                >
                    종료하기
                </Button.Communication>
            </div>
            <HeaderCommunicationGoal text={currentGoal}/>
        </div>
    )
}