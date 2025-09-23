'use client'

import { useCommunicationStep } from '@/components/layout/communication-step-provider'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CommunicationView from '@/components/view/communication'
import useAccount from '@/hooks/use-account'
import { isEmpty } from 'lodash'
import { Button } from '@headlessui/react'
import { Chat } from '@/components/view/communication/chat-log'
import { useGetCommunicationResponse } from '@/hooks/use-get-communication-response'
import { useGetEmpathy } from '@/hooks/use-get-empathy'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { SelfEmpathy } from '@/libs/interfaces/self-empathy.interface'


const CommunicationRewindPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const { setCurrentGoal, chat, setChat, sid, setSid } = useCommunicationStep()
    const { account, user } = useAccount()
    const { getCommunicationRewind } = useGetCommunicationResponse()
    const { createEmpathy, getEmpathy } = useGetEmpathy()
    const { push } = useDirectionalRouter()
    
    const chatBottomRef = useRef<HTMLDivElement>(null)
    
    const [text, setText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [userChatCount, setUserChatCount] = useState(0)
    const [showSendButton, setShowSendButton] = useState(false)
    const sendButtonRef = useRef<HTMLButtonElement>(null)
    
    const [empathy, setEmpathy] = useState<SelfEmpathy | null>(null)
    
    const decodedId = useMemo(() => decodeURIComponent(id), [id])
    
    useEffect(() => {
        if (id && !empathy) {
            getEmpathy(decodedId).then(setEmpathy)
        }
    }, [decodedId, empathy, getEmpathy, id])
    
    useEffect(() => {
        if (empathy) {
            setChat([
                { chat: empathy.summary, isUser: false }
            ])
        }
    }, [empathy, setChat])
    
    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chat])
    
    useEffect(() => {
        setCurrentGoal('그날의 나에게, 지금 말을 건네보세요')
    }, [setCurrentGoal])
    
    useEffect(() => {
        if (!sid && account?.uid && user) {
            setSid(`${new Date().toLocaleDateString()}_${user.displayName ?? 'unknown'}_${decodedId}_Rewind`) // 그날의 것으로 해야할듯
        }
    }, [account?.uid, decodedId, id, setSid, sid, user])
    
    const onArrowClick = useCallback(async () => {
        if (isLoading) return
        if (isEmpty(text)) return
        setChat([
            ...chat,
            { chat: text, isUser: true }
        ])
        setText('')
        setUserChatCount((prev) => prev + 1)
        
    }, [chat, isLoading, setChat, text])
    
    const doReply = useCallback(async () => {
        if (isLoading) return
        setShowSendButton(false)
        
        if (userChatCount === 0) return
        
        const lastUserChats = chat.filter(c => c.isUser).slice(-userChatCount).map(c => c.chat)
        setIsLoading(true)
        const response =
            await getCommunicationRewind({
                uid: account?.uid ?? '',
                sid,
                message: lastUserChats.join('\n')
            })
        if (response) {
            const newChats: Chat[] = response.chats.map(chat => ({
                chat,
                isUser: false
            }))
            setChat([
                ...chat,
                ...newChats
            ])
            if (response.done) {
                const response = await createEmpathy({
                    uid: account?.uid ?? '',
                    sid,
                    chats: [
                        ...chat,
                        ...newChats
                    ],
                    emotion: '',
                    finished: true,
                    isRemind: true
                })
                if (response) {
                    push('/')
                }
                
            }
        }
        setIsLoading(false)
        setUserChatCount(0)
        
    }, [account?.uid, chat, createEmpathy, getCommunicationRewind, isLoading, push, setChat, sid, userChatCount])
    
    const sendButton = useMemo(() => {
        return (
            <div className='absolute !bottom-[90px] self-end px-5'>
                <Button
                    ref={sendButtonRef}
                    onClick={doReply}
                    className='no-select h-10 bg-white border border-[#578FCA] text-[#3674B5] text-13-regular px-4 rounded-[30px] rounded-br-none transition duration-200 active:scale-95 ease-in-out'
                >
                    이대로 보낼게!
                </Button>
            </div>
        
        )
    }, [doReply])
    
    const onArrowLongClick = useCallback(() => {
        if (userChatCount === 0) return
        setShowSendButton(true)
    }, [userChatCount])
    
    // noinspection DuplicatedCode
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sendButtonRef.current && !sendButtonRef.current.contains(event?.target as Node)) {
                setShowSendButton(false)
                event.preventDefault()
                event.stopPropagation()
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    
    return (
        <div
            className='relative h-full w-full text-24-bold flex flex-col overflow-hidden'
            style={{
                backgroundImage: `url(/images/communication_background.png)`, backgroundSize: 'cover', backgroundPosition: 'center'
            }}
        >
            <div className='w-full h-full flex flex-col overflow-hidden mb-[100px]'>
                <div className='h-10'/>
                <div className='w-full overflow-y-scroll'>
                    <CommunicationView.ChatLog chats={chat}/>
                    <div ref={chatBottomRef}/>
                </div>
            </div>
            {showSendButton && sendButton}
            <CommunicationView.FooterComponent
                isChatting
                text={text}
                setText={setText}
                onArrowClick={onArrowClick}
                onArrowLongClick={onArrowLongClick}
            />
        </div>
    )
}

export default CommunicationRewindPage