'use client'

import Button from '@/components/button'
import Image from 'next/image'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import app from '../../../firebaseConfig'


const LoginPage = () => {
    const { back } = useDirectionalRouter()
    
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    // const { isLoggedIn } = useAccount()

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         if (isLoggedIn) {
    //             back()
    //         }
    //     }, 500)
    //     return () => clearTimeout(timer)
    // }, [back, isLoggedIn])
    
    return (
        <div className='w-full h-full flex items-center justify-center bg-blue-200 text-white relative'>
            <p className='text-ongi-my-communication text-48-bold'>MoodTracker</p>
            <div className='absolute bottom-10 px-5 w-full'>
                <Button.Communication
                    className='!text-black !bg-white gap-x-1'
                    onClick={async () => {
                        //onClick
                        try {
                            const result = await signInWithPopup(auth, provider)
                            const user = result.user
                            if (!user) {
                                console.error('No user information found after sign-in.')
                                return
                            }
                            // console.log('User Info:', user)
                        } catch (error) {
                            console.error('Error during sign-in:', error)
                        }
                        back()
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