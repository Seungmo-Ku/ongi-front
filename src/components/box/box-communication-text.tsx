import React from 'react'
import clsx from 'clsx'


interface BoxCommunicationTextProps {
    text: string
    className?: string
    isUser?: boolean
}

export const BoxCommunicationText = ({
    text,
    className = '',
    isUser = false,
    ...props
}: BoxCommunicationTextProps) => {
    
    const textColorClass = isUser ? 'bg-ongi-my-communication text-white' : 'bg-white text-black'
    
    return (
        <div
            {...props}
            className={clsx('rounded-[20px] max-w-3/4 text-14-regular break-words px-4 py-[9px] transition duration-300 active:scale-95', textColorClass, className)}
        >
            {text}
        </div>
    )
}