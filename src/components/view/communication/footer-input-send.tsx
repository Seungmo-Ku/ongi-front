'use client'

import { Textarea } from '@headlessui/react'
import Button from '@/components/button'
import { ArrowUp } from 'lucide-react'
import React, { useCallback, useEffect, useRef } from 'react'


interface FooterInputSendProps {
    isSelectingEmotion?: boolean // 감정 선택 중인지 여부
    initialText?: string
    onArrowClick?: () => void
    onSendButtonClick?: () => void
    showSendButton?: boolean // 이대로 보낼게 표시 여부
    text: string
    setText: (text: string) => void
    disabled?: boolean
}

export const FooterInputSend = ({
    isSelectingEmotion = false,
    initialText = '',
    onArrowClick,
    onSendButtonClick,
    showSendButton = false,
    text,
    setText,
    disabled = false
}: FooterInputSendProps) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    
    useEffect(() => {
        if (isSelectingEmotion) setText(initialText)
    }, [initialText, isSelectingEmotion, setText])
    
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [setText])
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [text])
    
    return (
        <div className='w-full flex items-end justify-center gap-x-[5px]'>
            {
                isSelectingEmotion ?
                <div
                    className='grow min-h-10 max-h-[60px] bg-white rounded-[20px] text-16-regular px-5 py-2 text-black resize-none transition duration-300 active:scale-95 overflow-y-scroll break-keep'
                >
                    {text}
                </div> :
                <Textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleChange}
                    className='grow bg-white rounded-[20px] text-16-regular px-5 py-2 text-black resize-none outline-none focus:outline-none transition-all duration-300 active:scale-95'
                    rows={1}
                    style={{ minHeight: '2.5rem' }}
                    placeholder='디디에게 대답하기'
                />
            }
            <Button.Send onClick={onArrowClick} onClickSendButton={onSendButtonClick} showSendButton={showSendButton} disabled={disabled}>
                <p className='text-white text-13-regular px-1 flex items-center justify-center'>
                    {showSendButton ? '이대로 보낼게!' : <ArrowUp className='text-white'/>}
                </p>
            </Button.Send>
        </div>
    )
}