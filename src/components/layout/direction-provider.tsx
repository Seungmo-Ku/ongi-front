'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import { StepProvider } from '@/components/layout/communication-step-provider'


type Direction = 'forward' | 'backward'

interface DirectionContextType {
    direction: Direction
    setDirection: (dir: Direction) => void
}

const DirectionContext = createContext<DirectionContextType>({
    direction: 'forward',
    setDirection: () => {
    }
})

const DirectionProvider = ({ children }: { children: ReactNode }) => {
    const [direction, setDirection] = useState<Direction>('forward')
    
    return (
        <DirectionContext.Provider value={{ direction, setDirection }}>
            <StepProvider>
                {children}
            </StepProvider>
        </DirectionContext.Provider>
    )
}

const useDirection = () => {
    return useContext(DirectionContext)
}

export { DirectionProvider, useDirection }