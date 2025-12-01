'use client'

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Badge } from '@/libs/interfaces/badge.interface'
import { atom, useAtom, useSetAtom } from 'jotai'
import { Fragment, useCallback } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'
import { useSelectBadgeMutation } from '@/hooks/use-react-query'
import { DialogSheetViewBadgeAtom } from '@/components/dialog/dialog-sheet-view-badge'


interface DialogSheetSelectBadgeProps {
    open: boolean,
    badge: Badge | null | undefined
}

export const DialogSheetSelectBadgeAtom = atom<DialogSheetSelectBadgeProps>({ open: false, badge: null })

export const DialogSheetSelectBadge = ({}) => {
    
    const [dialogSheetSelectBadgeAtom, setDialogSheetSelectBadgeAtom] = useAtom(DialogSheetSelectBadgeAtom)
    const setDialogSheetViewBadgeAtom = useSetAtom(DialogSheetViewBadgeAtom)
    const { open, badge } = dialogSheetSelectBadgeAtom
    
    const { mutateAsync } = useSelectBadgeMutation()
    
    const onClose = useCallback(() => {
        setDialogSheetSelectBadgeAtom({
            ...dialogSheetSelectBadgeAtom,
            open: false
        })
    }, [dialogSheetSelectBadgeAtom, setDialogSheetSelectBadgeAtom])
    
    const buttonComponent = useCallback((index: number) => {
        const keyword = badge ? (index === 0 ? badge.perspective_1.keyword : index === 1 ? badge.perspective_2.keyword : badge.perspective_3.keyword) : ''
        const description = badge ? (index === 0 ? badge.perspective_1.description : index === 1 ? badge.perspective_2.description : badge.perspective_3.description) : ''
        return (
            <button
                className={clsx('w-full flex flex-col items-center justify-center py-4.5 gap-y-2 bg-black/10 rounded-[20px] text-black',
                    'transition duration-300 active:text-white active:bg-[#578FCA] active:scale-105'
                )}
                onClick={() => {
                    if (!badge) return
                    badge.selected = index
                    mutateAsync({
                        badgeId: badge.id,
                        index: index
                    })
                    onClose()
                    setTimeout(() => {
                        setDialogSheetViewBadgeAtom({
                            badge,
                            open: true
                        })
                    }, 500)
                }}
            >
                <p className='text-16-bold'>{keyword}</p>
                <p className='text-13-regular'>{description}</p>
            </button>
        )
    }, [badge, mutateAsync, onClose, setDialogSheetViewBadgeAtom])
    
    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as='div' className='relative z-50' onClose={onClose}>
                
                <TransitionChild
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black/50'/>
                </TransitionChild>
                
                <div className='fixed inset-0 flex w-screen items-end justify-center'>
                    <TransitionChild
                        as={Fragment}
                        enter='ease-out duration-300'
                        enterFrom='translate-y-full'
                        enterTo='translate-y-0'
                        leave='ease-in duration-200'
                        leaveFrom='translate-y-0'
                        leaveTo='translate-y-full'
                    >
                        <DialogPanel className='w-full max-h-3/4 bg-white text-black p-6 pb-11 rounded-t-2xl flex flex-col items-center justify-start relative gap-y-5 overflow-y-scroll'>
                            <DialogTitle className='self-end text-20-medium'>
                                <div className='text-[#8F8F8F] cursor-pointer' onClick={onClose}>
                                    <X/>
                                </div>
                            </DialogTitle>
                            <div className='flex flex-col items-center w-full gap-y-10'>
                                <p className='text-16-regular text-black break-keep text-center w-full'>
                                    지난 7개의 기록 속에서 당신의 모습을 가장 잘 담은 키워드를 골라보세요.
                                </p>
                                <div className='w-full flex flex-col gap-y-3'>
                                    {buttonComponent(0)}
                                    {buttonComponent(1)}
                                    {buttonComponent(2)}
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}