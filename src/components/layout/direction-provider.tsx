'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'


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
    useEffect(() => {
        console.log('direction changed:', direction)
    }, [direction])
    return (
        <DirectionContext.Provider value={{ direction, setDirection }}>
            {children}
        </DirectionContext.Provider>
    )
}

const useDirection = () => {
    return useContext(DirectionContext)
}

export { DirectionProvider, useDirection }