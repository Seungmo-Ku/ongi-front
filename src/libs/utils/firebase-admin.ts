import admin, { ServiceAccount } from 'firebase-admin'

if (!admin.apps.length) {
    const serviceAccount: ServiceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.NEXT_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.NEXT_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    })
}

export { admin }