'use client'

import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { Account } from '@/libs/interfaces/account.interface'
import { User } from '@firebase/auth'

type AccountContextType = {
    account: Account | null
    setAccount: (account: Account | null) => void
    user: User | null
    setUser: (user: User | null) => void
    nickname: string
}

const AccountContext = createContext<AccountContextType>({
    account: null,
    setAccount: () => {
    },
    user: null,
    setUser: () => {
    },
    nickname: ''
})

export const AccountProvider = ({ children }: { children: ReactNode }) => {
    const [account, setAccount] = useState<Account | null>(null)
    const [user, setUser] = useState<User | null>(null)
    
    const nickname = useMemo(() => {
        return account ? (account.nickname ?? '') : ''
    }, [account])
    
    return (
        <AccountContext.Provider value={{ account, setAccount, user, setUser, nickname }}>
            {children}
        </AccountContext.Provider>
    )
}

export const useAccount = () => useContext(AccountContext)