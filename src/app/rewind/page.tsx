'use client'

import { useRewindStep } from '@/components/layout/rewind-step-provider'
import { useCallback, useEffect, useMemo, useState } from 'react'
import RewindStepStart from '@/components/view/rewind/step-start'
import RewindView from '@/components/view/rewind'
import { useGetEmpathy } from '@/hooks/use-get-empathy'
import Image from 'next/image'
import { SelfEmpathy } from '@/libs/interfaces/self-empathy.interface'
import { isEmpty, noop } from 'lodash'
import Box from '@/components/box'
import { useDirectionalRouter } from '@/hooks/use-directional-router'


interface RewindStepStart {
    text: string
    footerText: string
}

const RewindPage = () => {
    
    const { step, setStep, week } = useRewindStep()
    const { push } = useDirectionalRouter()
    
    const [start, setStart] = useState(0)
    const [weeklyEmpathy, setWeeklyEmpathy] = useState<SelfEmpathy[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    
    const stepStart: RewindStepStart[] = useMemo(() => [
        { text: '나와 함께 지난 일주일의 마음을 돌아볼까?', footerText: '그래!' },
        { text: '먼저 지빈이가 어떤 순간에 어떤 감정을 느꼈는지 살펴볼 거야.', footerText: '응, 그래' },
        { text: '그리고 네가 하루를 고르면, 나는 그날의 너가 될 거야.', footerText: '좋아' },
        { text: '우리 함께 이야기하며 그날의 마음을 더 알아보자.', footerText: '회고하러 가자!' }
    ], [])
    
    const { getWeeklyEmpathy } = useGetEmpathy()
    
    const fetchEmpathy = useCallback(async () => {
        if (!isEmpty(weeklyEmpathy)) return
        if (weeklyEmpathy?.length === 1 && weeklyEmpathy[0].id === 'no-data') return
        const empathies = await getWeeklyEmpathy(week)
        if (!empathies) return
        setWeeklyEmpathy(empathies)
    }, [getWeeklyEmpathy, week, weeklyEmpathy])
    
    const footerButtonOnClick = useCallback(() => {
        if (step === 0) {
            if (start < stepStart.length - 1) {
                setStart(prev => prev + 1)
            } else {
                setStep(step + 1)
            }
        } else if (step === 1 && selectedIndex !== null) {
            // 선택된 날짜의 회고 페이지로 이동
            push(`/communication/rewind/${weeklyEmpathy[selectedIndex].id}`) // id로 이동
        }
        
    }, [push, selectedIndex, setStep, start, step, stepStart.length, weeklyEmpathy])
    
    useEffect(() => {
        fetchEmpathy().then(noop)
    }, [fetchEmpathy])
    
    return (
        <div
            className='h-full w-full text-24-bold flex flex-col overflow-hidden relative'
        >
            {
                step === 0 && (
                    <div className='w-full h-full flex items-center justify-center'>
                        <RewindView.StepStart text={stepStart[start].text}/>
                    </div>
                )
            }
            {
                step === 1 && (
                    <div className='w-full h-full flex flex-col items-center justify-start px-5 overflow-y-scroll mb-[100px]'>
                        <div className='w-full flex justify-center items-start shrink-0'>
                            <span className='text-20-bold text-[#3674B5]'>
                                지빈의 일주일 감정 발자국
                            </span>
                            <Image
                                src='/images/character/excited.png'
                                alt='excited'
                                width={80}
                                height={80}
                                className='-translate-y-5'
                            />
                        </div>
                        {
                            !isEmpty(weeklyEmpathy) && weeklyEmpathy.length > 0 && weeklyEmpathy[0].id !== 'no-data' && (
                                <div className='w-full flex flex-col items-center text-black shrink-0'>
                                    {
                                        weeklyEmpathy.map((empathy, index) => (
                                            <Box.RewindDay
                                                key={empathy.id}
                                                empathy={empathy}
                                                index={index}
                                                isLast={index === weeklyEmpathy.length - 1}
                                                selected={index === selectedIndex}
                                                onClick={() => setSelectedIndex(index)}
                                            />
                                        ))
                                    }
                                </div>
                            )
                        }
                    </div>
                )
            }
            <RewindView.FooterComponent
                buttonText={step === 0 ? stepStart[start]?.footerText : '이 날의 나와 대화하기'}
                onClick={footerButtonOnClick}
                disabled={step === 1 && selectedIndex === null}
            />
        </div>
    )
}

export default RewindPage