'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { useTranslation } from 'react-i18next'


interface DialogDeleteAccountConfirmProps {
    open: boolean,
    onClose: () => void,
    onConfirm: () => void
}

export const DialogDeleteAccountConfirm = ({
    open,
    onClose,
    onConfirm
}: DialogDeleteAccountConfirmProps) => {
    const { t } = useTranslation('common')
    
    return (
        <Dialog
            transition
            open={open}
            onClose={onClose}
            className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'
        >
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='w-3/4 bg-white text-black p-4 rounded-2xl flex flex-col items-center justify-start relative gap-y-5'>
                    <div className='flex flex-col items-center w-full gap-y-6'>
                        <div className='w-full flex flex-col gap-y-3'>
                            <p className='text-20-bold text-center break-keep'>
                                {t('dialog_delete_account_title')}
                            </p>
                            <p className='text-16-regular text-red-500 text-center break-keep'>
                                {t('delete_account_confirm')}
                            </p>
                            <div className='h-10'/>
                            <div className='w-full grid grid-cols-2 gap-x-2'>
                                <button
                                    className='px-10 py-3 text-13-regular rounded-[30px] bg-[#F5F5F5] text-black'
                                    onClick={() => {
                                        onClose()
                                    }}
                                >
                                    {t('dialog_cancel')}
                                </button>
                                <button
                                    className='px-10 py-3 text-13-regular rounded-[30px] bg-[#F5F5F5] text-red-500'
                                    onClick={() => {
                                        onConfirm()
                                    }}
                                >
                                    {t('dialog_delete_account_button')}
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
