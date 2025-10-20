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
        push('/photo')
    }, [push])
    
    return (
        <div
            className='w-full h-full flex flex-col items-center justify-start text-white pt-20 px-6 gap-y-8'
        >
            {/*<Character.Image mode='welcome' width={100} height={130}/>
             <div className='flex flex-col gap-y-4 w-full'>
             <span className='text-[#3674B5] text-20-bold text-start'>
             오늘 어떤 기록을 하고 싶어?
             </span>
             <div className='w-full grid-cols-2 grid gap-x-4 text-black'>
             {recordingButton('오늘을 기록하기', hasTodayEmpathy,
             () => {
             if (!account) {
             push('/login')
             return
             }
             setChat([])
             setEmotionList([])
             push('/communication')
             }
             )}
             {recordingButton('지난 일주일 회고하기', disableRewindButton,
             () => {
             if (!account) {
             push('/login')
             return
             }
             setChat([])
             setEmotionList([])
             setStep(0)
             setTotalSteps(1)
             setWeek(new Date())
             push('/rewind')
             }
             )}
             </div>
             </div>
             <Dialog.NicknameSet open={dialogOpen} onClose={() => setDialogOpen(false)}/>*/}
        </div>
    )
}
