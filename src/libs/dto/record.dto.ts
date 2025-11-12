import { IRecord } from '@/libs/interfaces/record.interface'


export type RecordCreateRequest = Pick<IRecord, 'imageUrl' | 'question' | 'answer' | 'uid' | 'category'>

export type RecordResponse = IRecord

export interface RecordQuestionRequest {
    imageUrl: string
    uploadCount: number
}

export interface RecordQuestionResponse {
    question: string
    category: string
}