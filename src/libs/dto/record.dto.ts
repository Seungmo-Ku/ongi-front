import { IRecord } from '@/libs/interfaces/record.interface'


export type RecordCreateRequest = Pick<IRecord, 'imageUrl' | 'question' | 'answer' | 'uid'>

export type RecordResponse = IRecord

export interface RecordQuestionRequest {
    imageUrl: string
}

export interface RecordQuestionResponse {
    question: string
}