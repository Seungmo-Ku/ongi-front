'use client'

import Button from '@/components/button'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useEffect } from 'react'
import { getAuth } from '@firebase/auth'
import { noop } from 'lodash'
import { useAccount } from '@/components/layout/account-context-provider'
import { useAccountDocument } from '@/hooks/use-account-document'


export default function PhotoPage() {
    const { account, user, setUser } = useAccount()
    const { updateUserAccount } = useAccountDocument()
    const { push } = useDirectionalRouter()
    
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
    
    
    
    return (
        <div className='h-full w-full flex flex-col overflow-hidden items-center justify-center gap-y-5 px-3'>
            <p className='text-black'>PHOTO PAGE</p>
            <Button.Communication
                onClick={() => {
                    if (!account) {
                        push('/login')
                        return
                    }
                    push('/photo/upload')
                }}
            >
                Upload Page
            </Button.Communication>
            <Button.Communication
                onClick={() => {
                    if (!account) {
                        push('/login')
                        return
                    }
                    push('/photo/calendar')
                }}
            >
                Calendar Page
            </Button.Communication>
        </div>
    )
}