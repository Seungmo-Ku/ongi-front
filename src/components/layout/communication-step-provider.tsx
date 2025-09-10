import { createContext, ReactNode, useContext, useState } from 'react'


type StepContextType = {
    currentStep: number
    currentGoal: string
    totalSteps: number
    setCurrentStep: (step: number) => void
    setTotalSteps: (steps: number) => void
    setCurrentGoal: (goal: string) => void
}

const StepContext = createContext<StepContextType>({
    currentStep: 1,
    totalSteps: 3,
    currentGoal: '오늘의 순간 하나를 자세히 털어놓기',
    setCurrentStep: () => {
    },
    setTotalSteps: () => {
    },
    setCurrentGoal: () => {
    }
})

export const StepProvider = ({ children }: { children: ReactNode }) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [totalSteps, setTotalSteps] = useState(3)
    const [currentGoal, setCurrentGoal] = useState('오늘의 순간 하나를 자세히 털어놓기')
    
    return (
        <StepContext.Provider value={{ currentStep, currentGoal, totalSteps, setCurrentStep, setTotalSteps, setCurrentGoal }}>
            {children}
        </StepContext.Provider>
    )
}

export const useCommunicationStep = () => useContext(StepContext)