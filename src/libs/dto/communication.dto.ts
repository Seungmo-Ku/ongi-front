export interface CommunicationStep1Request {
    uid: string
    sid: string
    message: string
}

export interface CommunicationStep1Response {
    chats: string[]
    done: boolean
}

export interface CommunicationStep2Request {
    uid: string
    sid: string
    emotion: string[]
}

export interface CommunicationStep2Response {
    chats: string[]
}

export type CommunicationStep3Request = CommunicationStep1Request

export type CommunicationStep3Response = CommunicationStep1Response

export interface CommunicationSummaryRequest {
    uid: string
    sid: string
}

export interface CommunicationSummaryResponse {
    summary: string
}