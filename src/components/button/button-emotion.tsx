import { ReactNode } from 'react'
import { Button } from '@headlessui/react'
import clsx from 'clsx'


interface ButtonEmotionProps {
    children?: ReactNode
    selected?: boolean
    onClick?: () => void
}

export const ButtonEmotion = ({
    children,
    selected = false,
    onClick,
    ...props
}: ButtonEmotionProps) => {
    return (
        <Button
            {...props}
            className={clsx('w-full h-10 rounded-[30px] shrink-0 transition duration-300 active:scale-95', selected ? 'text-13-bold bg-[#6C9DD1] text-white' : 'bg-white/60 text-13-regular text-black')}
            onClick={onClick}
        >
            {children}
        </Button>
    )
}