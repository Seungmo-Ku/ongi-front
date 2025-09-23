'use client'

import Button from '@/components/button'


interface FooterComponentProps {
    buttonText?: string
    onClick?: () => void
    disabled?: boolean
}

export const FooterComponent = ({
    buttonText = '회고하러 가자!',
    onClick,
    disabled = false
}: FooterComponentProps) => {
    return (
        <div className='absolute bottom-10 w-full px-5'>
            <Button.Communication onClick={onClick} disabled={disabled}>
                {buttonText}
            </Button.Communication>
        </div>
        )
}