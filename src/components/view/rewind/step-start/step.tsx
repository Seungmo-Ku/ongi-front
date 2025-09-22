import Box from '@/components/box'
import Character from '@/components/character'

interface RewindStepStartStepProps {
    text: string
}

export const RewindStepStartStep = ({
    text = ''
}: RewindStepStartStepProps) => {
    return (
        <div className='relative w-full text-24-bold flex flex-col gap-y-6 justify-center'>
            <div className='w-full px-[25px]'>
                <Box.SpeechBubble text={text}/>
            </div>
            <Character.Image mode='welcome'/>
        </div>
    )
}