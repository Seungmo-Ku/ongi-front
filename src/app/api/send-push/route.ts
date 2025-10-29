import { NextResponse } from 'next/server'
import { admin } from '@/libs/utils/firebase-admin'


/**
 * 푸시 알림을 발송하는 API
 * (호출 예: POST /api/send-push)
 *
 * @body {
 * "token": "eJ1s...APA91bH", // (필수) 알림을 받을 기기의 푸시 토큰
 * "title": "알림 제목",
 * "body": "알림 본문",
 * "deepLink": "https://ongi-front.vercel.app/calendar/2025-10-29" // (딥링크 URL)
 * }
 */
export async function POST(request: Request) {
    try {
        // 1. 클라이언트(스케줄러 등)로부터 요청 정보 받기
        const body = await request.json()
        const { token, title, body: messageBody, deepLink } = body
        
        if (!token) {
            return NextResponse.json({ error: '푸시 토큰(token)이 필요합니다.' }, { status: 400 })
        }
        
        // 2. FCM(브릿지)에 보낼 메시지 페이로드 구성
        const message = {
            // (A) 사용자에게 "보이는" 알림
            notification: {
                title: title || '새로운 알림',
                body: messageBody || '새로운 내용이 도착했습니다.'
            },
            
            // (B) 딥링크 등 "숨겨진" 데이터
            // (이 'data' 객체가 딥링크의 핵심입니다!)
            data: {
                link: deepLink || 'https://ongi-front.vercel.app' // 'link'라는 키로 URL 저장
            },
            
            // (C) 알림을 보낼 대상 토큰
            token: token
        }
        
        // 3. FCM(브릿지)에 메시지 발송 요청
        const response = await admin.messaging().send(message)
        
        console.log('푸시 알림 전송 성공:', response)
        return NextResponse.json({ success: true, messageId: response }, { status: 200 })
        
    } catch (error: any) {
        console.error('푸시 알림 전송 실패:', error)
        
        // FCM이 보낸 에러 코드(예: 'messaging/invalid-token')를 반환
        return NextResponse.json({ success: false, error: error.code || error.message }, { status: 500 })
    }
}