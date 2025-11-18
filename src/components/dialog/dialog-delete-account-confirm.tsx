'use client'

import { Dialog, DialogPanel } from '@headlessui/react'


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
                                정말 탈퇴하시겠습니까?
                            </p>
                            <p className='text-16-regular text-red-500 text-center break-keep'>
                                탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                            </p>
                            <div className='h-10'/>
                            <div className='w-full grid grid-cols-2 gap-x-2'>
                                <button
                                    className='px-10 py-3 text-13-regular rounded-[30px] bg-[#F5F5F5] text-black'
                                    onClick={() => {
                                        onClose()
                                    }}
                                >
                                    취소
                                </button>
                                <button
                                    className='px-10 py-3 text-13-regular rounded-[30px] bg-[#F5F5F5] text-red-500'
                                    onClick={() => {
                                        onConfirm()
                                    }}
                                >
                                    탈퇴하기
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}