import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { admin } from '@/libs/utils/firebase-admin'


export async function DELETE() {
    try {
        // 1. 토큰 검증 (본인 확인)
        const authorization = (await headers()).get('Authorization')
        if (!authorization || !authorization.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const idToken = authorization.split('Bearer ')[1]
        
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        const uid = decodedToken.uid
        
        console.log(`회원 탈퇴 요청: ${uid}`)
        
        // 2. Firestore 데이터 삭제 (Account 문서)
        // (accounts 컬렉션 외에 'records' 등 다른 컬렉션도 있다면 여기서 같이 지워야 합니다)
        await admin.firestore().collection('Accounts').doc(uid).delete()
        
        const recordsRef = admin.firestore().collection('Record')
        const snapshot = await recordsRef.where('uid', '==', uid).get()
        
        if (!snapshot.empty) {
            const batch = admin.firestore().batch()
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref)
            })
            await batch.commit()
            console.log(`Record 문서 ${snapshot.size}개 삭제 완료`)
        }
        
        try {
            await admin.storage().bucket().deleteFiles({
                prefix: `uploads/${uid}/`
            })
        } catch (e) {
            console.log('Storage 삭제 중 오류 (무시가능):', e)
        }
        
        // 3. Firebase Auth 계정 삭제 (가장 중요)
        await admin.auth().deleteUser(uid)
        
        return NextResponse.json({ success: true, message: '계정이 삭제되었습니다.' })
        
    } catch (error: unknown) {
        console.error('회원 탈퇴 실패:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}