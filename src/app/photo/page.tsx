'use client'

import Button from '@/components/button'
import { useDirectionalRouter } from '@/hooks/use-directional-router'


export default function PhotoPage() {
    
    const { push } = useDirectionalRouter()
    
    return (
        <div className='h-full w-full flex flex-col overflow-hidden items-center justify-center gap-y-5 px-3'>
            <p className='text-black'>PHOTO PAGE</p>
            <Button.Communication
                onClick={() => {
                    push('/photo/upload')
                }}
            >
                Upload Page
            </Button.Communication>
            <Button.Communication
                onClick={() => {
                    push('/photo/calendar')
                }}
            >
                Calendar Page
            </Button.Communication>
        </div>
    )
}