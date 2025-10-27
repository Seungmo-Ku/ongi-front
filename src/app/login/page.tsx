'use client'

import { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import app from '../../../firebaseConfig'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { FirebaseError } from '@firebase/util'


const LoginPage = () => {
    const { back } = useDirectionalRouter()
    const auth = getAuth(app)
    
    // 이메일, 비밀번호, 에러 메시지, 로딩 상태를 관리할 state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    // 로그인 처리 함수
    const handleLogin = async () => {
        if (!email || !password) {
            setError('이메일과 비밀번호를 모두 입력해주세요.')
            return
        }
        setIsLoading(true)
        setError('')
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if (userCredential.user) back()
            else {
                setError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.')
            }
        } catch (err) {
            // Firebase 에러 코드에 따라 사용자 친화적인 메시지 설정
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case 'auth/user-not-found':
                        setError('가입되지 않은 이메일입니다.')
                        break
                    case 'auth/wrong-password':
                        setError('비밀번호가 틀렸습니다.')
                        break
                    case 'auth/invalid-credential':
                        setError('이메일 또는 비밀번호가 잘못되었습니다.')
                        break
                    default:
                        setError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.')
                }
            }
        } finally {
            setIsLoading(false)
        }
    }
    
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
                await handleLogin()
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
        <div className='w-full h-full flex flex-col items-center justify-center p-5'>
            <div className='w-full max-w-sm space-y-8'>
                <div>
                    <p className='text-ongi-my-communication text-48-bold text-center'>MoodTracker</p>
                </div>
                
                <div className='bg-white p-8 rounded-lg shadow-md space-y-6'>
                    <div className='space-y-4'>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='이메일 주소'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                        />
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='비밀번호'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
                        />
                    </div>
                    
                    {error && <p className='text-red-500 text-sm text-center'>{error}</p>}
                    
                    <div className='space-y-4'>
                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className='w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400'
                        >
                            {isLoading ? '처리 중...' : '로그인'}
                        </button>
                        <button
                            onClick={handleSignUp}
                            disabled={isLoading}
                            className='w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-400'
                        >
                            {isLoading ? '처리 중...' : '회원가입'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage