'use client'

import { useEffect, useMemo, useState } from 'react'
import { getAuth, User } from '@firebase/auth'
import { useAccountDocument } from '@/hooks/use-account-document'
import { noop } from 'lodash'


const useAccount = () => {
    const [user, setUser] = useState<User | null>(null)
    const { updateUserAccount, account } = useAccountDocument()
    
    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (user === firebaseUser) return
            setUser(firebaseUser)
            updateUserAccount(firebaseUser).then(noop)
        })
        return () => unsubscribe()
    }, [account, updateUserAccount, user])
    
    const isLoggedIn = useMemo(() => {
        return !!user && !!account
    }, [account, user])
    
    return { user, account, isLoggedIn }
}

export default useAccount