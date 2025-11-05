import React from 'react'
import { Button } from '@headlessui/react'
import clsx from 'clsx'


interface ButtonSendProps {
    children: React.ReactNode
    onClick?: () => void
    showSendButton?: boolean // 이대로 보낼게 표시 여부
    onClickSendButton?: () => void
    disabled?: boolean
}

export const ButtonSend = ({
    children,
    onClick,
    showSendButton = false,
    onClickSendButton,
    disabled = false,
    ...props
}: ButtonSendProps) => {
    
    return (
        <Button
            {...props}
            className={
                clsx(
                    'h-10 shrink-0 flex items-center justify-center'
                    , showSendButton ? '!rounded-2xl px-2' : '!rounded-full w-10 !px-0'
                    , disabled ? 'bg-gray-400' : 'transition-all duration-300 active:scale-95 cursor-pointer bg-ongi-my-communication')
            }
            onClick={() => {
                if (disabled) return
                if (showSendButton) {
                    if (onClickSendButton) onClickSendButton()
                    return
                }
                if (onClick) onClick()
            }}
        >
            {children}
        </Button>
    )
}