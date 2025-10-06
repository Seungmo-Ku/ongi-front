'use client'

import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Character from '@/components/character'
import clsx from 'clsx'
import { useRewindStep } from '@/components/layout/rewind-step-provider'
import { useCommunicationStep } from '@/components/layout/communication-step-provider'
import { isEmpty, noop } from 'lodash'
import { Dialog } from '@/components/dialog'
import { useAccount } from '@/components/layout/account-context-provider'
import { useAccountDocument } from '@/hooks/use-account-document'
import { getAuth } from '@firebase/auth'
import { useGetEmpathy } from '@/hooks/use-get-empathy'


export default function Home() {
    const { push } = useDirectionalRouter()
    const { setStep, setWeek } = useRewindStep()
    const { setChat, setEmotionList, setTotalSteps } = useCommunicationStep()
    const { getEmpathyByDate, enableRewind } = useGetEmpathy()
    
    const { account, user, setUser } = useAccount()
    const { updateUserAccount } = useAccountDocument()
    
    const [dialogOpen, setDialogOpen] = useState(false)
    const [hasTodayEmpathy, setHasTodayEmpathy] = useState<boolean>(false)
    const [hasTodayRemind, setHasTodayRemind] = useState<boolean>(false)
    
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
        const timer = setTimeout(() => {
            if (account && isEmpty(account?.nickname)) {
                setDialogOpen(true)
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [account, push])
    
    const todayEmpathy = useCallback(async () => {
        return await getEmpathyByDate(new Date())
    }, [getEmpathyByDate])
    
    const todayRemind = useCallback(async () => {
        return await getEmpathyByDate(new Date(), true)
    }, [getEmpathyByDate])
    
    useEffect(() => {
        if (account) {
            todayEmpathy().then((empathy) => {
                setHasTodayEmpathy(!!empathy)
            })
        }
    }, [account, todayEmpathy])
    
    useEffect(() => {
        if (account) {
            todayRemind().then((remind) => {
                setHasTodayRemind(!!remind)
            })
        }
    }, [account, todayRemind])
    
    const disableRewindButton = useMemo(() => {
        // console.log('hasTodayRemind', hasTodayRemind, 'enableRewind', enableRewind())
        if (!account) return false
        // disable: 오늘 rewind 가 있거나, rewind 하는 날이 아닐 때
        return hasTodayRemind || !enableRewind()
    }, [hasTodayRemind, enableRewind, account])
    
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
            <Dialog.NicknameSet open={dialogOpen} onClose={() => setDialogOpen(false)}/>
        </div>
    )
}
