'use client'

import Box from '@/components/box'
import { useState } from 'react'


const CommunicationSelectEmotionPage = () => {
    const [emotionList, setEmotionList] = useState<string[]>([])
    return (
        <div
            className='w-full h-full flex flex-col items-center justify-center text-white gap-y-10 px-[25px]'
            style={{
                backgroundImage: `url(/images/communication_background.png)`, backgroundSize: 'cover', backgroundPosition: 'center'
            }}
        >
            <Box.SpeechBubble text='그럼 이번 친구들과의 모임으로 느낀 감정을 모두 골라볼래?'/>
            <Box.EmotionsList emotionList={emotionList} setEmotionList={setEmotionList} />
        </div>
    )
}

export default CommunicationSelectEmotionPage