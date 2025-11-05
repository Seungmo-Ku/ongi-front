'use client'

import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useEffect } from 'react'
import { noop } from 'lodash'
import { useAccount } from '@/components/layout/account-context-provider'
import { useAccountDocument } from '@/hooks/use-account-document'
import { getAuth } from '@firebase/auth'


export default function Home() {
    const { push } = useDirectionalRouter()
    
    const { user, setUser } = useAccount()
    const { updateUserAccount } = useAccountDocument()
    
    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (user?.uid === firebaseUser?.uid) return
            setUser(firebaseUser)
            if (firebaseUser) updateUserAccount(firebaseUser).then(noop)
        })
        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setUser, updateUserAccount])
    
    useEffect(() => {
        push('/record')
    }, [push])
    
    return (
        <div
            className='w-full h-full flex flex-col items-center justify-start text-white pt-20 px-6 gap-y-8'
        >
  
        </div>
    )
}
