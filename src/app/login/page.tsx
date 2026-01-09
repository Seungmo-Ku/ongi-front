'use client'

import { useEffect, useState } from 'react'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import app from '../../../firebaseConfig'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { FirebaseError } from '@firebase/util'
import { useSetAtom } from 'jotai'
import { SpinnerViewAtom } from '@/components/spinner/spinner-view'
import { useTranslation } from 'react-i18next'


const LoginPage = () => {
    const { t } = useTranslation('common')
    const { back, push } = useDirectionalRouter()
    const auth = getAuth(app)
    
    // 이메일, 비밀번호, 에러 메시지, 로딩 상태를 관리할 state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const setLoadingShow = useSetAtom(SpinnerViewAtom)
    
    useEffect(() => {
        if (isLoading) {
            setLoadingShow({ show: true })
        } else {
            setLoadingShow({ show: false })
        }
    }, [isLoading, setLoadingShow])
    
    // 로그인 처리 함수
    const handleLogin = async () => {
        if (!email || !password) {
            setError(t('error_enter_email_password'))
            return
        }
        setIsLoading(true)
        setError('')
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if (userCredential.user) push('/record')
            else {
                setError(t('error_login_failed'))
            }
        } catch (err) {
            // Firebase 에러 코드에 따라 사용자 친화적인 메시지 설정
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case 'auth/user-not-found':
                        setError(t('error_user_not_found'))
                        break
                    case 'auth/wrong-password':
                        setError(t('error_wrong_password'))
                        break
                    case 'auth/invalid-credential':
                        setError(t('error_invalid_credential'))
                        break
                    default:
                        setError(t('error_login_failed'))
                }
            }
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <div className='w-full h-full flex flex-col items-center justify-center px-12 gap-y-12'>
            <img src='/images/logo.png' alt='logo' className='h-10'/>
            <div className='w-full flex flex-col items-center justify-center gap-y-4'>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('placeholder_email')}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('placeholder_password')}
                    className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                />
                {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
            </div>
            <div className='w-full flex flex-col items-center justify-center gap-y-4'>
                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className='w-full py-2 px-4 bg-[#353535] text-16-regular text-white rounded-[8px] disabled:bg-black transition duration-300 active:scale-105'
                >
                    {t('login')}
                </button>
                <button
                    onClick={() => {
                        push('/login/register')
                    }}
                    disabled={isLoading}
                    className='w-full py-2 px-4 bg-white text-16-regular text-black rounded-[8px] border-[0.5px] border-black'
                >
                    {t('register')}
                </button>
            </div>
        </div>
    )
}

export default LoginPage
