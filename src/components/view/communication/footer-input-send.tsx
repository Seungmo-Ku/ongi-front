'use client'

import { Textarea } from '@headlessui/react'
import Button from '@/components/button'
import { ArrowUp } from 'lucide-react'
import React, { useCallback, useEffect, useRef } from 'react'


interface FooterInputSendProps {
    isSelectingEmotion?: boolean // 감정 선택 중인지 여부
    initialText?: string
    onArrowClick?: () => void
    onArrowLongClick?: () => void
    text: string
    setText: (text: string) => void
}

export const FooterInputSend = ({
    isSelectingEmotion = false,
    initialText = '',
    onArrowClick,
    onArrowLongClick,
    text,
    setText
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
    }, [])
    
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
                    className='grow bg-white rounded-[20px] text-16-regular px-5 py-2 text-black resize-none outline-none focus:outline-none transition duration-300 active:scale-95'
                    rows={1}
                    style={{ minHeight: '2.5rem' }}
                    placeholder='디디에게 대답하기'
                />
            }
            <Button.Round onClick={onArrowClick} onLongClick={onArrowLongClick}>
                <ArrowUp className='text-white'/>
            </Button.Round>
        </div>
    )
}