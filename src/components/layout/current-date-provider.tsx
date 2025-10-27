import { createContext, ReactNode, useContext, useState } from 'react'


type CurrentDateContextType = {
    currentDate: Date
    setCurrentDate: (date: Date) => void
    showingDate: Date
    setShowingDate: (date: Date) => void
    calendarMode: 'grid' | 'calendar'
    setCalendarMode: (mode: 'grid' | 'calendar') => void
}

const CurrentDateContext = createContext<CurrentDateContextType>({
    currentDate: new Date(),
    setCurrentDate: () => {
    },
    showingDate: new Date(),
    setShowingDate: () => {
    },
    calendarMode: 'calendar',
    setCalendarMode: () => {
    }
})

export const CurrentDateProvider = ({ children }: { children: ReactNode }) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const [showingDate, setShowingDate] = useState<Date>(new Date())
    const [calendarMode, setCalendarMode] = useState<'grid' | 'calendar'>('grid')
    
    return (
        <CurrentDateContext.Provider value={{ currentDate, setCurrentDate, showingDate, setShowingDate, calendarMode, setCalendarMode }}>
            {children}
        </CurrentDateContext.Provider>
    )
}

export const useCurrentDate = () => useContext(CurrentDateContext)