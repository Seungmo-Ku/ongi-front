import { createContext, ReactNode, useContext, useState } from 'react'
import { Chat } from '@/components/view/communication/chat-log'


type StepContextType = {
    currentStep: number
    currentGoal: string
    totalSteps: number
    chat: Chat[]
    sid: string
    emotionList: string[]
    isLoading: boolean
    setCurrentStep: (step: number) => void
    setTotalSteps: (steps: number) => void
    setCurrentGoal: (goal: string) => void
    setChat: (chat: Chat[]) => void
    setSid: (sid: string) => void
    setEmotionList: (emotions: string[]) => void
    setIsLoading: (loading: boolean) => void
}

const StepContext = createContext<StepContextType>({
    currentStep: 1,
    totalSteps: 3,
    currentGoal: '오늘의 순간 하나를 자세히 털어놓기',
    chat: [],
    sid: '',
    emotionList: [],
    isLoading: false,
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
    },
    setIsLoading: () => {
    }
})

export const StepProvider = ({ children }: { children: ReactNode }) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [totalSteps, setTotalSteps] = useState(3)
    const [currentGoal, setCurrentGoal] = useState('오늘의 순간 하나를 자세히 털어놓기')
    const [chat, setChat] = useState<Chat[]>([])
    const [sid, setSid] = useState('')
    const [emotionList, setEmotionList] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    
    return (
        <StepContext.Provider value={{ currentStep, currentGoal, totalSteps, chat, sid, emotionList, isLoading, setCurrentStep, setTotalSteps, setCurrentGoal, setChat, setSid, setEmotionList, setIsLoading }}>
            {children}
        </StepContext.Provider>
    )
}

export const useCommunicationStep = () => useContext(StepContext)