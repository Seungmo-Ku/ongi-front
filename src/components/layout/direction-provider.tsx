'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import { CurrentDateProvider } from '@/components/layout/current-date-provider'
import { AccountProvider } from '@/components/layout/account-context-provider'


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
            <AccountProvider>
                <CurrentDateProvider>
                    {children}
                </CurrentDateProvider>
            </AccountProvider>
        </DirectionContext.Provider>
    )
}

const useDirection = () => {
    return useContext(DirectionContext)
}

export { DirectionProvider, useDirection }