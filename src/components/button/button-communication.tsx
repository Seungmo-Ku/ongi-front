import { Button } from '@headlessui/react'
import React from 'react'
import clsx from 'clsx'


interface ButtonCommunicationProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
}

export const ButtonCommunication = ({
    children,
    onClick,
    className = '',
    ...props
}: ButtonCommunicationProps) => {
    return (
        <Button
            {...props}
            className={clsx('h-10 bg-ongi-my-communication w-full text-16-regular text-white rounded-[20px] flex items-center justify-center transition duration-300 active:scale-95 cursor-pointer', className)}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}