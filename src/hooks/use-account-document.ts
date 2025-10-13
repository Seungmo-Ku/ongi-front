'use client'

import { doc, getDoc, getFirestore, setDoc } from '@firebase/firestore'
import { User } from '@firebase/auth'
import { Account } from '@/libs/interfaces/account.interface'
import app from '../../firebaseConfig'
import { useAccount } from '@/components/layout/account-context-provider'


export const useAccountDocument = () => {
    const firestore = getFirestore(app)
    const { account, setAccount, user: currentUser } = useAccount()
    
    const updateUserAccount = async (user: User | null): Promise<void> => {
        if (!user) {
            setAccount(null)
            return
        }
        const accountDocRef = doc(firestore, 'Accounts', user.uid)
        const docSnap = await getDoc(accountDocRef)
        
        if (!docSnap.exists()) {
            await setDoc(accountDocRef, {
                uid: user.uid,
                email: user.email || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                exp: 0,
                level: 0
            })
            setAccount(new Account({
                uid: user.uid,
                email: user.email || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                exp: 0,
                level: 0
            }))
            return
        }
        
        const accountData = docSnap.data()
        setAccount(new Account({
            uid: accountData.uid,
            email: accountData.email,
            createdAt: new Date(accountData.createdAt.toDate()),
            updatedAt: new Date(accountData.updatedAt.toDate()),
            exp: accountData.exp || 0,
            level: accountData.level || 0,
            nickname: accountData.nickname || ''
        }))
    }
    
    const updateAccountNickname = async (uid: string, nickname: string): Promise<boolean> => {
        const accountDocRef = doc(firestore, 'Accounts', uid)
        const docSnap = await getDoc(accountDocRef)
        try {
            if (!docSnap.exists()) {
                return false
            }
            await setDoc(accountDocRef, {
                ...account,
                nickname,
                updatedAt: new Date()
            })
            const accountData = docSnap.data()
            setAccount(new Account({
                uid: accountData.uid,
                email: accountData.email,
                createdAt: new Date(accountData.createdAt.toDate()),
                updatedAt: new Date(accountData.updatedAt.toDate()),
                exp: accountData.exp || 0,
                level: accountData.level || 0,
                nickname: nickname
            }))
            return true
        } catch {
            return false
        }
    }
    
    const isLoggedIn = !!currentUser && !!account
    
    return { updateUserAccount, updateAccountNickname, isLoggedIn }
}