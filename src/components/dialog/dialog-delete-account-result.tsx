'use client'

import { Dialog, DialogPanel } from '@headlessui/react'


interface DialogDeleteAccountResultProps {
    open: boolean,
    onClose: () => void,
    text: string
}

export const DialogDeleteAccountResult = ({
    open,
    onClose,
    text = ''
}: DialogDeleteAccountResultProps) => {
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
                                {text}
                            </p>
                            <div className='h-10'/>
                            <button
                                className='px-10 py-3 text-16-regular rounded-[30px] bg-[#F5F5F5] text-black'
                                onClick={() => {
                                    onClose()
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}