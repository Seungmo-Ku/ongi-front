import { createContext, ReactNode, useContext, useState } from 'react'


type RewindStepContextType = {
    week: Date
    setWeek: (week: Date) => void
    step: number
    setStep: (step: number) => void
}

const RewindStepContext = createContext<RewindStepContextType>({
    week: new Date(),
    setWeek: () => {
    },
    step: 0,
    setStep: () => {
    }
})

export const RewindStepProvider = ({ children }: { children: ReactNode }) => {
    const [week, setWeek] = useState(new Date())
    const [step, setStep] = useState(0)
    
    return (
        <RewindStepContext.Provider value={{ week, setWeek, step, setStep }}>
            {children}
        </RewindStepContext.Provider>
    )
}

export const useRewindStep = () => useContext(RewindStepContext)