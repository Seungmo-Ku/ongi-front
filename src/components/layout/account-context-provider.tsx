'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Account } from '@/libs/interfaces/account.interface'
import { getAuth, onAuthStateChanged, User } from '@firebase/auth'
import app from '../../../firebaseConfig'
import { useSetAtom } from 'jotai'
import { InitialLoadingAtom } from '@/components/spinner/spinner-view'
import { doc, getDoc, getFirestore, setDoc } from '@firebase/firestore'


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
    
    const setLoadingShow = useSetAtom(InitialLoadingAtom)
    
    const updateUserAccount = useCallback(async (user: User | null): Promise<void> => {
        const firestore = getFirestore(app)
        
        if (!user) {
            setAccount(null)
            return
        }
        const accountDocRef = doc(firestore, 'Accounts', user.uid)
        const docSnap = await getDoc(accountDocRef)
        
        let fcmToken
        if (window.flutter_inappwebview) {
            fcmToken = await window.flutter_inappwebview.callHandler('requestFcmToken')
        }
        if (!docSnap.exists()) {
            await setDoc(accountDocRef, {
                uid: user.uid,
                email: user.email || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                exp: 0,
                level: 0,
                fcmToken: fcmToken?.toString() || ''
            })
            setAccount(new Account({
                uid: user.uid,
                email: user.email || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                exp: 0,
                level: 0,
                fcmToken: fcmToken?.toString() || ''
            }))
            return
        }
        
        const accountData = docSnap.data()
        
        if (fcmToken && fcmToken !== accountData.fcmToken) {
            await setDoc(accountDocRef, {
                uid: accountData.uid,
                email: accountData.email,
                createdAt: new Date(accountData.createdAt.toDate()),
                updatedAt: new Date(accountData.updatedAt.toDate()),
                exp: accountData.exp || 0,
                level: accountData.level || 0,
                nickname: accountData.nickname || '',
                fcmToken: fcmToken
            })
        }
        
        setAccount(new Account({
            uid: accountData.uid,
            email: accountData.email,
            createdAt: new Date(accountData.createdAt.toDate()),
            updatedAt: new Date(accountData.updatedAt.toDate()),
            exp: accountData.exp || 0,
            level: accountData.level || 0,
            nickname: accountData.nickname || '',
            fcmToken: fcmToken || accountData.fcmToken || ''
        }))
    }, [])
    
    useEffect(() => {
        const auth = getAuth(app)
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (user?.uid !== firebaseUser?.uid) {
                setUser(firebaseUser)
                if (firebaseUser) await updateUserAccount(firebaseUser)
            }
            setLoadingShow({
                show: false
            })
        })
        return () => unsubscribe()
    }, [account, setLoadingShow, updateUserAccount, user?.uid])
    
    return (
        <AccountContext.Provider value={{ account, setAccount, user, setUser, nickname }}>
            {children}
        </AccountContext.Provider>
    )
}

export const useAccount = () => useContext(AccountContext)