'use client'

import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, Timestamp, where } from '@firebase/firestore'
import app from '../../firebaseConfig'
import useAccount from '@/hooks/use-account'
import { ISelfEmpathy, SelfEmpathy } from '@/libs/interfaces/self-empathy.interface'
import { SelfEmpathyCreateRequest } from '@/libs/dto/selfempathy.dto'
import { useGetCommunicationResponse } from '@/hooks/use-get-communication-response'


export const useGetEmpathy = () => {
    const firestore = getFirestore(app)
    const { account } = useAccount()
    const { getCommunicationSummary } = useGetCommunicationResponse()
    
    const getKSTDateRangeOfThisWeek = (now: Date) => {
        now.setHours(now.getHours() + 9)
        
        const dayOfWeek = now.getDay() // 일:0, 월:1, ..., 토:6
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        const monday = new Date(now)
        monday.setDate(now.getDate() + diffToMonday)
        monday.setHours(0, 0, 0, 0)
        
        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)
        sunday.setHours(23, 59, 59, 999)
        
        // UTC로 다시 변환 (쿼리에 쓸 Date 객체)
        monday.setHours(monday.getHours() - 9)
        sunday.setHours(sunday.getHours() - 9)
        
        return { start: monday, end: sunday }
    }
    
    const getWeeklyEmpathy = async (week?: Date) => {
        if (!account?.uid) return null
        
        const { start, end } = getKSTDateRangeOfThisWeek(week ? new Date(week) : new Date())
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
                createdAt: doc.data().createdAt instanceof Timestamp ? doc.data().createdAt.toDate() : empathy.createdAt,
                id: doc.id
            }))
        })
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
                summary: response.summary
            })
            return true
        }
        return false
    }
    
    return { getWeeklyEmpathy, createEmpathy, getEmpathy }
}