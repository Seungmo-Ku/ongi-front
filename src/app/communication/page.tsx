'use client'

import { Chat } from '@/components/view/communication/chat-log'
import CommunicationView from '@/components/view/communication'
import { useCommunicationStep } from '@/components/layout/communication-step-provider'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Communication from '@/components/view/communication'
import { isEmpty } from 'lodash'
import Box from '@/components/box'
import { Button } from '@headlessui/react'


const CommunicationStep = [
    '오늘의 순간 하나를 자세하게 털어놓기',
    '솔직하게 내 감정을 마주하기',
    '감정의 진짜 원인 찾아보기'
]

const CommunicationPage = () => {
    const { setTotalSteps, setCurrentStep, setCurrentGoal, currentStep } = useCommunicationStep()
    
    const [chat, setChat] = useState<Chat[]>([])
    const [showChat, setShowChat] = useState(false)
    const [userChatCount, setUserChatCount] = useState(0)
    const [text, setText] = useState('')
    const [emotionList, setEmotionList] = useState<string[]>([])
    const sendButtonRef = useRef<HTMLButtonElement>(null)
    const [showSendButton, setShowSendButton] = useState(false)
    
    useEffect(() => {
        setTotalSteps(3)
        setCurrentStep(1)
        setCurrentGoal(CommunicationStep[0])
    }, [setCurrentGoal, setCurrentStep, setTotalSteps])
    
    const goToNextStep = useCallback(() => {
        switch (currentStep) {
            case 1:
                setCurrentStep(2)
                setCurrentGoal(CommunicationStep[1])
                break
            case 2:
                setCurrentStep(3)
                setCurrentGoal(CommunicationStep[2])
                break
            case 3:
            // 끝
        }
        setShowChat(false)
    }, [currentStep, setCurrentGoal, setCurrentStep])
    
    const goToCurrentStep = useCallback(() => {
        switch (currentStep) {
            case 1:
                setChat((prev) => ([
                    ...prev,
                    { text: '지빈아, 오늘 하루 중에서 가장 기억에 남는 순간은 뭐였어?', isUser: false }
                ]))
                break
            case 3:
                setChat((prev) => ([
                    ...prev,
                    { text: emotionList.join(', '), isUser: true },
                    { text: '~~~~~~ 감정이 들었구나.', isUser: false }
                ]))
                break
        }
        setShowChat(true)
    }, [currentStep, emotionList])
    
    const showStepStart = useMemo(() => {
        switch (currentStep) {
            case 1:
                return <Communication.StepStart.Step1/>
            case 2:
                return <Communication.StepStart.Step2/>
            case 3:
                return <Communication.StepStart.Step3/>
            default:
                return <div></div>
        }
    }, [currentStep])
    
    const onArrowClick = useCallback(() => {
        if (showChat) {
            if (currentStep === 1 || currentStep === 3) {
                if (isEmpty(text)) return
                setChat((prev) => ([
                    ...prev,
                    { text, isUser: true }
                ]))
                setText('')
                setUserChatCount((prev) => prev + 1)
            } else if (currentStep === 2) {
                if (isEmpty(emotionList)) return
                goToNextStep()
                setText('')
                setUserChatCount(0)
            }
        }
    }, [currentStep, emotionList, goToNextStep, showChat, text])
    
    const doReply = useCallback(() => {
        setShowSendButton(false)
        if (userChatCount === 0) return
        switch (currentStep) {
            case 1:
            case 3:
                const lastUserChats = chat.filter(c => c.isUser).slice(-userChatCount).map(c => c.text)
                console.log('lastUserChats', lastUserChats)
                setChat((prev) => ([
                    ...prev,
                    { text: '와, 정말 자세하게 말해줘서 고마워! 그럼 이번 친구들과의 모임으로 느낀 감정을 모두 골라볼래?', isUser: false }
                ]))
                setUserChatCount(0)
                break
        }
    }, [chat, currentStep, userChatCount])
    
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
        if (currentStep === 2) return
        if (userChatCount === 0) return
        setShowSendButton(true)
    }, [currentStep, userChatCount])
    
    const onBackButtonClick = useCallback(() => {
        if (currentStep !== 3) return
        setCurrentStep(2)
        setCurrentGoal(CommunicationStep[1])
        setShowChat(true)
    }, [currentStep, setCurrentGoal, setCurrentStep])
    
    const footerButtonText = useMemo(() => {
        switch (currentStep) {
            case 1:
                return '디디에게 대답하기'
            case 2:
                return '다음으로'
            case 3:
                return '응, 맞아!'
            default:
                return '다 했어'
        }
    }, [currentStep])
    
    useEffect(() => {
        if (currentStep === 1 && chat.length >= 10) { // 임시로 step1 20번 넘기면 다음 스텝
            goToNextStep()
            setText('')
            setUserChatCount(0)
        }
    }, [chat.length, currentStep, goToNextStep, userChatCount])
    
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
            {
                showChat ? (
                    currentStep === 2 ? (
                        <div className='w-full h-full flex flex-col items-center justify-center text-white gap-y-10 px-[25px]'>
                            <Box.SpeechBubble text='그럼 이번 친구들과의 모임으로 느낀 감정을 모두 골라볼래?'/>
                            <Box.EmotionsList emotionList={emotionList} setEmotionList={setEmotionList}/>
                        </div>
                    ) : (
                        <div className='w-full h-full flex flex-col overflow-hidden'>
                            <div className='h-10'/>
                            <div className='w-full overflow-y-scroll'>
                                <CommunicationView.ChatLog chats={chat}/>
                            </div>
                        </div>
                    )
                ) : (
                    <div className='w-full h-full flex flex-col justify-center'>
                        {showStepStart}
                    </div>
                
                )
            }
            {showSendButton && sendButton}
            <CommunicationView.FooterComponent
                isChatting={showChat}
                onClick={goToCurrentStep} // 채팅 창 아닐 때
                text={text}
                setText={setText}
                onArrowClick={onArrowClick}
                onArrowLongClick={onArrowLongClick}
                buttonText={footerButtonText}
                isSelectingEmotion={currentStep === 2}
                initialText={emotionList.join(', ')}
                showBackButton={currentStep === 3}
                backButtonOnClick={onBackButtonClick}
                backButtonText='아닌 것 같아'
            />
        </div>
    )
}

export default CommunicationPage