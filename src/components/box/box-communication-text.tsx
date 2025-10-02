import React from 'react'
import clsx from 'clsx'
import { isEmpty } from 'lodash'


interface BoxCommunicationTextProps {
    text: string
    className?: string
    isUser?: boolean
    children?: React.ReactNode
}

export const BoxCommunicationText = ({
    text,
    className = '',
    isUser = false,
    children = null,
    ...props
}: BoxCommunicationTextProps) => {
    
    const textColorClass = isUser ? 'bg-ongi-my-communication text-white' : 'bg-white text-black'
    
    return (
        <div
            {...props}
            className={clsx('rounded-[20px] max-w-3/4 text-14-regular break-words px-4 py-[9px] transition duration-300 active:scale-95', textColorClass, className)}
        >
            {!isEmpty(text) ? text : children}
        </div>
    )
}