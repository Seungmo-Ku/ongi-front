import React from 'react'
import { Button } from '@headlessui/react'


interface ButtonRoundProps {
    children: React.ReactNode
    onClick?: () => void
}

export const ButtonRound = ({
    children,
    onClick,
    ...props
}: ButtonRoundProps) => {
    return (
        <Button {...props} className='rounded-full w-10 h-10 shrink-0 flex items-center justify-center transition duration-300 active:scale-95 cursor-pointer bg-ongi-my-communication' onClick={onClick}>
            {children}
        </Button>
    )
}