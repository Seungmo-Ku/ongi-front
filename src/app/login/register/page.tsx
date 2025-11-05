'use client'

import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import app from '../../../../firebaseConfig'
import { FirebaseError } from '@firebase/util'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { useSetAtom } from 'jotai'
import { SpinnerViewAtom } from '@/components/spinner/spinner-view'


const RegisterPage = () => {
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
            setError('비밀번호가 일치하지 않습니다.')
        } else {
            setError('')
        }
    }, [password, passwordConfirm])
    
    // 회원가입 처리 함수
    const handleSignUp = async () => {
        if (!email || !password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.')
            return
        }
        if (password.length < 6) {
            setError('비밀번호는 6자리 이상이어야 합니다.')
            return
        }
        setIsLoading(true)
        setError('')
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            if (userCredential.user) {
                back()
            } else {
                setError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.')
            }
        } catch (err) {
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case 'auth/email-already-in-use':
                        setError('이미 사용 중인 이메일입니다.')
                        break
                    case 'auth/weak-password':
                        setError('비밀번호는 6자리 이상이어야 합니다.')
                        break
                    default:
                        setError('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.')
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
                        이메일
                    </p>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='이메일'
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                    />
                </div>
                <div className='w-full flex flex-col justify-start gap-y-3'>
                    <p className='text-15-bold text-[#353535]'>
                        비밀번호
                    </p>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='비밀번호'
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                    />
                    <input
                        type='password'
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder='비밀번호 확인'
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
                    가입하기
                </button>
            </div>
        </div>
    )
}

export default RegisterPage