'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { ref, uploadBytes, getStorage } from '@firebase/storage'
import { useAccount } from '@/components/layout/account-context-provider'
import { useDirectionalRouter } from '@/hooks/use-directional-router'
import { isEmpty } from 'lodash'
import { useRecord } from '@/hooks/use-record'
import { Textarea } from '@headlessui/react'
import imageCompression from 'browser-image-compression'
import { Plus } from 'lucide-react'
import app from '../../../../firebaseConfig'
import { useCurrentDate } from '@/components/layout/current-date-provider'
import { useCreateRecordMutation, useGetAllRecordsCountQuery, useGetLastRecordsQuery } from '@/hooks/use-react-query'
import { useSetAtom } from 'jotai'
import { SpinnerViewAtom } from '@/components/spinner/spinner-view'
import { DialogSevenDaysAtom } from '@/components/dialog/dialog-seven-days'


export default function RecordUploadPage() {
    
    const { account } = useAccount()
    const { push } = useDirectionalRouter()
    
    const [error, setError] = useState(false)
    const [fileToUpload, setFileToUpload] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [question, setQuestion] = useState<string>('')
    const [category, setCategory] = useState<string>('')
    const [answer, setAnswer] = useState<string>('')
    const [imageUrl, setImageUrl] = useState<string>('')
    const [step, setStep] = useState<'upload' | 'answer'>('upload')
    
    const { data } = useGetLastRecordsQuery()
    const { data: uploadCount } = useGetAllRecordsCountQuery()
    
    const setLoadingShow = useSetAtom(SpinnerViewAtom)
    const setSevenDays = useSetAtom(DialogSevenDaysAtom)
    
    useEffect(() => {
        return () => {
            setIsUploading(false)
        }
    }, [setSevenDays])
    
    useEffect(() => {
        if (isUploading) {
            setLoadingShow({ show: true })
        } else {
            setLoadingShow({ show: false })
        }
    }, [isUploading, setLoadingShow])
    
    const { getQuestion } = useRecord()
    const { setShowingDate, setCurrentDate } = useCurrentDate()
    const { mutateAsync } = useCreateRecordMutation()
    
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
                imageUrl: downloadURL,
                uploadCount: uploadCount || 0
            })
            
            if (!response) {
                setQuestion('질문을 불러오지 못했습니다.')
                setStep('answer')
                return
            }
            
            setQuestion(response.question)
            setCategory(response.category)
            setStep('answer')
        } catch {
            setError(true)
        } finally {
            setIsUploading(false)
        }
    }, [account?.uid, fileToUpload, getQuestion, uploadCount])
    
    const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return
        
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
        } catch {
            setError(true)
            return
        }
        
    }, [previewUrl])
    
    useEffect(() => {
        if (isEmpty(question) && fileToUpload && !isUploading) {
            handleUpload()
        }
    }, [fileToUpload, handleUpload, isUploading, question])
    
    const handleSaveRecord = useCallback(async () => {
        if (isEmpty(answer)) return
        setIsUploading(true)
        
        const count = data?.count || -1
        
        try {
            const response = await mutateAsync({
                uid: account?.uid || '',
                imageUrl: imageUrl,
                question: question,
                answer: answer,
                category: category
            })
            if (response) {
                setShowingDate(new Date())
                setCurrentDate(new Date())
                setIsUploading(false)
                if (count === 6) {
                    // 7일째 기록 작성 완료
                    // TODO. gpt 호출해서 배지 만들기 api 호출
                    setSevenDays({
                        open: true
                    })
                }
                return
            }
        } catch {
            setError(true)
        } finally {
            setIsUploading(false)
        }
    }, [account?.uid, answer, category, data?.count, imageUrl, mutateAsync, question, setCurrentDate, setSevenDays, setShowingDate])
    
    const buttonOnClick = useCallback(() => {
        if (step === 'upload') {
            handleUpload()
            return
        } else {
            handleSaveRecord()
        }
    }, [handleSaveRecord, handleUpload, step])
    
    return (
        <div className='h-full w-full flex flex-col overflow-y-scroll items-center justify-start gap-y-7 px-5'>
            <div
                className='w-full aspect-square shrink-0 rounded-[15px]'
                onClick={(e) => {
                    if (!isEmpty(question)) {
                        e.preventDefault()
                        e.stopPropagation()
                        return
                    }
                    if (!account || isUploading) {
                        e.preventDefault()
                        e.stopPropagation()
                        push('/login')
                        return
                    }
                }}
            >
                {
                    previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt='upload preview' className='w-full aspect-square shrink-0 object-contain rounded-[15px]'/>
                    ) : (
                        <label htmlFor='proof-shot-select' className='w-full aspect-square shrink-0 bg-[#EFEFEF] flex flex-col gap-y-7 items-center justify-center rounded-[15px]'>
                            <div className='w-[30px] h-[30px] shrink-0 rounded-full bg-[#35618E] flex items-center justify-center'>
                                <Plus className='text-white size-4 shrink-0'/>
                            </div>
                            <p className='text-16-medium text-[#888]'>
                                하루 한장의 사진으로 당신을 알아보세요
                            </p>
                        </label>
                    )
                }
            </div>
            
            {
                step === 'answer' && (
                    <div className='flex flex-col items-center gap-y-2 w-full'>
                        <p className='text-black text-14-regular gap-x-1'>
                            <span className='text-14-bold mr-1'>
                                Q
                            </span>
                            {question}
                        </p>
                        <Textarea
                            className='w-full bg-white text-black'
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
            {
                step === 'answer' && (
                    <button
                        onClick={buttonOnClick}
                        disabled={isEmpty(answer)}
                        className='p-3 bg-blue-500 text-white rounded-md disabled:bg-gray-400'
                    >
                        기록 저장
                    </button>
                )
            }
        </div>
    )
}