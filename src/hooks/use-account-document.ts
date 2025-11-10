'use client'

import { doc, getDoc, getFirestore, setDoc } from '@firebase/firestore'
import { Account } from '@/libs/interfaces/account.interface'
import app from '../../firebaseConfig'
import { useAccount } from '@/components/layout/account-context-provider'


export const useAccountDocument = () => {
    const firestore = getFirestore(app)
    const { account, setAccount, user: currentUser } = useAccount()
    
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
    
    return { updateAccountNickname, isLoggedIn }
}