'use client'

import { Chat } from '@/components/view/communication/chat-log'
import CommunicationView from '@/components/view/communication'


const CommunicationPage = () => {
    const mockChat: Chat[] = [
        { text: '지빈아, 오늘 하루 중에서 가장 기억에 남는 순간은 뭐였어?', isUser: false },
        { text: '오늘은 친구들과 맛있는 저녁을 먹고 카페를 갔어. 오랜만에 여유 있고 즐거운 시간이었던 것 같아' , isUser: true },
        { text: '오랜만에 여유 있고 좋더라', isUser: true },
        { text: '아맞다 전시회도 감', isUser: true },
        { text: '와! 정말 멋진 하루를 보냈구나. 친구들과 함께한 시간과 전시회 관람이 특히 기억에 남는 것 같아. 어떤 전시회였어?', isUser: false }
        // { text: '현대 미술 전시회였어. 다양한 작품들을 보면서 많은 영감을 받았어. 특히 한 설치 미술 작품이 인상 깊었어', isUser: true },
        // { text: '설치 미술 작품이라니, 정말 흥미롭다! 어떤 점이 가장 인상 깊었어?', isUser: false },
        // { text: '그 작품은 공간을 활용한 독특한 구성이었어. 관객들이 직접 작품 안으로 들어가서 체험할 수 있게 되어 있었거든. 그 안에서 느낀 감정과 생각들이 정말 특별했어', isUser: true },
        // { text: '직접 체험할 수 있는 설치 미술이라니, 정말 멋지다! 그런 경험은 쉽게 할 수 없는 거니까 더욱 특별했겠어. 그 외에도 기억에 남는 순간이 있었어?', isUser: false },
        // { text: '응, 친구들과 함께 웃고 떠들면서 즐거운 시간을 보낸 것도 기억에 남아. 오랜만에 만나서 그런지 이야기할 것도 많고, 서로의 근황도 나누고 했거든', isUser: true },
        // { text: '친구들과의 소중한 시간도 정말 중요하지. 그런 순간들이 우리 삶을 더욱 풍요롭게 만들어주는 것 같아. 오늘 하루를 통해 어떤 생각이나 느낌이 들었어?', isUser: false },
        // { text: '오늘 하루를 통해 삶의 소중함과 친구들의 중요성을 다시 한 번 느꼈어. 바쁜 일상 속에서도 이런 시간을 자주 가져야겠다는 생각이 들었어', isUser: true },
        // { text: '정말 멋진 생각이야, 지빈아. 앞으로도 친구들과 함께하는 시간을 자주 만들고, 다양한 경험을 통해 삶을 더욱 풍요롭게 만들어가길 바랄게!', isUser: false }
    ]
    
    return (
        <div className='relative h-full bg-blue-200 text-24-bold flex flex-col'>
            <div className='h-10'/>
            <div className='w-full overflow-y-scroll'>
                <CommunicationView.ChatLog chats={mockChat} />
            </div>
            <CommunicationView.FooterComponent isChatting />
        </div>
    )
}

export default CommunicationPage