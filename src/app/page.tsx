'use client'

import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useCallback, useEffect, useState } from 'react'
import Character from '@/components/character'
import clsx from 'clsx'
import { useRewindStep } from '@/components/layout/rewind-step-provider'
import { useCommunicationStep } from '@/components/layout/communication-step-provider'
import { isEmpty, noop } from 'lodash'
import { Dialog } from '@/components/dialog'
import { useAccount } from '@/components/layout/account-context-provider'
import { useAccountDocument } from '@/hooks/use-account-document'
import { getAuth } from '@firebase/auth'


export default function Home() {
    const { push } = useDirectionalRouter()
    const { setStep, setWeek } = useRewindStep()
    const { setChat, setEmotionList, setTotalSteps } = useCommunicationStep()
    
    const { account, user, setUser } = useAccount()
    const { isLoggedIn, updateUserAccount } = useAccountDocument()
    
    const [dialogOpen, setDialogOpen] = useState(false)
    
    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (user === firebaseUser) return
            setUser(firebaseUser)
            updateUserAccount(firebaseUser).then(noop)
        })
        return () => unsubscribe()
    }, [setUser, updateUserAccount, user])
    
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isLoggedIn) {
                push('/login')
            } else {
                if (isEmpty(account?.nickname)) {
                    setDialogOpen(true)
                }
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [account?.nickname, isLoggedIn, push])
    
    const recordingButton = useCallback((text: string, disabled: boolean, onClick: () => void) => {
        return (
            <div
                className={clsx('h-[100px] rounded-4xl flex items-center justify-center p-4 break-keep', disabled ? 'text-[#838383] bg-[#ECECEC]' : 'transition duration-300 active:scale-105 bg-white text-black cursor-pointer')}
                onClick={disabled ? undefined : onClick}
            >
                {text}
            </div>
        )
    }, [])
    
    return (
        <div
            className='w-full h-full flex flex-col items-center justify-start text-white pt-20 px-6 gap-y-8'
        >
            <Character.Image mode='welcome' width={100} height={130}/>
            <div className='flex flex-col gap-y-4 w-full'>
                <span className='text-[#3674B5] text-20-bold text-start'>
                    오늘 어떤 기록을 하고 싶어?
                </span>
                <div className='w-full grid-cols-2 grid gap-x-4 text-black'>
                    {recordingButton('오늘을 기록하기', false,
                        () => {
                            setChat([])
                            setEmotionList([])
                            push('/communication')
                        }
                    )}
                    {recordingButton('지난 일주일 회고하기', false,
                        () => {
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
            <Dialog.NicknameSet open={dialogOpen} onClose={() => setDialogOpen(false)}/>
        </div>
    )
}
