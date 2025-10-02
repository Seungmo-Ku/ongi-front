import Box from '@/components/box'


export interface Chat {
    chat: string
    isUser: boolean
}

interface ChatLogProps {
    chats: Chat[]
    showTyping?: boolean
}

export const ChatLog = ({
    chats,
    showTyping = false
}: ChatLogProps) => {
    // 다음 chat 이 user 인지 아닌 지 모르니까 다음 chat 에서 marginTop 을 줘서 간격
    return (
        <div className='flex flex-col w-full px-[25px]'>
            {
                chats.map((chat: Chat, index) => {
                    
                    const alignProps: string = chat.isUser ? 'self-end' : 'self-start'
                    const marginProps: string = index === 0 ? '' : (chats[index - 1].isUser === chat.isUser ? 'mt-2.5' : 'mt-[15px]')
                    const className: string = `${alignProps} ${marginProps}`
                    
                    return (
                        <Box.CommunicationText
                            key={`chat-${index}`}
                            text={chat.chat}
                            isUser={chat.isUser}
                            className={className}
                        />
                    )
                })
            }
            {
                showTyping && (
                    <Box.Typing />
                )
            }
        </div>
    )
}