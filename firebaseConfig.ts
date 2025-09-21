// firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app'


const firebaseConfig = {
    apiKey: 'AIzaSyA4hSWNe7NGf3ZjDOx6qEkkEgrXqPin0O4',
    authDomain: 'jerry-a9e31.firebaseapp.com',
    projectId: 'jerry-a9e31',
    storageBucket: 'jerry-a9e31.firebasestorage.app',
    messagingSenderId: '375283204113',
    appId: '1:375283204113:web:717bc91a1a271311d631b0',
    measurementId: 'G-WDTSGF9Y5F'
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

export default app
