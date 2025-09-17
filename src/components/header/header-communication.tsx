import { HeaderCommunicationGoal } from '@/components/header/communucation/header-communication-goal'
import { HeaderCommunicationProgressbar } from '@/components/header/communucation/header-communication-progressbar'
import { useCommunicationStep } from '@/components/layout/communication-step-provider'
import Button from '@/components/button'


export const HeaderCommunication = () => {
    
    const { currentStep, currentGoal, totalSteps } = useCommunicationStep()
    
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
                    onClick={() => {
                        // TODO: 종료하기 클릭 시 동작
                    }}
                >
                    종료하기
                </Button.Communication>
            </div>
            <HeaderCommunicationGoal text={currentGoal}/>
        </div>
    )
}