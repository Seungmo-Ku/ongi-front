import { NextResponse } from 'next/server'
import { admin } from '@/libs/utils/firebase-admin'


export async function GET(request: Request) {
    // TODO. 크론잡 보안 강화 필요
    // const authorization = headers().get('Authorization')
    // if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }
    
    try {
        // 2. (효율적인 쿼리) "토큰이 일단 있는" 유저만 쿼리
        const accountsRef = admin.firestore().collection('Accounts')
        const snapshot = await accountsRef.where('fcmToken', '>', '').get()
        
        if (snapshot.empty) {
            return NextResponse.json({ message: '알림 보낼 유저가 없음.' })
        }
        
        const tokensToUserMap = new Map<string, string>() // [token, uid]
        snapshot.forEach(doc => {
            const token = doc.data().fcmToken
            if (token && token !== 'invalid-token') {
                tokensToUserMap.set(token, doc.id) // doc.id가 uid일 경우
            }
        })
        
        const validTokens = Array.from(tokensToUserMap.keys())
        if (validTokens.length === 0) {
            return NextResponse.json({ message: '유효한 토큰을 가진 유저가 없음.' })
        }
        
        const message = {
            notification: {
                title: '오늘의 기록 ✏️',
                body: '하루를 마무리하며 오늘의 기록을 남겨보는 건 어떨까요?'
            },
            data: {
                link: 'https://ongi-front.vercel.app/record' // 캘린더 페이지로 딥링크
            },
            tokens: validTokens // (중요) 500개 미만이므로 토큰 배열을 그냥 통째로 전달
        }
        
        const response = await admin.messaging().sendEachForMulticast(message)
        const successCount = response.successCount
        // const tokensToRemove: string[] = []
        
        // 6. (셀프 힐링) 만료된 토큰(실패한 토큰) 찾기
        // response.responses.forEach((resp, idx) => {
        //     if (!resp.success) {
        //         const errorCode = resp.error?.code
        //         if (errorCode === 'messaging/registration-token-not-registered' ||
        //             errorCode === 'messaging/invalid-registration-token') {
        //             tokensToRemove.push(validTokens[idx])
        //         }
        //     }
        // })
        //
        // // 7. (셀프 힐링) 만료된 토큰을 DB에서 업데이트
        // if (tokensToRemove.length > 0) {
        //     const batch = admin.firestore().batch()
        //     for (const token of tokensToRemove) {
        //         const uid = tokensToUserMap.get(token)
        //         if (uid) {
        //             const userRef = admin.firestore().collection('accounts').doc(uid)
        //             batch.update(userRef, { fcmToken: 'invalid-token' })
        //         }
        //     }
        //     await batch.commit()
        // }
        
        return NextResponse.json({
            success: true,
            // message: `${successCount}명에게 알림 전송 완료. 만료된 토큰 ${tokensToRemove.length}개 정리.`
            message: `${successCount}명에게 알림 전송 완료.`
        })
        
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
    }
}