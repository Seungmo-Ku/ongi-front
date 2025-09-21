'use client'

import { doc, getDoc, getFirestore, setDoc } from '@firebase/firestore'
import { User } from '@firebase/auth'
import { Account } from '@/libs/interfaces/account.interface'
import { useState } from 'react'
import app from '../../firebaseConfig'


export const useAccountDocument = () => {
    const firestore = getFirestore(app)
    const [account, setAccount] = useState<Account | null>(null)
    
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
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                exp: 0,
                level: 0
            })
            setAccount(new Account({
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
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
            displayName: accountData.displayName,
            photoURL: accountData.photoURL,
            createdAt: new Date(accountData.createdAt.toDate()),
            updatedAt: new Date(accountData.updatedAt.toDate()),
            exp: accountData.exp || 0,
            level: accountData.level || 0
        }))
    }
    
    return { updateUserAccount, account }
}