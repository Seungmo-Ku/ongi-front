'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { ref, uploadBytes, getStorage } from '@firebase/storage'
import app from '../../../../firebaseConfig'
import { useAccount } from '@/components/layout/account-context-provider'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { getAuth } from '@firebase/auth'
import { isEmpty, noop } from 'lodash'
import { useAccountDocument } from '@/hooks/use-account-document'
import { useRecord } from '@/hooks/use-record'
import { Textarea } from '@headlessui/react'
import imageCompression from 'browser-image-compression'


export default function PhotoUploadPage() {
    
    const { account, user, setUser } = useAccount()
    const { push } = useDirectionalRouter()
    const { updateUserAccount } = useAccountDocument()
    
    const [error, setError] = useState(false)
    const [fileToUpload, setFileToUpload] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [question, setQuestion] = useState<string>('')
    const [answer, setAnswer] = useState<string>('')
    const [imageUrl, setImageUrl] = useState<string>('')
    const [step, setStep] = useState<'upload' | 'answer'>('upload')
    
    const { createRecord, getQuestion } = useRecord()
    
    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            if (user?.uid === firebaseUser?.uid) return
            setUser(firebaseUser)
            if (firebaseUser) updateUserAccount(firebaseUser).then(noop)
        })
        return () => unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setUser, updateUserAccount])
    
    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return
        
        // 용량 체크 (5MB)
        // if (selectedFile.size > 5 * 1024 * 1024) {
        //     setError(true)
        //     return
        // }
        
        const options = {
            maxSizeMB: 1,          // 이미지 최대 용량 (1MB)
            maxWidthOrHeight: 1920, // 최대 넓이 또는 높이
            useWebWorker: true    // 웹워커 사용 (UI 블로킹 방지)
        }
        
        setError(false)
        
        try {
            const compressedFile = await imageCompression(selectedFile, options)
            setFileToUpload(compressedFile) // 실제 파일 객체 저장
            
            // 기존 미리보기 URL 해제
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
            // 새 미리보기 URL 생성
            const newPreviewUrl = URL.createObjectURL(selectedFile)
            setPreviewUrl(newPreviewUrl)
            
            e.target.value = ''
        }catch {
            setError(true)
            return
        }
        
    }, [previewUrl])
    
    // 업로드 버튼 클릭 시 실행될 함수
    const handleUpload = useCallback(async () => {
        if (!fileToUpload) {
            return
        }
        
        setIsUploading(true)
        
        try {
            // 1. Firebase Storage에 어디에 저장할 지 '참조'를 만듭니다.
            const fileName = `${Date.now()}_${fileToUpload.name}`
            const storageRef = ref(getStorage(app), `uploads/${account?.uid}/${fileName}`)
            
            const uploadTask = await uploadBytes(storageRef, fileToUpload)
            
            // const downloadURL = await getDownloadURL(uploadTask.ref)
            const downloadURL = `https://storage.googleapis.com/jerry-a9e31.firebasestorage.app/uploads/${account?.uid}/${fileName}`
            setImageUrl(downloadURL)
            
            const response = await getQuestion({
                imageUrl: downloadURL
            })
            
            if (!response) {
                setQuestion('질문을 불러오지 못했습니다.')
                setStep('answer')
                return
            }
            
            setQuestion(response.question)
            setStep('answer')
        } catch {
            setError(true)
        } finally {
            setIsUploading(false)
        }
    }, [account, fileToUpload, getQuestion])
    
    const handleSaveRecord = useCallback(async () => {
        if (isEmpty(answer)) return
        setIsUploading(true)
        try {
            const response = await createRecord({
                uid: account?.uid || '',
                imageUrl: imageUrl,
                question: question,
                answer: answer
            })
            if (response) {
                push('/photo/calendar')
                return
            }
        } catch {
            setError(true)
        } finally {
            setIsUploading(false)
        }
    }, [account?.uid, answer, createRecord, imageUrl, push, question])
    
    const buttonOnClick = useCallback(() => {
        if (!account || isUploading) {
            push('/login')
            return
        }
        if (step === 'upload') {
            handleUpload()
            return
        } else {
            handleSaveRecord()
        }
    }, [account, handleSaveRecord, handleUpload, isUploading, push, step])
    
    return (
        <div className='h-full w-full flex flex-col overflow-hidden items-center justify-center gap-y-5 px-3'>
            {
                // eslint-disable-next-line @next/next/no-img-element
                previewUrl ? <img src={previewUrl} alt='upload preview' className='max-h-96 max-w-full object-contain'/> : <div className='h-96 w-full bg-gray-200 flex items-center justify-center'>이미지를 선택하세요</div>
            }
            
            {
                step === 'upload' ? (
                    <div className='flex flex-col items-center gap-y-2'>
                        <label htmlFor='proof-shot-select' className='cursor-pointer p-3 bg-black rounded-md'>
                            <div className='text-16-semibold'>이미지 선택</div>
                        </label>
                        {error && <div className='text-14-medium text-red-500'>5MB 이하의 이미지를 업로드 해 주세요</div>}
                    </div>
                ) : (
                    <div className='flex flex-col items-center gap-y-2 w-full'>
                        <p className='text-black'>
                            질문: {question}
                        </p>
                        <Textarea
                            className='w-full bg-black text-white'
                            placeholder={'답변을 입력해주세요'}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>
                )
            }
            
            
            <input
                className='hidden'
                id='proof-shot-select'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
            />
            
            {/* 업로드 버튼 */}
            <button
                onClick={buttonOnClick}
                disabled={!fileToUpload || isUploading}
                className='p-3 bg-blue-500 text-white rounded-md disabled:bg-gray-400'
            >
                {step === 'upload' ? (isUploading ? '업로드 중...' : '업로드') : '기록 저장'}
            </button>
        </div>
    )
}