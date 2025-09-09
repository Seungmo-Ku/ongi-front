import { Button } from '@headlessui/react'
import React from 'react'


interface ButtonCommunicationProps {
    children: React.ReactNode
    onClick?: () => void
}

export const ButtonCommunication = ({
    children,
    onClick,
    ...props
}: ButtonCommunicationProps) => {
    return (
        <Button
            {...props}
            className='h-10 bg-ongi-my-communication w-full text-16-regular text-white rounded-[20px] flex items-center justify-center transition duration-300 active:scale-95 cursor-pointer'
            onClick={onClick}
        >
            {children}
        </Button>
    )
}