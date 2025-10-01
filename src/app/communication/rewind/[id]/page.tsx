'use client'

import { useCommunicationStep } from '@/components/layout/communication-step-provider'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CommunicationView from '@/components/view/communication'
import useAccount from '@/hooks/use-account'
import { isEmpty } from 'lodash'
import { Chat } from '@/components/view/communication/chat-log'
import { useGetCommunicationResponse } from '@/hooks/use-get-communication-response'
import { useGetEmpathy } from '@/hooks/use-get-empathy'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { SelfEmpathy } from '@/libs/interfaces/self-empathy.interface'
import { HeaderCommunicationGoal } from '@/components/header/communucation/header-communication-goal'
import { handleUnload } from '@/libs/utils/handle-reload'


const CommunicationRewindPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params)
    const { setCurrentGoal, chat, setChat, sid, setSid, isLoading, setIsLoading, currentGoal } = useCommunicationStep()
    const { account, user } = useAccount()
    const { getCommunicationRewind } = useGetCommunicationResponse()
    const { createEmpathy, getEmpathy } = useGetEmpathy()
    const { push } = useDirectionalRouter()
    
    const chatBottomRef = useRef<HTMLDivElement>(null)
    
    const [text, setText] = useState('')
    const [userChatCount, setUserChatCount] = useState(0)
    const [empathy, setEmpathy] = useState<SelfEmpathy | null>(null)
    
    const decodedId = useMemo(() => decodeURIComponent(id), [id])
    
    useEffect(() => {
        if (!isEmpty(chat)) {
            window.addEventListener('beforeunload', handleUnload)
        }
        return () => {
            window.removeEventListener('beforeunload', handleUnload)
        }
    }, [chat])
    
    useEffect(() => {
        if (id && !empathy) {
            getEmpathy(decodedId).then(setEmpathy)
        }
    }, [decodedId, empathy, getEmpathy, id])
    
    useEffect(() => {
        if (empathy) {
            setChat([
                { chat: empathy.reviewSummary ?? '', isUser: false }
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
        
        if (userChatCount === 0) return
        
        const lastUserChats = chat.filter(c => c.isUser).slice(-userChatCount).map(c => c.chat)
        setIsLoading(true)
        const response =
            await getCommunicationRewind({
                uid: account?.uid ?? '',
                sid,
                message: lastUserChats.join('\n'),
                summaryText: empathy?.reviewSummary ?? ''
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
        
    }, [account?.uid, chat, createEmpathy, empathy?.reviewSummary, getCommunicationRewind, isLoading, push, setChat, setIsLoading, sid, userChatCount])
    
    return (
        <div
            className='relative h-full w-full text-24-bold flex flex-col overflow-hidden'
        >
            <div className='absolute w-full top-0 z-10'>
                <HeaderCommunicationGoal text={currentGoal}/>
            </div>
            <div className='w-full h-full flex flex-col overflow-hidden mb-[100px] pt-10'>
                <div className='w-full overflow-y-scroll'>
                    <CommunicationView.ChatLog chats={chat}/>
                    <div ref={chatBottomRef}/>
                </div>
            </div>
            <CommunicationView.FooterComponent
                isChatting
                text={text}
                setText={setText}
                onArrowClick={onArrowClick}
                showSendButton={userChatCount > 0 && !isLoading && isEmpty(text)}
                onSendButtonClick={doReply}
            />
        </div>
    )
}

export default CommunicationRewindPage