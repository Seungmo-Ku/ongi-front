import { Chat } from '@/components/view/communication/chat-log'


export interface ISelfEmpathy {
    id: string
    uid: string
    chats: Chat[]
    createdAt: Date
    emotion: string
    finished: boolean
    isRemind: boolean
    summary: string
    reviewSummary?: string
}

export class SelfEmpathy implements ISelfEmpathy {
    id: string
    uid: string
    chats: Chat[]
    createdAt: Date
    emotion: string
    finished: boolean
    isRemind: boolean
    summary: string
    reviewSummary?: string
    
    constructor(data: ISelfEmpathy) {
        this.id = data.id
        this.uid = data.uid
        this.chats = data.chats
        this.createdAt = data.createdAt
        this.emotion = data.emotion
        this.finished = data.finished
        this.isRemind = data.isRemind
        this.summary = data.summary
        this.reviewSummary = data.reviewSummary || ''
    }
}