import { Check } from 'lucide-react'


interface HeaderCommunicationProgressbarProps {
    currentStep: number
    totalSteps: number
}

export const HeaderCommunicationProgressbar = ({
    currentStep,
    totalSteps
}: HeaderCommunicationProgressbarProps) => {
    
    const checkComponent = (filled: boolean, key: number) => {
        return (
            <div className='size-[18px] shrink-0 rounded-full bg-white flex items-center justify-center' key={key}>
                <Check className='size-[14px]' style={{
                    color: filled ? '#35618E' : '#D6E4F7'
                }}/>
            </div>
        )
    }
    
    const steps = Array.from({ length: totalSteps }, (_, i) =>
        checkComponent(i < currentStep, i)
    );
    
    return (
        <div className='flex justify-between w-full h-1.5 bg-white/50 items-center'>
            {steps}
        </div>
    )
}