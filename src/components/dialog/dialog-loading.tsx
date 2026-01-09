import { Dialog, DialogPanel } from '@headlessui/react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'


interface DialogLoadingProps {
    open: boolean
}

export const DialogLoading = ({
    open
}: DialogLoadingProps) => {
    const { t } = useTranslation('common')
    
    return (
        <Dialog transition open={open} onClose={() => {
        }} className='relative z-50 transition duration-300 ease-out data-closed:opacity-0'>
            <div className='fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/50'>
                <DialogPanel className='space-y-1 bg-white text-black p-5 rounded-2xl flex flex-col items-center justify-start relative'>
                    <div className='flex flex-col items-center w-full gap-y-6'>
                        <Image
                            src='/images/character/thinking.png'
                            alt='thinking'
                            width={150}
                            height={150}
                        />
                        <p className='text-[#686868] text-13-regular text-center animate-bounce'>
                            {t('dialog_thinking')}
                        </p>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
