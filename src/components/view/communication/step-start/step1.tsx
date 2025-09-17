import Box from '@/components/box'
import Character from '@/components/character'


export const CommunicationStepStartStep1 = () => {
    return (
        <div className='relative w-full text-24-bold flex flex-col gap-y-6 justify-center'>
            <div className='w-full px-[25px]'>
                <Box.SpeechBubble text='지빈아, 오늘 하루 중에서 가장 기억에 남는 순간은 뭐였어?'/>
            </div>
            <Character.Image mode='welcome'/>
        </div>
    )
}