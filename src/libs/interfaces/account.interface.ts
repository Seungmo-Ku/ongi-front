export interface IAccount {
    uid: string
    email: string
    createdAt: Date
    updatedAt: Date
    exp: number
    level: number
    nickname?: string
    fcmToken?: string
}

export class Account implements IAccount {
    uid: string
    email: string
    createdAt: Date
    updatedAt: Date
    exp: number
    level: number
    nickname?: string
    fcmToken?: string

    constructor(account: IAccount) {
        this.uid = account.uid
        this.email = account.email
        this.createdAt = new Date(account.createdAt)
        this.updatedAt = new Date(account.updatedAt)
        this.exp = account.exp || 0
        this.level = account.level || 0
        this.nickname = account.nickname || ''
        this.fcmToken = account.fcmToken || ''
    }
}