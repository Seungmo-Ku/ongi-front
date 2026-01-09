'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useCallback } from 'react'
import { atom, useAtom } from 'jotai'
import { X } from 'lucide-react'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useTranslation } from 'react-i18next'


interface DialogSevenDaysProps {
    open: boolean,
}

export const DialogSevenDaysAtom = atom<DialogSevenDaysProps>({ open: false })

export const DialogSevenDays = () => {
    const { t } = useTranslation('common')
    const [sevenDaysAtom, setSevenDaysAtom] = useAtom(DialogSevenDaysAtom)
    
    const { open } = sevenDaysAtom
    const { push } = useDirectionalRouter()
    
    const onClose = useCallback(() => {
        setSevenDaysAtom({
            ...sevenDaysAtom,
            open: false
        })
    }, [setSevenDaysAtom, sevenDaysAtom])
    
    return (
        <Dialog
            transition
            open={open}
            onClose={onClose}
            className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'
        >
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-3/4 bg-white text-black p-4 rounded-2xl flex flex-col items-center justify-start relative gap-y-5'>
                    <DialogTitle className='self-end text-20-medium'>
                        <div className='text-[#8F8F8F] cursor-pointer' onClick={onClose}>
                            <X/>
                        </div>
                    </DialogTitle>
                    <div className='flex flex-col items-center w-full gap-y-6'>
                        <img src='/images/gift.png' alt='gift' className='w-[120px] h-[120px] shrink-0'/>
                        <div className='w-full flex flex-col gap-y-3'>
                            <p className='text-16-regular text-center break-keep'>
                                {t('dialog_seven_days_title')}
                            </p>
                            <button
                                className='px-10 py-3 text-16-regular rounded-[30px] bg-[#F5F5F5] text-black'
                                onClick={() => {
                                    push('/my')
                                    onClose()
                                }}
                            >
                                {t('dialog_seven_days_button')}
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
