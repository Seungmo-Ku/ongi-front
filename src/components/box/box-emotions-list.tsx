'use client'

import Button from '@/components/button'
import { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'


const EMOTION_LIST = {
    positive: [
        '감사한', '고마운', '가슴뭉클한', '감동한', '벅찬', '기대되는', '희망을 느끼는', '설레는', '긴장이 풀리는',
        '안심이 되는', '진정되는', '편안한', '안락한', '평화로운', '당당한', '자신있는', '떳떳한', '상쾌한', '개운한',
        '생기가 도는', '활력이 넘치는', '살아있는', '정겨운', '친근한', '신나는', '재미있는', '즐거운', '행복한', '기쁜',
        '흥분되는', '짜릿한', '통쾌한', '속 시원한', '흐뭇한', '만족스러운', '보람찬', '사랑이 가득한', '애정하는', '사랑받는', '다행스러운'
    ],
    neutral: [
        '평온한', '조용한', '차분한', '무심한', '집중된', '알아차린', '존재감있는', '신중한', '놀란', '기대없는',
        '명료한', '관찰중인', '궁금한', '지루한', '긴장된', '몽롱한', '주의집중된', '시원섭섭한'
    ],
    negative: [
        '걱정스러운', '겁나는', '무서운', '두려운', '불안한', '조바심나는', '초조한', '간절한', '애끓는',
        '주눅드는', '난처한', '곤혹스러운', '신경 쓰이는', '꺼림칙한', '불편한', '부담스러운', '미운',
        '원망스러운', '못마땅한', '답답한', '막막한', '당혹스러운', '어이없는', '혼란스러운', '싱숭생숭한',
        '괴로운', '고통스러운', '속상한', '슬픈', '서운한', '섭섭한', '억울한', '서러운', '화나는', '짜증나는',
        '울화가 치미는', '역겨운', '정떨어지는', '한심스러운', '실망스러운', '낙담한', '좌절감이 드는', '절망스러운',
        '열등감 느끼는', '부러운', '질투 나는', '부끄러운', '허탈한', '후회스러운', '아쉬운', '안타까운', '지친',
        '피곤한', '힘든', '무기력한', '심심한', '지겨운', '귀찮은', '우울한', '쓸쓸한', '외로운', '허전한', '허무한',
        '미안한', '떨리는', '고민되는', '그리운', '아련한', '초연한'
    ]
}

interface BoxEmotionsListProps {
    emotionList: string[]
    setEmotionList: (emotions: string[]) => void
}
export const BoxEmotionsList = ({
    emotionList,
    setEmotionList
}: BoxEmotionsListProps) => {
    
    const [emotion, setEmotion] = useState<'positive' | 'neutral' | 'negative'>('positive')
    
    const emotionTab = useMemo(() => {
        switch (emotion) {
            case 'positive':
                return EMOTION_LIST.positive
            case 'neutral':
                return EMOTION_LIST.neutral
            case 'negative':
                return EMOTION_LIST.negative
        }
    }, [emotion])
    
    const isSelected = useCallback((item: string) => {
        return emotionList.includes(item)
    }, [emotionList])
    
    const tabComponent = useCallback((category: 'positive' | 'neutral' | 'negative') => {
        return (
            <Image
                src={`/images/character/emotion/${category}.svg`}
                alt={category}
                width={64}
                height={82}
                onClick={() => setEmotion(category)}
                className='transition duration-300 active:scale-95 cursor-pointer'
            />
        )
    }, [])
    
    return (
        <div className='w-full flex flex-col overflow-hidden gap-y-2 mb-20'>
            <div className='flex flex-row items-center justify-center gap-x-3'>
                {tabComponent('positive')}
                {tabComponent('neutral')}
                {tabComponent('negative')}
            </div>
            <div className='w-full max-h-[300px] shrink-0 grid grid-cols-3 gap-x-1 gap-y-1.5 overflow-y-scroll rounded-[20px] backdrop-blur-xs bg-white/60 p-2.5 items-start justify-start'>
                {
                    emotionTab.map((item, index) => (
                        <Button.Emotion
                            key={`emotion-${emotion}-${index}`}
                            selected={isSelected(item)}
                            onClick={() => {
                                if (isSelected(item)) {
                                    setEmotionList(emotionList.filter(e => e !== item))
                                } else {
                                    setEmotionList([...emotionList, item])
                                }
                            }}
                        >
                            {item}
                        </Button.Emotion>
                    ))
                }
            </div>
        </div>
    )
}