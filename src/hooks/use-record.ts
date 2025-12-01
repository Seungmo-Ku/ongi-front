import { collection, doc, getDocs, getFirestore, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, Timestamp, where } from '@firebase/firestore'
import { useAccount } from '@/components/layout/account-context-provider'
import { RecordCreateRequest, RecordQuestionRequest, RecordQuestionResponse } from '@/libs/dto/record.dto'
import app from '../../firebaseConfig'
import { IRecord, Record } from '@/libs/interfaces/record.interface'
import { useCallback } from 'react'
import axios from 'axios'
import { Badge, IBadge } from '@/libs/interfaces/badge.interface'


export const useRecord = () => {
    const firestore = getFirestore(app)
    const { account, user } = useAccount()
    const BASE_URL = process.env.NEXT_PUBLIC_FUNCTIONS_BASE_URL
    
    const createRecord = useCallback(async (request: RecordCreateRequest) => {
        if (!account?.uid) return false
        
        const recordDocRef = doc(firestore, 'Record', `${request.uid}_${Date.now()}`)
        try {
            await setDoc(recordDocRef, {
                uid: request.uid,
                imageUrl: request.imageUrl,
                question: request.question,
                answer: request.answer,
                createdAt: new Date(),
                category: request?.category || ''
            })
            return true
        } catch {
            return false
        }
    }, [account?.uid, firestore])
    
    const getMonthlyRecords = useCallback(async (date: Date) => {
        if (!account?.uid) return {}
        try {
            // 1. 쿼리할 날짜 범위 계산
            // 시작일: 해당 월의 1일 00:00:00
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
            // 종료일: 다음 달의 1일 00:00:00 (종료 범위는 exclusive)
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
            
            // 2. Firestore 쿼리 생성
            const recordsRef = collection(firestore, 'Record')
            const q = query(
                recordsRef,
                where('uid', '==', account.uid), // **중요**: 현재 로그인한 유저의 데이터만!
                where('createdAt', '>=', Timestamp.fromDate(startDate)),
                where('createdAt', '<', Timestamp.fromDate(endDate))
            )
            
            // 3. 쿼리 실행 및 데이터 가공
            const querySnapshot = await getDocs(q)
            const recordsMap: { [day: number]: Record } = {}
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                
                const recordData: IRecord = {
                    uid: data.uid,
                    imageUrl: data.imageUrl,
                    question: data.question,
                    answer: data.answer,
                    createdAt: data.createdAt.toDate(),
                    id: doc.id
                }
                const recordDate = data.createdAt.toDate()
                const dayOfMonth = recordDate.getDate() // 날짜(일)를 키로 사용
                recordsMap[dayOfMonth] = new Record(recordData)
            })
            
            return recordsMap
            
        } catch {
            return {}
        }
    }, [account?.uid, firestore])
    
    const getWeeklyRecords = useCallback(async (date: Date) => {
        if (!account?.uid) return {}
        try {
            // 1. 쿼리할 날짜 범위 계산
            // (수정됨) date.getDate() - date.getDay()를 사용해 해당 주의 일요일 날짜를 계산합니다.
            const startDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() - date.getDay()
            )
            const endDate = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate() + 7
            )
            
            // 2. Firestore 쿼리 생성
            const recordsRef = collection(firestore, 'Record')
            const q = query(
                recordsRef,
                where('uid', '==', account.uid),
                where('createdAt', '>=', Timestamp.fromDate(startDate)),
                where('createdAt', '<', Timestamp.fromDate(endDate))
            )
            
            const querySnapshot = await getDocs(q)
            
            // 3. (수정됨) recordsMap의 키를 요일(0~6)로 사용
            const recordsMap: { [day: number]: Record } = {}
            
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                
                const recordData: IRecord = {
                    uid: data.uid,
                    imageUrl: data.imageUrl,
                    question: data.question,
                    answer: data.answer,
                    createdAt: data.createdAt.toDate(),
                    id: doc.id
                }
                
                const recordDate = data.createdAt.toDate()
                
                // (수정됨) getDate() 대신 getDay()를 사용해 요일 인덱스(0=일, 6=토)를 가져옵니다.
                const dayOfWeek = recordDate.getDay()
                
                // (수정됨) 요일을 키로 사용하여 맵에 저장
                recordsMap[dayOfWeek] = new Record(recordData)
            })
            
            return recordsMap // 예: { 0: Record, 2: Record, 5: Record }
            
        } catch (error) { // 에러 핸들링 추가
            console.error('Error fetching weekly records: ', error)
            return {}
        }
    }, [account?.uid, firestore])
    
    const getTodayRecord = useCallback(async (date: Date) => {
        if (!account?.uid) return null
        try {
            const recordsRef = collection(firestore, 'Record')
            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate())
            const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
            const q = query(
                recordsRef,
                where('uid', '==', account.uid),
                where('createdAt', '>=', Timestamp.fromDate(startOfDay)),
                where('createdAt', '<', Timestamp.fromDate(endOfDay))
            )
            const querySnapshot = await getDocs(q)
            if (querySnapshot.empty) {
                return null
            }
            const doc = querySnapshot.docs[0]
            const data = doc.data()
            const recordData: IRecord = {
                uid: data.uid,
                imageUrl: data.imageUrl,
                question: data.question,
                answer: data.answer,
                createdAt: data.createdAt.toDate(),
                id: doc.id
            }
            return new Record(recordData)
        } catch {
            return null
        }
    }, [account?.uid, firestore])
    
    const getQuestion = useCallback(async (Request: RecordQuestionRequest) => {
        if (!BASE_URL || !user) return null
        
        try {
            const token = await user.getIdToken()
            const response = await axios.post(`${BASE_URL}/question`, Request, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                return response.data as RecordQuestionResponse
            } else {
                return null
            }
        } catch {
            return null
        }
    }, [BASE_URL, user])
    
    const getAllRecordsCount = useCallback(async () => {
        if (!account?.uid) return 0
        try {
            const recordsRef = collection(firestore, 'Record')
            const q = query(
                recordsRef,
                where('uid', '==', account.uid)
            )
            
            // 3. 쿼리 실행 및 데이터 가공
            const querySnapshot = await getDocs(q)
            return querySnapshot.size
        } catch {
            return 0
        }
    }, [account?.uid, firestore])
    
    const getMonthlyRecordsCount = useCallback(async () => {
        if (!account?.uid) return 0
        try {
            const date = new Date()
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1)
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
            
            const recordsRef = collection(firestore, 'Record')
            const q = query(
                recordsRef,
                where('uid', '==', account.uid), // **중요**: 현재 로그인한 유저의 데이터만!
                where('createdAt', '>=', Timestamp.fromDate(startDate)),
                where('createdAt', '<', Timestamp.fromDate(endDate))
            )
            
            // 3. 쿼리 실행 및 데이터 가공
            const querySnapshot = await getDocs(q)
            return querySnapshot.size
        } catch {
            return 0
        }
    }, [account?.uid, firestore])
    
    const get100QnA = useCallback(async ({ pageParam, pageLimit }: { pageParam: unknown, pageLimit: number }) => {
        if (!account?.uid) return { records: [], lastVisible: undefined }
        try {
            const recordsRef = collection(firestore, 'Record')
            const baseQuery = query(recordsRef,
                where('uid', '==', account.uid),
                orderBy('createdAt', 'desc'),
                limit(pageLimit)
            )
            
            const finalQuery = pageParam ? query(baseQuery, startAfter(pageParam as QueryDocumentSnapshot)) : baseQuery
            const querySnapshot = await getDocs(finalQuery)
            if (querySnapshot.empty) {
                return { records: [], lastVisible: undefined }
            }
            const records: Record[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const recordData: IRecord = {
                    uid: data.uid,
                    imageUrl: data.imageUrl,
                    question: data.question,
                    answer: data.answer,
                    createdAt: data.createdAt.toDate(),
                    id: doc.id
                }
                records.push(new Record(recordData))
            })
            
            const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
            return { records, lastVisible }
            
        } catch (err: unknown) {
            console.log('Error fetching 100 QnA records:', err)
            return { records: [], lastVisible: undefined }
        }
    }, [account?.uid, firestore])
    
    const getLastRecords = useCallback(async () => {
        if (!account?.uid) return { records: [], count: 0 }
        try {
            const recordsRef = collection(firestore, 'Record')
            const allCount = await getAllRecordsCount()
            const howManyToFetch = allCount % 7
            const q = query(recordsRef,
                where('uid', '==', account.uid),
                orderBy('createdAt', 'desc'),
                limit(howManyToFetch)
            )
            
            const querySnapshot = await getDocs(q)
            const records: Record[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const recordData: IRecord = {
                    uid: data.uid,
                    imageUrl: data.imageUrl,
                    question: data.question,
                    answer: data.answer,
                    createdAt: data.createdAt.toDate(),
                    id: doc.id
                }
                records.push(new Record(recordData))
            })
            
            return { records: records.reverse(), count: howManyToFetch }
        } catch {
            return { records: [], count: 0 }
        }
    }, [account?.uid, firestore, getAllRecordsCount])
    
    const getBadge = useCallback(async () => {
        if (!BASE_URL || !user) return null
        try {
            const token = await user.getIdToken()
            axios.post(`${BASE_URL}/badge`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return null
        } catch {
            return null
        }
    }, [BASE_URL, user])
    
    const isUncheckedBadge = useCallback(async () => {
        if (!account?.uid) return false
        try {
            const badgesRef = collection(firestore, 'Badges')
            const q = query(
                badgesRef,
                where('uid', '==', account.uid),
                where('checked', '==', false)
            )
            const querySnapshot = await getDocs(q)
            return !querySnapshot.empty
        } catch {
            return false
        }
    }, [account?.uid, firestore])
    
    const setAllBadgesChecked = useCallback(async () => {
        if (!account?.uid) return false
        try {
            const badgesRef = collection(firestore, 'Badges')
            const q = query(
                badgesRef,
                where('uid', '==', account.uid),
                where('checked', '==', false)
            )
            const querySnapshot = await getDocs(q)
            const batchPromises = querySnapshot.docs.map((doc) => {
                const badgeDocRef = doc.ref
                return setDoc(badgeDocRef, { checked: true }, { merge: true })
            })
            await Promise.all(batchPromises)
            return true
        } catch {
            return false
        }
    }, [account?.uid, firestore])
    
    const getAllBadges = useCallback(async () => {
        if (!account?.uid) return []
        try {
            const badgesRef = collection(firestore, 'Badges')
            const q = query(
                badgesRef,
                where('uid', '==', account.uid),
                orderBy('createdAt', 'desc')
            )
            const querySnapshot = await getDocs(q)
            const badges: Badge[] = []
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                const badge: IBadge = {
                    id: doc.id,
                    perspective_1: data.perspective_1,
                    perspective_2: data.perspective_2,
                    perspective_3: data.perspective_3,
                    selected: data.selected,
                    checked: data.checked,
                    createdAt: data.createdAt.toDate(),
                    imageUrl: data.imageUrl || ''
                }
                badges.push(new Badge(badge))
            })
            return badges
        } catch {
            return []
        }
    }, [account?.uid, firestore])
    
    const selectBadge = useCallback(async (id: string, index: number) => {
        if (!account?.uid) return false
        try {
            const badgeDocRef = doc(firestore, 'Badges', id)
            await setDoc(badgeDocRef, { selected: index }, { merge: true })
            return true
        } catch {
            return false
        }
    }, [account?.uid, firestore])
    
    return {
        createRecord, getMonthlyRecords, getWeeklyRecords, getQuestion, getTodayRecord, selectBadge,
        getAllRecordsCount, getMonthlyRecordsCount, get100QnA, getLastRecords, getBadge, isUncheckedBadge, setAllBadgesChecked, getAllBadges
    }
}