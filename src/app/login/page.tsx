'use client'

import Button from '@/components/button'
import Image from 'next/image'
import { useDirectionalRouter } from '@/hooks/use-directional-router'


const LoginPage = () => {
    const { push } = useDirectionalRouter()
    
    return (
        <div className='w-full h-full flex items-center justify-center bg-blue-200 text-white relative'>
            <p className='text-ongi-my-communication text-48-bold'>MoodTracker</p>
            <div className='absolute bottom-10 px-5 w-full'>
                <Button.Communication
                    className='!text-black !bg-white gap-x-1'
                    onClick={() => {
                        //onClick
                        push('/')
                    }}
                >
                    <Image src='/images/google.svg' alt='Google' width={20} height={20}/>
                    <p className='text-16-regular'>
                        Google로 계속하기
                    </p>
                </Button.Communication>
            </div>
        </div>
    )
}

export default LoginPage