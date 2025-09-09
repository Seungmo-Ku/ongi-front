interface BoxSpeechBubbleProps {
    text: string
}

export const BoxSpeechBubble = ({
    text
}: BoxSpeechBubbleProps) => {
    return (
        <div className='relative w-full px-4 py-5 rounded-[30px] bg-white text-black text-16-regular text-center break-keep'>
            {text}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-4 h-4 bg-white rotate-45" />
        </div>
    )
}