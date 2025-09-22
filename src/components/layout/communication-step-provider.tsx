import { createContext, ReactNode, useContext, useState } from 'react'
import { Chat } from '@/components/view/communication/chat-log'


type StepContextType = {
    currentStep: number
    currentGoal: string
    totalSteps: number
    chat: Chat[]
    sid: string
    emotionList: string[]
    setCurrentStep: (step: number) => void
    setTotalSteps: (steps: number) => void
    setCurrentGoal: (goal: string) => void
    setChat: (chat: Chat[]) => void
    setSid: (sid: string) => void
    setEmotionList: (emotions: string[]) => void
}

const StepContext = createContext<StepContextType>({
    currentStep: 1,
    totalSteps: 3,
    currentGoal: '오늘의 순간 하나를 자세히 털어놓기',
    chat: [],
    sid: '',
    emotionList: [],
    setCurrentStep: () => {
    },
    setTotalSteps: () => {
    },
    setCurrentGoal: () => {
    },
    setChat: () => {
    },
    setSid: () => {
    },
    setEmotionList: () => {
    }
})

export const StepProvider = ({ children }: { children: ReactNode }) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [totalSteps, setTotalSteps] = useState(3)
    const [currentGoal, setCurrentGoal] = useState('오늘의 순간 하나를 자세히 털어놓기')
    const [chat, setChat] = useState<Chat[]>([])
    const [sid, setSid] = useState('')
    const [emotionList, setEmotionList] = useState<string[]>([])
    
    return (
        <StepContext.Provider value={{ currentStep, currentGoal, totalSteps, chat, sid, emotionList, setCurrentStep, setTotalSteps, setCurrentGoal, setChat, setSid, setEmotionList }}>
            {children}
        </StepContext.Provider>
    )
}

export const useCommunicationStep = () => useContext(StepContext)