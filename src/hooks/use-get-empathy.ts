'use client'

import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, Timestamp, where } from '@firebase/firestore'
import app from '../../firebaseConfig'
import { ISelfEmpathy, SelfEmpathy } from '@/libs/interfaces/self-empathy.interface'
import { SelfEmpathyCreateRequest } from '@/libs/dto/selfempathy.dto'
import { useGetCommunicationResponse } from '@/hooks/use-get-communication-response'
import { useAccount } from '@/components/layout/account-context-provider'


export const useGetEmpathy = () => {
    const firestore = getFirestore(app)
    const { account } = useAccount()
    const { getCommunicationSummary } = useGetCommunicationResponse()
    
    const getFinalWeekRange = (now: Date, createdAt: Date) => {
        // 1. KST 기준으로 시간 보정
        const kstNow = new Date(now)
        kstNow.setHours(kstNow.getHours() + 9)
        
        const kstCreatedAt = new Date(createdAt)
        kstCreatedAt.setHours(kstCreatedAt.getHours() + 9)
        
        // 2. 기준 요일 및 현재 요일 찾기
        const creationDayOfWeek = kstCreatedAt.getDay() // 0:일, 1:월, ...
        const currentDayOfWeek = kstNow.getDay()
        
        // 3. '이번 주 앵커 날짜' 우선 계산
        const thisWeeksSunday = new Date(kstNow)
        thisWeeksSunday.setDate(kstNow.getDate() - currentDayOfWeek)
        
        const anchorDate = new Date(thisWeeksSunday)
        anchorDate.setDate(thisWeeksSunday.getDate() + creationDayOfWeek)
        
        // 4. ✨ 새로운 규칙 적용 ✨
        // 만약 오늘 요일이 기준 요일보다 앞서면 (아직 이번 주 기준 요일이 안 왔으면)
        // 앵커 날짜를 7일 전, 즉 '지난주 앵커 날짜'로 변경한다.
        if (currentDayOfWeek < creationDayOfWeek) {
            anchorDate.setDate(anchorDate.getDate() - 7)
        }
        
        // 5. 최종 범위 계산 (이전과 동일)
        const endDate = new Date(anchorDate)
        endDate.setDate(anchorDate.getDate() - 1)
        endDate.setHours(23, 59, 59, 999)
        
        const startDate = new Date(endDate)
        startDate.setDate(endDate.getDate() - 6)
        startDate.setHours(0, 0, 0, 0)
        
        // 6. UTC로 변환하여 반환
        startDate.setHours(startDate.getHours() - 9)
        endDate.setHours(endDate.getHours() - 9)
        
        return { start: startDate, end: endDate }
    }
    
    const enableRewind = () => {
        if (!account) return false
        
        // 1. 가입일(createdAt)을 KST 기준으로 변환하고 요일을 구합니다.
        const createdAt = new Date(account.createdAt)
        // KST 변환 시 account.createdAt 원본이 아닌 Date 객체를 사용해야 합니다.
        createdAt.setHours(createdAt.getHours() + 9)
        const createdDayOfWeek = createdAt.getDay() // 0:일, 1:월, ..., 6:토
        
        // 2. 활성화되어야 할 요일을 계산합니다. (가입 요일 - 1)
        // (createdDayOfWeek - 1 + 7) % 7 로직:
        // - 월요일(1)이면 (1-1+7)%7 = 0 (일요일)
        // - 일요일(0)이면 (0-1+7)%7 = 6 (토요일) -> 마이너스 값 방지
        const activationDay = (createdDayOfWeek - 1 + 7) % 7
        
        // 3. 현재 시각을 KST 기준으로 변환하고 오늘 요일을 구합니다.
        const now = new Date()
        now.setHours(now.getHours() + 9)
        const currentDayOfWeek = now.getDay()
        
        // 4. 오늘 요일과 활성화되어야 할 요일이 같은지 비교하여 반환합니다.
        return currentDayOfWeek === activationDay
    }
    
    const getWeeklyEmpathy = async (week?: Date) => {
        if (!account?.uid) return null
        
        const { start, end } = getFinalWeekRange(week ? new Date(week) : new Date(), new Date(account.createdAt))
        const weeklyEmpathyQuery = query(
            collection(firestore, 'SelfEmpathy'),
            where('uid', '==', account.uid),
            where('isRemind', '==', false),
            where('createdAt', '>=', Timestamp.fromDate(start)),
            where('createdAt', '<=', Timestamp.fromDate(end))
        )
        
        const querySnapshot = await getDocs(weeklyEmpathyQuery)
        const empathies: SelfEmpathy[] = []
        querySnapshot.forEach((doc) => {
            const empathy = doc.data() as ISelfEmpathy
            empathies.push(new SelfEmpathy({
                ...empathy,
                reviewSummary: doc.data().reviewSummary || '',
                createdAt: doc.data().createdAt instanceof Timestamp ? doc.data().createdAt.toDate() : empathy.createdAt,
                id: doc.id
            }))
        })
        if (empathies.length === 0) return [
            {
                id: 'no-data',
                uid: account.uid,
                chats: [],
                createdAt: new Date(),
                emotion: '',
                finished: true,
                isRemind: false,
                summary: '이번 주에 기록된 회고가 없어요. 지난 일주일 동안의 마음을 돌아보고, 새로운 한 주를 맞이해요!',
                reviewSummary: ''
            }
        ]
        return empathies
    }
    
    const getEmpathy = async (id: string) => {
        
        const docRef = doc(firestore, 'SelfEmpathy', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const empathy = docSnap.data() as ISelfEmpathy
            return new SelfEmpathy({
                ...empathy,
                createdAt: docSnap.data().createdAt instanceof Timestamp ? docSnap.data().createdAt.toDate() : empathy.createdAt,
                id: docSnap.id
            })
        } else {
            return null
        }
    }
    
    const getEmpathyByDate = async (date: Date, isRemind: boolean = false) => {
        if (!account?.uid) return null
        date.setHours(date.getHours() + 9) // KST로 변환
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)
        startOfDay.setHours(startOfDay.getHours() - 9) // UTC로 변환
        endOfDay.setHours(endOfDay.getHours() - 9) // UTC로 변환
        
        const empathyQuery = query(
            collection(firestore, 'SelfEmpathy'),
            where('uid', '==', account.uid),
            where('isRemind', '==', isRemind),
            where('createdAt', '>=', Timestamp.fromDate(startOfDay)),
            where('createdAt', '<=', Timestamp.fromDate(endOfDay))
        )
        
        const querySnapshot = await getDocs(empathyQuery)
        const empathies: SelfEmpathy[] = []
        
        querySnapshot.forEach((doc) => {
            const empathy = doc.data() as ISelfEmpathy
            empathies.push(new SelfEmpathy({
                ...empathy,
                createdAt: doc.data().createdAt instanceof Timestamp ? doc.data().createdAt.toDate() : empathy.createdAt,
                id: doc.id
            }))
        })
        
        if (empathies.length === 0) return null
        return empathies[0] // 해당 날짜에 여러 개가 있을 경우 첫 번째 것 반환
    }
    
    const createEmpathy = async (request: SelfEmpathyCreateRequest) => {
        if (!account?.uid) return false
        const response = await getCommunicationSummary({
            uid: request.uid,
            sid: request.sid
        })
        if (response) {
            const selfEmpathyDocRef = doc(firestore, 'SelfEmpathy', `${request.uid}_${request.sid}_${Date.now()}`)
            await setDoc(selfEmpathyDocRef, {
                uid: request.uid,
                chats: request.chats,
                createdAt: new Date(),
                emotion: request.emotion,
                finished: request.finished,
                isRemind: request.isRemind,
                summary: response.summary,
                reviewSummary: response.reviewSummary
            })
            return true
        }
        return false
    }
    
    return { getWeeklyEmpathy, createEmpathy, getEmpathy, getEmpathyByDate, enableRewind }
}