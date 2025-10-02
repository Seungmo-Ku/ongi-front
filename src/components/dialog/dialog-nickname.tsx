'use client'

import { Dialog, DialogPanel, DialogTitle, Input } from '@headlessui/react'
import Image from 'next/image'
import { useAccountDocument } from '@/hooks/use-account-document'
import { useState } from 'react'
import Button from '@/components/button'
import { isEmpty } from 'lodash'
import { useAccount } from '@/components/layout/account-context-provider'


interface DialogNicknameProps {
    open: boolean,
    onClose: () => void
}

export const DialogNickname = ({
    open,
    onClose
}: DialogNicknameProps) => {
    const { account } = useAccount()
    const { updateAccountNickname } = useAccountDocument()
    
    const [isLoading, setIsLoading] = useState(false)
    const [nickname, setNickname] = useState('')
    
    return (
        <Dialog transition open={open} onClose={() => {
        }} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='space-y-1 bg-white text-black p-5 rounded-2xl flex flex-col items-center justify-start relative'>
                    <DialogTitle className='text-20-medium flex flex-row items-center justify-center gap-x-1.5'>
                        <Image
                            src='/images/character/emotion/neutral.svg'
                            alt='neutral'
                            width={40}
                            height={53}
                        />
                        <p>닉네임 설정하기</p>
                    </DialogTitle>
                    <div className='flex flex-col items-center w-full gap-y-6'>
                        <p className='text-[#686868] text-13-regular text-center'>
                            함께하는 동안 어떤 이름으로 불리면 좋을까요?
                        </p>
                        <Input
                            className='rounded-[30px] bg-[#E5E5E5] text-black focus:ring-0 focus:border-tunelog-blue p-2 w-full h-[40px]'
                            maxLength={5}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        <Button.Communication
                            disabled={isEmpty(nickname) || isLoading}
                            onClick={async () => {
                                if (isEmpty(nickname) || isLoading) return
                                if (!account) return
                                setIsLoading(true)
                                const success = await updateAccountNickname(account.uid, nickname)
                                if (success) {
                                    onClose()
                                }
                                setIsLoading(false)
                            }}
                        >
                            MoodTracker 시작하기
                        </Button.Communication>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}