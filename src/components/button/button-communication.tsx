import { Button } from '@headlessui/react'
import React from 'react'
import clsx from 'clsx'


interface ButtonCommunicationProps {
    children: React.ReactNode
    onClick?: () => void
    className?: string
    disabled?: boolean
}

export const ButtonCommunication = ({
    children,
    onClick,
    className = '',
    disabled = false,
    ...props
}: ButtonCommunicationProps) => {
    return (
        <Button
            {...props}
            className={clsx('h-10 w-full text-16-regular text-white rounded-[20px] flex items-center justify-center', disabled ? 'bg-[#8C8C8C]' : 'bg-ongi-my-communication transition duration-300 active:scale-95 cursor-pointer', className)}
            onClick={() => {
                if (disabled) return
                if (onClick) onClick()
            }}
            disabled={disabled}
        >
            {children}
        </Button>
    )
}