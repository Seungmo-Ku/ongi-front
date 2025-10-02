'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import { Account } from '@/libs/interfaces/account.interface'
import { User } from '@firebase/auth'

type AccountContextType = {
    account: Account | null
    setAccount: (account: Account | null) => void
    user: User | null
    setUser: (user: User | null) => void
}

const AccountContext = createContext<AccountContextType>({
    account: null,
    setAccount: () => {
    },
    user: null,
    setUser: () => {
    }
})

export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<Account | null>(null)
    const [user, setUser] = useState<User | null>(null)
    
    return (
        <AccountContext.Provider value={{ account, setAccount, user, setUser }}>
            {children}
        </AccountContext.Provider>
    )
}

export const useAccount = () => useContext(AccountContext)