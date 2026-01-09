'use client'

import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import app from '../../../../firebaseConfig'
import { FirebaseError } from '@firebase/util'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useSetAtom } from 'jotai'
import { SpinnerViewAtom } from '@/components/spinner/spinner-view'
import { useTranslation } from 'react-i18next'


const RegisterPage = () => {
    const { t } = useTranslation('common')
    const auth = getAuth(app)
    const { back } = useDirectionalRouter()
    
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
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
    
    useEffect(() => {
        if (password !== passwordConfirm && !isEmpty(passwordConfirm)) {
            setError(t('error_password_mismatch'))
        } else {
            setError('')
        }
    }, [password, passwordConfirm, t])
    
    // 회원가입 처리 함수
    const handleSignUp = async () => {
        if (!email || !password) {
            setError(t('error_enter_email_password'))
            return
        }
        if (password.length < 6) {
            setError(t('error_password_length'))
            return
        }
        setIsLoading(true)
        setError('')
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            if (userCredential.user) {
                back()
            } else {
                setError(t('error_register_failed'))
            }
        } catch (err) {
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case 'auth/email-already-in-use':
                        setError(t('error_email_in_use'))
                        break
                    case 'auth/weak-password':
                        setError(t('error_password_length'))
                        break
                    default:
                        setError(t('error_register_failed'))
                }
            }
        } finally {
            setIsLoading(false)
        }
    }
    
    return (
        <div className='w-full h-full flex flex-col items-center justify-between px-4 py-5 gap-y-6'>
            <div className='w-full flex flex-col items-center justify-start gap-y-6'>
                <div className='w-full flex flex-col justify-start gap-y-3'>
                    <p className='text-15-bold text-[#353535]'>
                        {t('label_email')}
                    </p>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('label_email')}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                    />
                </div>
                <div className='w-full flex flex-col justify-start gap-y-3'>
                    <p className='text-15-bold text-[#353535]'>
                        {t('label_password')}
                    </p>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('label_password')}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                    />
                    <input
                        type='password'
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder={t('placeholder_password_confirm')}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                    />
                    {error && <p className='text-red-500 text-sm text-left'>{error}</p>}
                </div>
            </div>
            
            <div className='w-full h-[50px] flex items-center justify-center p-5 pb-6'>
                <button
                    onClick={handleSignUp}
                    className='w-full py-2 px-4 bg-[#353535] text-16-regular text-white rounded-[8px] disabled:bg-black'
                    disabled={isLoading || (isEmpty(email) || isEmpty(password)) || password !== passwordConfirm}
                >
                    {t('sign_up')}
                </button>
            </div>
        </div>
    )
}

export default RegisterPage
