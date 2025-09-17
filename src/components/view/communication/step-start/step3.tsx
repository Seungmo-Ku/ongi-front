import Box from '@/components/box'
import Character from '@/components/character'


export const CommunicationStepStartStep3 = () => {
    return (
        <div className='relative w-full text-24-bold flex flex-col gap-y-6 justify-center'>
            <div className='w-full px-[25px]'>
                <Box.SpeechBubble text='행복하고 만족스러운데, 불안한 마음도 들었구나.'/>
                {/*TODO. ai 에게 받은 답변 사용*/}
            </div>
            <Character.Image mode='empathy'/>
        </div>
    )
}