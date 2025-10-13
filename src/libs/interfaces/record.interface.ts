export interface IRecord {
    id: string
    uid: string
    imageUrl: string
    createdAt: Date
    question: string
    answer: string
}

export class Record implements IRecord {
    id: string
    uid: string
    imageUrl: string
    createdAt: Date
    question: string
    answer: string
    
    constructor(data: IRecord) {
        this.id = data.id
        this.uid = data.uid
        this.imageUrl = data.imageUrl
        this.createdAt = new Date(data.createdAt)
        this.question = data.question
        this.answer = data.answer
    }
}