'use client'

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Badge } from '@/libs/interfaces/badge.interface'
import { atom, useAtom } from 'jotai'
import { Fragment, useCallback, useMemo } from 'react'
import { X } from 'lucide-react'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'


interface DialogSheetViewBadgeProps {
    open: boolean,
    badge: Badge | null | undefined
}

export const DialogSheetViewBadgeAtom = atom<DialogSheetViewBadgeProps>({ open: false, badge: null })

export const DialogSheetViewBadge = ({}) => {
    const { t } = useTranslation('common')
    const [dialogSheetSelectBadgeAtom, setDialogSheetSelectBadgeAtom] = useAtom(DialogSheetViewBadgeAtom)
    const { open, badge } = dialogSheetSelectBadgeAtom
    
    const onClose = useCallback(() => {
        setDialogSheetSelectBadgeAtom({
            ...dialogSheetSelectBadgeAtom,
            open: false
        })
    }, [dialogSheetSelectBadgeAtom, setDialogSheetSelectBadgeAtom])
    
    const keyword = useMemo(() => {
        if (!badge) return ''
        switch (badge.selected) {
            case 0:
                return badge.perspective_1.keyword
            case 1:
                return badge.perspective_2.keyword
            case 2:
                return badge.perspective_3.keyword
            default:
                return ''
        }
    }, [badge])
    
    const description = useMemo(() => {
        if (!badge) return ''
        switch (badge.selected) {
            case 0:
                return badge.perspective_1.description
            case 1:
                return badge.perspective_2.description
            case 2:
                return badge.perspective_3.description
            default:
                return ''
        }
    }, [badge])
    
    const details = useMemo(() => {
        if (!badge) return []
        switch (badge.selected) {
            case 0:
                return badge.perspective_1.details
            case 1:
                return badge.perspective_2.details
            case 2:
                return badge.perspective_3.details
            default:
                return []
        }
    }, [badge])
    
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
                        <DialogPanel className='w-full max-h-3/4 bg-white text-black p-6 pb-11 rounded-t-2xl flex flex-col items-center justify-start relative gap-y-3 overflow-y-scroll'>
                            <DialogTitle className='w-full flex items-center justify-between text-16-regular'>
                                <p className='text-black text-16-bold'>
                                    {t('seven_step_stamp')}
                                </p>
                                <div className='text-[#8F8F8F] cursor-pointer' onClick={onClose}>
                                    <X/>
                                </div>
                            </DialogTitle>
                            <p className='text-[5F5F5F] text-13-regular w-full break-keep'>
                                {t('dialog_view_badge_title')}
                            </p>
                            <div className='flex flex-col items-center w-full gap-y-10'>
                                <div className='w-full flex flex-col items-center justify-start gap-y-5'>
                                    <img
                                        src={badge?.imageUrl ?? ''}
                                        alt={badge?.imageUrl ?? ''}
                                        className='w-[100px] h-[100px] rounded-full object-cover shrink-0'
                                    />
                                    <div className='w-full flex flex-col items-center justify-start gap-y-2.5'>
                                        <p className='text-black text-16-bold'>{keyword}</p>
                                        <p className='text-[#575757] text-13-regular'>{description}</p>
                                    </div>
                                </div>
                                {
                                    !isEmpty(details) && (
                                        <div className='w-full flex flex-col items-start justify-start gap-y-1 text-[#5F5F5F] text-13-regular'>
                                            <p>{t('dialog_view_badge_subtitle')}</p>
                                            {
                                                details.map((detail, index) => (
                                                    <p key={`badge-detail-${index}`} className='pl-1'>
                                                        • {detail}
                                                    </p>
                                                ))
                                            }
                                        </div>
                                    )}
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}
