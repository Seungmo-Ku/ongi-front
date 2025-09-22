'use client'

import Button from '@/components/button'


interface FooterComponentProps {
    buttonText?: string
    onClick?: () => void
}

export const FooterComponent = ({
    buttonText = '회고하러 가자!',
    onClick
}: FooterComponentProps) => {
    return (
        <div className='absolute bottom-10 w-full px-5'>
            <Button.Communication onClick={onClick}>
                {buttonText}
            </Button.Communication>
        </div>
        )
}