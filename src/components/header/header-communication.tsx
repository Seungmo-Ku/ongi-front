import { HeaderCommunicationGoal } from '@/components/header/communucation/header-communication-goal'
import { HeaderCommunicationProgressbar } from '@/components/header/communucation/header-communication-progressbar'
import { useCommunicationStep } from '@/components/layout/communication-step-provider'
import Header from '@/components/header/index'


export const HeaderCommunication = () => {
    
    const { currentStep, currentGoal, totalSteps } = useCommunicationStep()
    
    return (
        <div className='w-full flex flex-col items-center justify-center bg-blue-200 gap-y-2.5'>
            <div className='w-full flex flex-row items-center justify-center pl-2.5 pr-5'>
                <Header.BackButton/>
                <div className='grow text-center'>
                    <HeaderCommunicationProgressbar totalSteps={totalSteps} currentStep={currentStep}/>
                </div>
            </div>
            <HeaderCommunicationGoal text={currentGoal}/>
        </div>
    )
}