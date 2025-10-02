import { Check } from 'lucide-react'

interface HeaderCommunicationGoalProps {
    text: string
}
export const HeaderCommunicationGoal = ({
    text
}: HeaderCommunicationGoalProps) => {
    return (
        <div className='w-full'>
            <div className='w-full bg-[#F5F5F5] px-[10px] h-[30px] flex items-center justify-start gap-x-2.5 transition duration-300 active:scale-95 '>
                <div className='size-[18px] flex items-center justify-center shrink-0 rounded-full bg-white'>
                    <Check className='text-ongi-my-communication w-[14px] h-[14px] shrink-0'/>
                </div>
                <p className='text-14-regular text-black'>
                    {text}
                </p>
            </div>
        </div>
    )
}