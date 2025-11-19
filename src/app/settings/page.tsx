'use client'

import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import app from '../../../firebaseConfig'
import { useAccount } from '@/components/layout/account-context-provider'
import { DialogDeleteAccountConfirm } from '@/components/dialog/dialog-delete-account-confirm'
import { DialogDeleteAccountResult } from '@/components/dialog/dialog-delete-account-result'


export default function SettingsPage() {
    const { user, setUser, setAccount } = useAccount()
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [openResultDialog, setOpenResultDialog] = useState(false)
    const [resultText, setResultText] = useState('')
    
    // 1. 로그아웃 함수
    const handleLogout = async () => {
        const auth = getAuth(app)
        await signOut(auth)
        setUser(null)
        setAccount(null)
        router.push('/record')
    }
    
    // 2. 회원 탈퇴 함수
    const handleWithdrawal = async () => {
        setIsDeleting(true)
        
        try {
            // 현재 로그인한 유저의 ID 토큰 가져오기 (보안 검증용)
            const idToken = await user?.getIdToken()
            
            // 회원 탈퇴 API 호출
            const response = await fetch('/api/auth/withdraw', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            })
            
            if (response.ok) {
                // setResultText('회원 탈퇴가 완료되었습니다.')
                // setOpenResultDialog(true)
                setUser(null)
                setAccount(null)
                // Firebase 클라이언트에서도 로그아웃 처리
                const auth = getAuth(app)
                await signOut(auth)
                router.push('/login')
            } else {
                throw new Error('탈퇴 처리 중 오류가 발생했습니다.')
            }
        } catch (error) {
            console.error(error)
            setResultText('회원 탈퇴에 실패했습니다. 다시 시도해주세요.')
            setOpenResultDialog(true)
        } finally {
            setIsDeleting(false)
        }
    }
    
    return (
        <div className='w-full h-full p-5 flex flex-col gap-y-6 bg-white'>
            {user ? (
                <>
                    {/* 로그인 정보 표시 */}
                    <div className='p-4 bg-gray-100 rounded-lg'>
                        <p className='text-14-regular text-black'>로그인 계정</p>
                        <p className='text-14-bold text-black'>{user.email}</p>
                    </div>
                    
                    {/* 로그아웃 버튼 */}
                    <button
                        onClick={handleLogout}
                        className='w-full py-3 border text-black border-gray-300 rounded-lg hover:bg-gray-50'
                    >
                        로그아웃
                    </button>
                    
                    <hr className='border-gray-200'/>
                    
                    <a
                        href="https://bcgo99.notion.site/2afcae824a6480269b36e1ab7df5ea2e?source=copy_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 text-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        개인정보 처리방침
                    </a>
                    
                    {/* 회원 탈퇴 버튼 (빨간색으로 위험 표시) */}
                    <div className='flex flex-col gap-y-2'>
                        <h3 className='text-sm font-bold text-gray-500'>계정 관리</h3>
                        <button
                            onClick={() => {
                                setOpenDialog(true)
                            }}
                            disabled={isDeleting}
                            className='w-full py-3 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50'
                        >
                            {isDeleting ? '처리 중...' : '회원 탈퇴'}
                        </button>
                        <p className='text-xs text-gray-400 px-1'>
                            탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
                        </p>
                    </div>
                </>
            ) : (
                 // 로그인 안 된 상태
                 <div className='text-center mt-10'>
                     <p className='mb-4 text-black'>로그인이 필요합니다.</p>
                     <button
                         onClick={() => router.push('/login')}
                         className='bg-black text-white px-6 py-3 rounded-lg'
                     >
                         로그인 하러 가기
                     </button>
                 </div>
             )}
            <DialogDeleteAccountConfirm
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleWithdrawal}
            />
            <DialogDeleteAccountResult
                open={openResultDialog}
                onClose={() => setOpenResultDialog(false)}
                text={resultText}
                />
        </div>
    )
}