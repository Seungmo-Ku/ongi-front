import Box from '@/components/box'
import Character from '@/components/character'

interface CommunicationStepStartStep2Props {
    text?: string
}
export const CommunicationStepStartStep2 = ({
    text = ''
}: CommunicationStepStartStep2Props) => {
    return (
        <div className='relative w-full text-24-bold flex flex-col gap-y-6 justify-center'>
            <div className='w-full px-[25px]'>
                <Box.SpeechBubble text={text ? text : '그런 이야기를 나눌 수 있는 친구들이 있다는 게 정말 소중하네'}/>
            </div>
            <Character.Image mode='empathy'/>
        </div>
    )
}