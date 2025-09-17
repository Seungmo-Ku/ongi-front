import React, { useRef } from 'react'
import { Button } from '@headlessui/react'
import { useLongPress } from 'react-use'


interface ButtonRoundProps {
    children: React.ReactNode
    onClick?: () => void
    onLongClick?: () => void
}

export const ButtonRound = ({
    children,
    onClick,
    onLongClick = () => {
    },
    ...props
}: ButtonRoundProps) => {
    
    const longPressTriggered = useRef(false)
    
    const onClickHandler = () => {
        if (longPressTriggered.current) {
            longPressTriggered.current = false
            return
        }
        if (onClick) onClick()
    }
    
    const onLongClickHandler = () => {
        longPressTriggered.current = true
        onLongClick()
    }
    
    const longPressEvent = useLongPress(onLongClickHandler, { isPreventDefault: false, delay: 500 })
    
    return (
        <Button
            {...props}
            className='no-select rounded-full w-10 h-10 shrink-0 flex items-center justify-center transition duration-300 active:scale-95 cursor-pointer bg-ongi-my-communication'
            onClick={onClickHandler}
            {...longPressEvent}
        >
            {children}
        </Button>
    )
}