'use client'

import { Input, Textarea } from '@headlessui/react'
import Button from '@/components/button'
import { ArrowUp } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'


export const FooterInputSend = () => {
    const [text, setText] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [])
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [])
    
    return (
        <div className='w-full flex items-end justify-center gap-x-[5px]'>
            <Textarea
                ref={textareaRef}
                value={text}
                onChange={handleChange}
                className='grow bg-white rounded-[20px] text-16-regular px-5 py-2 text-black resize-none outline-none focus:outline-none transition duration-300 active:scale-95'
                rows={1}
                style={{ minHeight: '2.5rem' }}
                placeholder='디디에게 대답하기'
            />
            <Button.Round>
                <ArrowUp className='text-white'/>
            </Button.Round>
        </div>
    )
}