'use client'

import CommunicationView from '@/components/view/communication'
import Box from '@/components/box'


const CommunicationDiDiTalkPage = () => {
    return (
        <div className='relative h-full bg-blue-200 text-24-bold flex flex-col'>
            <div className='h-10'/>
            <div className='w-full px-[25px]'>
                <Box.SpeechBubble text='지빈아, 오늘 하루 중에서 가장 기억에 남는 순간은 뭐였어?'/>
            </div>
            <CommunicationView.FooterComponent isChatting={false} />
        </div>
    )
}

export default CommunicationDiDiTalkPage